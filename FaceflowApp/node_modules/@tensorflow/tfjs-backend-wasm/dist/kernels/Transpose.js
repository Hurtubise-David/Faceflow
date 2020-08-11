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
var wasmTranspose;
function setup(backend) {
    wasmTranspose = backend.wasm.cwrap('Transpose', null /* void */, [
        'number',
        'array',
        'number',
        'number',
        'number',
        'array',
        'number',
    ]);
}
function transpose(args) {
    var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
    // Reduce any dimensions with size one. Lower-rank transpose kernel performs
    // better due to simpler memory access pattern.
    var _a = removeOneSizeDims(inputs.x.shape, attrs.perm), reducedShape = _a[0], perm = _a[1];
    var x = {
        dataId: inputs.x.dataId,
        shape: reducedShape,
        dtype: inputs.x.dtype
    };
    var permIsNoOp = true;
    for (var i = 0; i < perm.length; i++) {
        if (perm[i] !== i) {
            permIsNoOp = false;
        }
    }
    var outShape = computeOutShape(inputs.x.shape, attrs.perm);
    if (permIsNoOp) {
        return { dataId: x.dataId, shape: outShape, dtype: x.dtype };
    }
    var out = backend.makeOutput(outShape, x.dtype);
    var xId = backend.dataIdMap.get(x.dataId).id;
    var outId = backend.dataIdMap.get(out.dataId).id;
    var permBytes = new Uint8Array(new Int32Array(perm).buffer);
    var xShapeBytes = new Uint8Array(new Int32Array(x.shape).buffer);
    wasmTranspose(xId, xShapeBytes, x.shape.length, types_1.CppDType[x.dtype], outId, permBytes, perm.length);
    return out;
}
function computeOutShape(inShape, perm) {
    var outShape = new Array(inShape.length);
    for (var i = 0; i < outShape.length; i++) {
        outShape[i] = inShape[perm[i]];
    }
    return outShape;
}
function removeOneSizeDims(shape, perm) {
    var newShape = [];
    var newPerm = [];
    for (var i = 0; i < shape.length; ++i) {
        if (shape[i] !== 1) {
            newShape.push(shape[i]);
        }
        if (shape[perm[i]] !== 1) {
            newPerm.push(perm[i]);
        }
    }
    for (var i = 0; i < newPerm.length; ++i) {
        var minValIdx = -1;
        for (var j = 0; j < newPerm.length; ++j) {
            if (newPerm[j] >= i &&
                (minValIdx === -1 || newPerm[minValIdx] > newPerm[j])) {
                minValIdx = j;
            }
        }
        newPerm[minValIdx] = i;
    }
    return [newShape, newPerm];
}
tfjs_core_1.registerKernel({
    kernelName: 'Transpose',
    backendName: 'wasm',
    kernelFunc: transpose,
    setupFunc: setup,
});
//# sourceMappingURL=Transpose.js.map