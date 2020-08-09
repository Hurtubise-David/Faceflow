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
var wasmMaxPool;
function setup(backend) {
    wasmMaxPool = backend.wasm.cwrap('MaxPool', null /* void */, [
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
function maxPool(args) {
    var inputs = args.inputs, attrs = args.attrs, backend = args.backend;
    var convInfo = attrs;
    var x = inputs.x;
    var xId = backend.dataIdMap.get(x.dataId).id;
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
    if (convInfo.dataFormat !== 'channelsLast') {
        throw new Error("wasm backend does not support dataFormat:'" +
            (convInfo.dataFormat + "'. Please use 'channelsLast'."));
    }
    var out = backend.makeOutput(convInfo.outShape, 'float32');
    var outId = backend.dataIdMap.get(out.dataId).id;
    wasmMaxPool(xId, x.shape[0], x.shape[1], x.shape[2], filterHeight, filterWidth, padTop, padRight, padBottom, padLeft, dilationHeight, dilationWidth, strideHeight, strideWidth, inputChannels, outputChannels, outId);
    return out;
}
tfjs_core_1.registerKernel({
    kernelName: 'MaxPool',
    backendName: 'wasm',
    setupFunc: setup,
    kernelFunc: maxPool
});
//# sourceMappingURL=MaxPool.js.map