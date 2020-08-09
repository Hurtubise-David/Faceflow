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
var wasmDepthwiseConv2d;
function setup(backend) {
    wasmDepthwiseConv2d =
        backend.wasm.cwrap('DepthwiseConv2dNative', null /* void */, [
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
function depthwiseConv2d(args) {
    var inputs = args.inputs, attrs = args.attrs, backend = args.backend;
    var convInfo = attrs;
    var x = inputs.x, filter = inputs.filter;
    var xId = backend.dataIdMap.get(x.dataId).id;
    var filterId = backend.dataIdMap.get(filter.dataId).id;
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
    var outputChannels = convInfo.outChannels;
    var isSamePad = convInfo.padInfo.type === 'SAME' ? 1 : 0;
    if (convInfo.dataFormat !== 'channelsLast') {
        throw new Error("wasm backend DepthwiseConv2dNative does not support dataFormat:'" +
            (convInfo.dataFormat + "'. Please use 'channelsLast'."));
    }
    var out = backend.makeOutput(convInfo.outShape, 'float32');
    var outId = backend.dataIdMap.get(out.dataId).id;
    wasmDepthwiseConv2d(xId, x.shape[0], x.shape[1], x.shape[2], filterId, filterHeight, filterWidth, padTop, padRight, padBottom, padLeft, isSamePad, dilationHeight, dilationWidth, strideHeight, strideWidth, inputChannels, outputChannels, outId);
    return out;
}
tfjs_core_1.registerKernel({
    kernelName: 'DepthwiseConv2dNative',
    backendName: 'wasm',
    setupFunc: setup,
    kernelFunc: depthwiseConv2d
});
//# sourceMappingURL=DepthwiseConv2dNative.js.map