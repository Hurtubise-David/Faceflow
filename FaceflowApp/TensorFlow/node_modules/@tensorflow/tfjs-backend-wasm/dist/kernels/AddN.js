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
var wasmFunc;
function setupFunc(backend) {
    wasmFunc = backend.wasm.cwrap('AddN', null /* void */, [
        'array',
        'number',
        'number',
        'number',
    ]);
}
function addn(args) {
    var inputs = args.inputs, backend = args.backend;
    var out = backend.makeOutput(inputs[0].shape, inputs[0].dtype);
    // Short-circuit zero-sized tensors.
    if (tfjs_core_1.util.sizeFromShape(out.shape) === 0) {
        return out;
    }
    var inputIds = inputs.map(function (x) { return backend.dataIdMap.get(x.dataId).id; });
    var inputIdsBytes = new Uint8Array(new Int32Array(inputIds).buffer);
    var outId = backend.dataIdMap.get(out.dataId).id;
    wasmFunc(inputIdsBytes, inputIds.length, types_1.CppDType[out.dtype], outId);
    return out;
}
tfjs_core_1.registerKernel({
    kernelName: 'AddN',
    backendName: 'wasm',
    setupFunc: setupFunc,
    kernelFunc: addn,
});
//# sourceMappingURL=AddN.js.map