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
function slice(args) {
    var x = args.inputs.x, _a = args.attrs, begin = _a.begin, size = _a.size, backend = args.backend;
    var isContinous = tfjs_core_1.slice_util.isSliceContinous(x.shape, begin, size);
    var xVals = backend.typedArrayFromHeap(x);
    var out = backend.makeOutput(size, x.dtype);
    var outVals = backend.typedArrayFromHeap(out);
    var xStrides = tfjs_core_1.util.computeStrides(x.shape);
    if (isContinous) {
        var flatOffset = tfjs_core_1.slice_util.computeFlatOffset(begin, xStrides);
        outVals.set(xVals.subarray(flatOffset, flatOffset + tfjs_core_1.util.sizeFromShape(size)));
        return out;
    }
    var rank = x.shape.length;
    if (rank === 2) {
        slice2d(xVals, xStrides[0], outVals, begin, size);
    }
    else if (rank === 3) {
        slice3d(xVals, xStrides[0], xStrides[1], outVals, begin, size);
    }
    else if (rank === 4) {
        slice4d(xVals, xStrides[0], xStrides[1], xStrides[2], outVals, begin, size);
    }
    else {
        genericSliceSlow(xVals, x, outVals, begin, size);
    }
    return out;
}
exports.slice = slice;
function slice2d(xVals, xStride, outVals, begin, size) {
    var outOffset = 0;
    var beginI = begin[0];
    var beginJ = begin[1];
    var endI = beginI + size[0];
    for (var i = beginI; i < endI; i++) {
        var xOffset = i * xStride + beginJ;
        outVals.set(xVals.subarray(xOffset, xOffset + size[1]), outOffset);
        outOffset += size[1];
    }
}
function slice3d(xVals, xStride1, xStride2, outVals, begin, size) {
    var outOffset = 0;
    var beginI = begin[0];
    var beginJ = begin[1];
    var beginK = begin[2];
    var endI = beginI + size[0];
    var endJ = beginJ + size[1];
    for (var i = beginI; i < endI; i++) {
        for (var j = beginJ; j < endJ; j++) {
            var xOffset = i * xStride1 + j * xStride2 + beginK;
            outVals.set(xVals.subarray(xOffset, xOffset + size[2]), outOffset);
            outOffset += size[2];
        }
    }
}
function slice4d(xVals, xStride1, xStride2, xStride3, outVals, begin, size) {
    var outOffset = 0;
    var beginI = begin[0];
    var beginJ = begin[1];
    var beginK = begin[2];
    var endI = beginI + size[0];
    var endJ = beginJ + size[1];
    var endK = beginK + size[2];
    var beginL = begin[3];
    for (var i = beginI; i < endI; i++) {
        for (var j = beginJ; j < endJ; j++) {
            for (var k = beginK; k < endK; k++) {
                var xOffset = i * xStride1 + j * xStride2 + k * xStride3 + beginL;
                outVals.set(xVals.subarray(xOffset, xOffset + size[3]), outOffset);
                outOffset += size[3];
            }
        }
    }
}
function genericSliceSlow(xVals, xInfo, outVals, begin, size) {
    var outBuf = tfjs_core_1.buffer(size, xInfo.dtype, outVals);
    var xBuf = tfjs_core_1.buffer(xInfo.shape, xInfo.dtype, xVals);
    for (var i = 0; i < outBuf.size; ++i) {
        var loc = outBuf.indexToLoc(i);
        var xLoc = loc.map(function (idx, j) { return idx + begin[j]; });
        outVals[i] = xBuf.get.apply(xBuf, xLoc);
    }
}
tfjs_core_1.registerKernel({
    kernelName: 'Slice',
    backendName: 'wasm',
    kernelFunc: slice,
});
//# sourceMappingURL=Slice.js.map