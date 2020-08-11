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
var wasmPadV2;
function setup(backend) {
    wasmPadV2 = backend.wasm.cwrap('PadV2', null /* void */, [
        'number',
        'array',
        'number',
        'number',
        'array',
        'number',
        'number',
    ]);
}
function pad(args) {
    var x = args.inputs.x, backend = args.backend, _a = args.attrs, paddings = _a.paddings, constantValue = _a.constantValue;
    var outShape = paddings.map(function (p, i) { return p[0] /* beforePad */ + x.shape[i] + p[1]; } /* afterPad */);
    var xId = backend.dataIdMap.get(x.dataId).id;
    var out = backend.makeOutput(outShape, x.dtype);
    var outId = backend.dataIdMap.get(out.dataId).id;
    var xShapeBytes = new Uint8Array(new Int32Array(x.shape).buffer);
    var paddingsFlat = [].concat.apply([], paddings);
    var paddingsBytes = new Uint8Array(new Int32Array(paddingsFlat).buffer);
    wasmPadV2(xId, xShapeBytes, x.shape.length, types_1.CppDType[x.dtype], paddingsBytes, constantValue, outId);
    return out;
}
tfjs_core_1.registerKernel({
    kernelName: 'PadV2',
    backendName: 'wasm',
    kernelFunc: pad,
    setupFunc: setup
});
//# sourceMappingURL=PadV2.js.map