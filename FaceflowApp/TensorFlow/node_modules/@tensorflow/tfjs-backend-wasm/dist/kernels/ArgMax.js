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
var wasmFunc;
function setup(backend) {
    wasmFunc = backend.wasm.cwrap('ArgMax', null /* void */, [
        'number',
        'number',
        'number',
        'number',
        'number' // out_id
    ]);
}
function argmax(args) {
    var x = args.inputs.x, backend = args.backend, axis = args.attrs.axis;
    var outShape = x.shape.slice(0, -1);
    var out = backend.makeOutput(outShape, 'int32');
    var xId = backend.dataIdMap.get(x.dataId).id;
    var outId = backend.dataIdMap.get(out.dataId).id;
    var outerSize = tfjs_core_1.util.sizeFromShape(out.shape);
    var innerSize = x.shape[axis];
    wasmFunc(xId, types_1.CppDType[x.dtype], outerSize, innerSize, outId);
    return out;
}
tfjs_core_1.registerKernel({
    kernelName: 'ArgMax',
    backendName: 'wasm',
    kernelFunc: argmax,
    setupFunc: setup
});
//# sourceMappingURL=ArgMax.js.map