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
var wasmScatterNd;
function setup(backend) {
    wasmScatterNd = backend.wasm.cwrap('ScatterNd', null /*void*/, [
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'array',
        'number',
        'number' // outId
    ]);
}
function scatterNd(args) {
    var backend = args.backend, inputs = args.inputs, attrs = args.attrs;
    var indices = inputs.indices, updates = inputs.updates;
    var shape = attrs.shape;
    var out = backend.makeOutput(shape, updates.dtype);
    if (tfjs_core_1.util.sizeFromShape(shape) === 0) {
        return out;
    }
    var _a = tfjs_core_1.scatter_util.calculateShapes(updates, indices, shape), sliceRank = _a.sliceRank, numUpdates = _a.numUpdates, sliceSize = _a.sliceSize, strides = _a.strides, outputSize = _a.outputSize;
    var indicesData = backend.dataIdMap.get(indices.dataId);
    var indicesId = indicesData.id;
    var updatesData = backend.dataIdMap.get(updates.dataId);
    var updatesId = updatesData.id;
    var stridesBytes = new Uint8Array(new Int32Array(strides).buffer);
    var outId = backend.dataIdMap.get(out.dataId).id;
    wasmScatterNd(indicesId, updatesId, types_1.CppDType[updates.dtype], sliceRank, numUpdates, sliceSize, stridesBytes, outputSize, outId);
    return out;
}
tfjs_core_1.registerKernel({
    kernelName: 'ScatterNd',
    backendName: 'wasm',
    setupFunc: setup,
    kernelFunc: scatterNd
});
//# sourceMappingURL=ScatterNd.js.map