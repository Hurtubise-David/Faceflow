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
var wasmFusedConv2d;
function setup(backend) {
    wasmFusedConv2d = backend.wasm.cwrap('FusedConv2D', null /* void */, [
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
    ]);
}
// Must match enum in conv2d_impl.h.
var FusableActivation;
(function (FusableActivation) {
    FusableActivation[FusableActivation["linear"] = 0] = "linear";
    FusableActivation[FusableActivation["relu"] = 1] = "relu";
    FusableActivation[FusableActivation["relu6"] = 2] = "relu6";
    FusableActivation[FusableActivation["prelu"] = 3] = "prelu";
})(FusableActivation || (FusableActivation = {}));
function fusedConv2d(args) {
    var inputs = args.inputs, attrs = args.attrs, backend = args.backend;
    var convInfo = attrs.convInfo, activation = attrs.activation;
    var fusedActivation = FusableActivation[activation];
    if (fusedActivation == null) {
        throw new Error(activation + " activation not yet supported for FusedConv2D " +
            "in the wasm backend.");
    }
    var x = inputs.x, filter = inputs.filter, bias = inputs.bias, preluActivationWeights = inputs.preluActivationWeights;
    var xId = backend.dataIdMap.get(x.dataId).id;
    var filterId = backend.dataIdMap.get(filter.dataId).id;
    var outputChannels = convInfo.outChannels;
    var biasId = 0;
    if (bias != null) {
        var biasData = backend.dataIdMap.get(bias.dataId);
        if (biasData.shape.length !== 1) {
            throw new Error("FusedConv2D only supports rank-1 bias but got " +
                ("rank " + biasData.shape.length + "."));
        }
        if (biasData.shape[0] !== outputChannels) {
            throw new Error("FusedConv2D bias shape (" + biasData.shape + ") does not " +
                ("match the number of output channels (" + outputChannels + ")"));
        }
        biasId = biasData.id;
    }
    var filterHeight = convInfo.filterHeight;
    var filterWidth = convInfo.filterWidth;
    var padTop = convInfo.padInfo.top;
    var padRight = convInfo.padInfo.right;
    var padBottom = convInfo.padInfo.bottom;
    var padLeft = convInfo.padInfo.left;
    var dilationHeight = convInfo.dilationHeight;
    var dilationWidth = convInfo.dilationWidth;
    var strideHeight = convInfo.strideHeight;
    var strideWidth = convInfo.strideWidth;
    var inputChannels = convInfo.inChannels;
    var isSamePad = convInfo.padInfo.type === 'SAME' ? 1 : 0;
    var batchSize = convInfo.batchSize;
    var inHeight = convInfo.inHeight;
    var inWidth = convInfo.inWidth;
    if (convInfo.dataFormat !== 'channelsLast') {
        throw new Error("wasm backend FusedConv2D does not support dataFormat:'" +
            (convInfo.dataFormat + "'. Please use 'channelsLast'."));
    }
    var out = backend.makeOutput(convInfo.outShape, 'float32');
    var outId = backend.dataIdMap.get(out.dataId).id;
    var preluActivationWeightsId = preluActivationWeights == null ?
        0 :
        backend.dataIdMap.get(preluActivationWeights.dataId).id;
    wasmFusedConv2d(xId, batchSize, inHeight, inWidth, filterId, filterHeight, filterWidth, biasId, padTop, padRight, padBottom, padLeft, isSamePad, dilationHeight, dilationWidth, strideHeight, strideWidth, inputChannels, outputChannels, fusedActivation, preluActivationWeightsId, outId);
    return out;
}
tfjs_core_1.registerKernel({
    kernelName: 'FusedConv2D',
    backendName: 'wasm',
    setupFunc: setup,
    kernelFunc: fusedConv2d
});
//# sourceMappingURL=FusedConv2D.js.map