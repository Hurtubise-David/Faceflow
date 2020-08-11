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
var NonMaxSuppression_util_1 = require("./NonMaxSuppression_util");
var wasmFunc;
function setup(backend) {
    wasmFunc = backend.wasm.cwrap('NonMaxSuppressionV5', 'number', // Result*
    [
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
    ]);
}
function kernelFunc(args) {
    var backend = args.backend, inputs = args.inputs, attrs = args.attrs;
    var iouThreshold = attrs.iouThreshold, maxOutputSize = attrs.maxOutputSize, scoreThreshold = attrs.scoreThreshold, softNmsSigma = attrs.softNmsSigma;
    var boxes = inputs.boxes, scores = inputs.scores;
    var boxesId = backend.dataIdMap.get(boxes.dataId).id;
    var scoresId = backend.dataIdMap.get(scores.dataId).id;
    var resOffset = wasmFunc(boxesId, scoresId, maxOutputSize, iouThreshold, scoreThreshold, softNmsSigma);
    var _a = NonMaxSuppression_util_1.parseResultStruct(backend, resOffset), pSelectedIndices = _a.pSelectedIndices, selectedSize = _a.selectedSize, pSelectedScores = _a.pSelectedScores;
    var selectedIndicesTensor = backend.makeOutput([selectedSize], 'int32', pSelectedIndices);
    var selectedScoresTensor = backend.makeOutput([selectedSize], 'float32', pSelectedScores);
    return [selectedIndicesTensor, selectedScoresTensor];
}
tfjs_core_1.registerKernel({
    kernelName: 'NonMaxSuppressionV5',
    backendName: 'wasm',
    setupFunc: setup,
    kernelFunc: kernelFunc,
});
//# sourceMappingURL=NonMaxSuppressionV5.js.map