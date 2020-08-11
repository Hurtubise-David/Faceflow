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
var wasmGatherNd;
function setup(backend) {
    wasmGatherNd = backend.wasm.cwrap('GatherNd', null /*void*/, [
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'array',
        'number' // outId
    ]);
}
function gatherNd(args) {
    var backend = args.backend, inputs = args.inputs;
    var x = inputs.x, indices = inputs.indices;
    var _a = tfjs_core_1.gather_util.prepareAndValidate(x, indices), resultShape = _a[0], numSlices = _a[1], sliceSize = _a[2], strides = _a[3];
    var out = backend.makeOutput(resultShape, x.dtype);
    if (numSlices === 0) {
        return out;
    }
    var indicesShape = indices.shape;
    var sliceRank = indicesShape[indicesShape.length - 1];
    var xData = backend.dataIdMap.get(x.dataId);
    var xId = xData.id;
    var indicesData = backend.dataIdMap.get(indices.dataId);
    var indicesId = indicesData.id;
    var stridesBytes = new Uint8Array(new Int32Array(strides).buffer);
    var outId = backend.dataIdMap.get(out.dataId).id;
    wasmGatherNd(xId, types_1.CppDType[x.dtype], indicesId, numSlices, sliceRank, sliceSize, stridesBytes, outId);
    return out;
}
tfjs_core_1.registerKernel({
    kernelName: 'GatherNd',
    backendName: 'wasm',
    setupFunc: setup,
    kernelFunc: gatherNd
});
//# sourceMappingURL=GatherNd.js.map