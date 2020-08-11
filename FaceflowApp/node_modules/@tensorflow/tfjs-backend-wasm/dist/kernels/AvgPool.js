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
var wasmAvgPool;
function setup(backend) {
    wasmAvgPool = backend.wasm.cwrap('AvgPool', null /* void */, [
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
function avgPool(args) {
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
    var strideHeight = convInfo.strideHeight;
    var strideWidth = convInfo.strideWidth;
    var channels = convInfo.inChannels;
    if (convInfo.dataFormat !== 'channelsLast') {
        throw new Error("wasm backend does not support dataFormat:'" +
            (convInfo.dataFormat + "'. Please use 'channelsLast'."));
    }
    if (convInfo.dilationWidth !== 1 || convInfo.dilationHeight !== 1) {
        throw new Error("was backend only supports average pooling with dilation = [1, 1], " +
            ("got [" + convInfo.dilationHeight + ", " + convInfo.dilationWidth + "]."));
    }
    var out = backend.makeOutput(convInfo.outShape, 'float32');
    var outId = backend.dataIdMap.get(out.dataId).id;
    wasmAvgPool(xId, x.shape[0], x.shape[1], x.shape[2], filterHeight, filterWidth, padTop, padRight, padBottom, padLeft, strideHeight, strideWidth, channels, outId);
    return out;
}
tfjs_core_1.registerKernel({
    kernelName: 'AvgPool',
    backendName: 'wasm',
    setupFunc: setup,
    kernelFunc: avgPool
});
//# sourceMappingURL=AvgPool.js.map