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
var wasmSum;
function setup(backend) {
    wasmSum =
        backend.wasm.cwrap('Sum', null /*void*/, ['number, number, number']);
}
function sum(args) {
    var backend = args.backend, inputs = args.inputs, attrs = args.attrs;
    var axes = attrs.axes;
    var x = inputs.x;
    var xId = backend.dataIdMap.get(x.dataId).id;
    tfjs_core_1.backend_util.assertAxesAreInnerMostDims('sum', axes, x.shape.length);
    var _a = tfjs_core_1.backend_util.computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
    var reduceSize = tfjs_core_1.util.sizeFromShape(reduceShape);
    var out = backend.makeOutput(outShape, x.dtype);
    if (tfjs_core_1.util.sizeFromShape(x.shape) === 0) {
        return out;
    }
    var outId = backend.dataIdMap.get(out.dataId).id;
    wasmSum(xId, reduceSize, outId);
    return out;
}
tfjs_core_1.registerKernel({
    kernelName: 'Sum',
    backendName: 'wasm',
    setupFunc: setup,
    kernelFunc: sum
});
//# sourceMappingURL=Sum.js.map