"use strict";
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
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
var wasmClip;
function setup(backend) {
    wasmClip = backend.wasm.cwrap('ClipByValue', null /* void */, [
        'number',
        'number',
        'number',
        'number' // out_id
    ]);
}
function clip(args) {
    var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
    var x = inputs.x;
    var min = attrs.min, max = attrs.max;
    var xId = backend.dataIdMap.get(x.dataId).id;
    var out = backend.makeOutput(x.shape, 'float32');
    var outId = backend.dataIdMap.get(out.dataId).id;
    wasmClip(xId, min, max, outId);
    return out;
}
tfjs_core_1.registerKernel({
    kernelName: 'ClipByValue',
    backendName: 'wasm',
    setupFunc: setup,
    kernelFunc: clip
});
//# sourceMappingURL=ClipByValue.js.map