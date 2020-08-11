"use strict";
/**
 * @license
 * Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tfjs_core_1 = require("@tensorflow/tfjs-core");
var types_1 = require("./types");
function registerBinaryKernel(kernelName, supportsFullBroadcast, dtype) {
    var wasmFunc;
    function setupFunc(backend) {
        wasmFunc = backend.wasm.cwrap(kernelName, null /* void */, [
            'number',
            'array',
            'number',
            'number',
            'array',
            'number',
            'number',
            'number' // out_id
        ]);
    }
    function kernelFunc(args) {
        var backend = args.backend, inputs = args.inputs;
        var a = inputs.a, b = inputs.b;
        var aId = backend.dataIdMap.get(a.dataId).id;
        var bId = backend.dataIdMap.get(b.dataId).id;
        var outputType = dtype != null ? dtype : a.dtype;
        var newShape = tfjs_core_1.backend_util.assertAndGetBroadcastShape(a.shape, b.shape);
        var out = backend.makeOutput(newShape, outputType);
        // Short-circuit zero-sized tensors.
        if (tfjs_core_1.util.sizeFromShape(newShape) === 0) {
            return out;
        }
        var aShapeBytes = new Uint8Array(new Int32Array(a.shape).buffer);
        var bShapeBytes = new Uint8Array(new Int32Array(b.shape).buffer);
        var outId = backend.dataIdMap.get(out.dataId).id;
        var kernelFunc = function () { return wasmFunc(aId, aShapeBytes, a.shape.length, bId, bShapeBytes, b.shape.length, types_1.CppDType[a.dtype], outId); };
        if (supportsFullBroadcast) {
            kernelFunc();
            return out;
        }
        var aBroadcastDims = tfjs_core_1.backend_util.getBroadcastDims(a.shape, newShape);
        var bBroadcastDims = tfjs_core_1.backend_util.getBroadcastDims(b.shape, newShape);
        var loopsOverAllOfA = aBroadcastDims.every(function (v, i) { return v === i; });
        var loopsOverAllOfB = bBroadcastDims.every(function (v, i) { return v === i; });
        if (loopsOverAllOfA && loopsOverAllOfB) {
            kernelFunc();
            return out;
        }
        else {
            throw new Error("Broadcasting along outer dims is not yet " +
                ("supported for " + kernelName + "."));
        }
    }
    tfjs_core_1.registerKernel({ kernelName: kernelName, backendName: 'wasm', setupFunc: setupFunc, kernelFunc: kernelFunc });
}
exports.registerBinaryKernel = registerBinaryKernel;
//# sourceMappingURL=binary_kernel.js.map