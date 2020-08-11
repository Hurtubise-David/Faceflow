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
function concat(args) {
    var inputs = args.inputs, backend = args.backend, axis = args.attrs.axis;
    var outShape = tfjs_core_1.backend_util.computeOutShape(inputs.map(function (t) { return t.shape; }), axis);
    var out = backend.makeOutput(outShape, inputs[0].dtype);
    var batchDim = tfjs_core_1.util.sizeFromShape(inputs[0].shape.slice(0, axis));
    var sumInnerDims = 0;
    var innerDims = inputs.map(function (input) {
        var innerDim = tfjs_core_1.util.sizeFromShape(input.shape.slice(axis));
        sumInnerDims += innerDim;
        return innerDim;
    });
    var inVals = inputs.map(function (input) { return backend.typedArrayFromHeap(input); });
    var outVals = backend.typedArrayFromHeap(out);
    for (var b = 0; b < batchDim; b++) {
        var outOffset = b * sumInnerDims;
        for (var i = 0; i < inVals.length; i++) {
            var innerDim = innerDims[i];
            var inOffset = b * innerDim;
            var vals = inVals[i].subarray(inOffset, inOffset + innerDim);
            outVals.set(vals, outOffset);
            outOffset += innerDim;
        }
    }
    return out;
}
tfjs_core_1.registerKernel({
    kernelName: 'Concat',
    backendName: 'wasm',
    kernelFunc: concat,
});
//# sourceMappingURL=Concat.js.map