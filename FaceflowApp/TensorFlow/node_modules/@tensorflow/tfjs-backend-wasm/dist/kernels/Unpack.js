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
var Slice_1 = require("./Slice");
function unpack(args) {
    var x = args.inputs.x, backend = args.backend, axis = args.attrs.axis;
    var numOutputs = x.shape[axis];
    var rank = x.shape.length;
    var outShape = new Array(rank - 1);
    var outIndex = 0;
    for (var i = 0; i < rank; i++) {
        if (i !== axis) {
            outShape[outIndex++] = x.shape[i];
        }
    }
    var outs = new Array(numOutputs);
    var begin = new Array(rank).fill(0);
    var size = x.shape.slice();
    size[axis] = 1;
    for (var i = 0; i < outs.length; i++) {
        begin[axis] = i;
        outs[i] = Slice_1.slice({ inputs: { x: x }, attrs: { begin: begin, size: size }, backend: backend });
    }
    return outs.map(function (_a) {
        var dataId = _a.dataId, dtype = _a.dtype;
        return ({ dataId: dataId, dtype: dtype, shape: outShape });
    });
}
tfjs_core_1.registerKernel({
    kernelName: 'Unpack',
    backendName: 'wasm',
    kernelFunc: unpack,
});
//# sourceMappingURL=Unpack.js.map