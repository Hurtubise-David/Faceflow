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
var wasmTile;
function setup(backend) {
    wasmTile = backend.wasm.cwrap('Tile', null /* void */, [
        'number',
        'array',
        'number',
        'array',
        'number',
        'number' // out_id
    ]);
}
function tile(args) {
    var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
    var x = inputs.x;
    var xId = backend.dataIdMap.get(x.dataId).id;
    var reps = attrs.reps;
    var newShape = new Array(x.shape.length);
    for (var i = 0; i < newShape.length; i++) {
        newShape[i] = x.shape[i] * reps[i];
    }
    var xShapeBytes = new Uint8Array(new Int32Array(x.shape).buffer);
    var newShapeBytes = new Uint8Array(new Int32Array(newShape).buffer);
    var out = backend.makeOutput(newShape, x.dtype);
    var outId = backend.dataIdMap.get(out.dataId).id;
    wasmTile(xId, xShapeBytes, x.shape.length, newShapeBytes, newShape.length, types_1.CppDType[out.dtype], outId);
    return out;
}
tfjs_core_1.registerKernel({
    kernelName: 'Tile',
    backendName: 'wasm',
    setupFunc: setup,
    kernelFunc: tile
});
//# sourceMappingURL=Tile.js.map