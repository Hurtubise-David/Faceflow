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
var wasmBatchMatMul;
function setup(backend) {
    wasmBatchMatMul = backend.wasm.cwrap('BatchMatMul', null /* void */, [
        'number',
        'array',
        'number',
        'number',
        'array',
        'number',
        'number',
        'number',
        'number' // out_id
    ]);
}
function batchMatMul(args) {
    var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
    var a = inputs.a, b = inputs.b;
    if (a.dtype !== 'float32' || b.dtype !== 'float32') {
        throw new Error("BatchMatMul for non non-float32 tensors not yet supported.");
    }
    var transposeA = attrs.transposeA, transposeB = attrs.transposeB;
    var aId = backend.dataIdMap.get(a.dataId).id;
    var bId = backend.dataIdMap.get(b.dataId).id;
    var leftDim = transposeA ? a.shape[2] : a.shape[1];
    var rightDim = transposeB ? b.shape[1] : b.shape[2];
    var batchDim = a.shape[0];
    var out = backend.makeOutput([batchDim, leftDim, rightDim], a.dtype);
    var outId = backend.dataIdMap.get(out.dataId).id;
    var aShapeBytes = new Uint8Array(new Int32Array(a.shape).buffer);
    var bShapeBytes = new Uint8Array(new Int32Array(b.shape).buffer);
    wasmBatchMatMul(aId, aShapeBytes, a.shape.length, bId, bShapeBytes, b.shape.length, transposeA, transposeB, outId);
    return out;
}
tfjs_core_1.registerKernel({
    kernelName: 'BatchMatMul',
    backendName: 'wasm',
    setupFunc: setup,
    kernelFunc: batchMatMul
});
//# sourceMappingURL=BatchMatMul.js.map