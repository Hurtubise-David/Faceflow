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
// Must match enum in CropAndResize.cc
var InterpolationMethod;
(function (InterpolationMethod) {
    InterpolationMethod[InterpolationMethod["bilinear"] = 0] = "bilinear";
    InterpolationMethod[InterpolationMethod["nearest"] = 1] = "nearest";
})(InterpolationMethod || (InterpolationMethod = {}));
var wasmCropAndResize;
function setup(backend) {
    wasmCropAndResize = backend.wasm.cwrap('CropAndResize', null /*void*/, [
        'number',
        'number',
        'number',
        'number',
        'array',
        'number',
        'number',
        'number',
        'number',
        'number' // out id
    ]);
}
function cropAndResize(args) {
    var backend = args.backend, inputs = args.inputs, attrs = args.attrs;
    var method = attrs.method, extrapolationValue = attrs.extrapolationValue, cropSize = attrs.cropSize;
    var images = inputs.images, boxes = inputs.boxes, boxInd = inputs.boxInd;
    var numBoxes = boxes.shape[0];
    var _a = cropSize, cropHeight = _a[0], cropWidth = _a[1];
    var outShape = [numBoxes, cropHeight, cropWidth, images.shape[3]];
    var imagesData = backend.dataIdMap.get(images.dataId);
    var castedData;
    if (images.dtype !== 'float32') {
        castedData =
            Cast_1.cast({ backend: backend, inputs: { x: images }, attrs: { dtype: 'float32' } });
        imagesData = backend.dataIdMap.get(castedData.dataId);
    }
    var imagesId = imagesData.id;
    var boxesId = backend.dataIdMap.get(boxes.dataId).id;
    var boxIndId = backend.dataIdMap.get(boxInd.dataId).id;
    var out = backend.makeOutput(outShape, 'float32');
    var outId = backend.dataIdMap.get(out.dataId).id;
    var imagesShapeBytes = new Uint8Array(new Int32Array(images.shape).buffer);
    wasmCropAndResize(imagesId, boxesId, boxIndId, numBoxes, imagesShapeBytes, cropHeight, cropWidth, InterpolationMethod[method], extrapolationValue, outId);
    if (castedData != null) {
        backend.disposeData(castedData.dataId);
    }
    return out;
}
tfjs_core_1.registerKernel({
    kernelName: 'CropAndResize',
    backendName: 'wasm',
    setupFunc: setup,
    kernelFunc: cropAndResize
});
//# sourceMappingURL=CropAndResize.js.map