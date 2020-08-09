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
var Cast_1 = require("./Cast");
var wasmResizeBilinear;
function setup(backend) {
    wasmResizeBilinear = backend.wasm.cwrap('ResizeBilinear', null /*void*/, [
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number' // outId
    ]);
}
function resizeBilinear(args) {
    var backend = args.backend, inputs = args.inputs, attrs = args.attrs;
    var x = inputs.x;
    var alignCorners = attrs.alignCorners, newHeight = attrs.newHeight, newWidth = attrs.newWidth;
    var _a = x.shape, batch = _a[0], oldHeight = _a[1], oldWidth = _a[2], numChannels = _a[3];
    var outShape = [batch, newHeight, newWidth, numChannels];
    var xData = backend.dataIdMap.get(x.dataId);
    var castedData;
    if (xData.dtype !== 'float32') {
        castedData = Cast_1.cast({ backend: backend, inputs: { x: x }, attrs: { dtype: 'float32' } });
        xData = backend.dataIdMap.get(castedData.dataId);
    }
    var xId = xData.id;
    var out = backend.makeOutput(outShape, 'float32');
    if (tfjs_core_1.util.sizeFromShape(x.shape) === 0) {
        return out;
    }
    var outId = backend.dataIdMap.get(out.dataId).id;
    wasmResizeBilinear(xId, batch, oldHeight, oldWidth, numChannels, newHeight, newWidth, alignCorners ? 1 : 0, outId);
    if (castedData != null) {
        backend.disposeData(castedData.dataId);
    }
    return out;
}
tfjs_core_1.registerKernel({
    kernelName: 'ResizeBilinear',
    backendName: 'wasm',
    setupFunc: setup,
    kernelFunc: resizeBilinear
});
//# sourceMappingURL=ResizeBilinear.js.map