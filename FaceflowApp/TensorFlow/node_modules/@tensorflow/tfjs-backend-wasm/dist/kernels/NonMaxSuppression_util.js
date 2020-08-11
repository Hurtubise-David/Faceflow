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
/**
 * Parse the result of the c++ method, which has the shape equivalent to
 * `Result`.
 */
function parseResultStruct(backend, resOffset) {
    var result = new Int32Array(backend.wasm.HEAPU8.buffer, resOffset, 3);
    var pSelectedIndices = result[0];
    var selectedSize = result[1];
    var pSelectedScores = result[2];
    // Since the result was allocated on the heap, we have to delete it.
    backend.wasm._free(resOffset);
    return { pSelectedIndices: pSelectedIndices, selectedSize: selectedSize, pSelectedScores: pSelectedScores };
}
exports.parseResultStruct = parseResultStruct;
//# sourceMappingURL=NonMaxSuppression_util.js.map