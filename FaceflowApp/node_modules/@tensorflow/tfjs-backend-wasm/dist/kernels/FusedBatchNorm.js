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
var wasmBatchNorm;
function setup(backend) {
    wasmBatchNorm = backend.wasm.cwrap('FusedBatchNorm', null /* void */, ['number', 'number', 'number', 'number', 'number', 'number', 'number']);
}
function fusedBatchNorm(args) {
    var backend = args.backend, inputs = args.inputs, attrs = args.attrs;
    var varianceEpsilon = attrs.varianceEpsilon;
    var x = inputs.x, mean = inputs.mean, variance = inputs.variance, offset = inputs.offset, scale = inputs.scale;
    var xId = backend.dataIdMap.get(x.dataId).id;
    var meanId = backend.dataIdMap.get(mean.dataId).id;
    var varianceId = backend.dataIdMap.get(variance.dataId).id;
    var offsetId = offset != null ? backend.dataIdMap.get(offset.dataId).id : 0;
    var scaleId = scale != null ? backend.dataIdMap.get(scale.dataId).id : 0;
    var out = backend.makeOutput(x.shape, x.dtype);
    // Short-circuit zero-sized tensors.
    if (tfjs_core_1.util.sizeFromShape(x.shape) === 0) {
        return out;
    }
    var outId = backend.dataIdMap.get(out.dataId).id;
    wasmBatchNorm(xId, meanId, varianceId, offsetId, scaleId, varianceEpsilon, outId);
    return out;
}
tfjs_core_1.registerKernel({
    kernelName: 'BatchNormalization',
    backendName: 'wasm',
    setupFunc: setup,
    kernelFunc: fusedBatchNorm
});
//# sourceMappingURL=FusedBatchNorm.js.map