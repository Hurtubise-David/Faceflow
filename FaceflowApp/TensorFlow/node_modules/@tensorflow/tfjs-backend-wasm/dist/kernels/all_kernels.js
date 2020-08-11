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
// We explicitly import the modular kernels so they get registered in the
// global registry when we compile the library. A modular build would replace
// the contents of this file and import only the kernels that are needed.
require("./Abs");
require("./Add");
require("./AddN");
require("./ArgMax");
require("./AvgPool");
require("./BatchMatMul");
require("./Cast");
require("./ClipByValue");
require("./Concat");
require("./Conv2D");
require("./CropAndResize");
require("./Cos");
require("./DepthwiseConv2dNative");
require("./Div");
require("./Exp");
require("./FloorDiv");
require("./FusedBatchNorm");
require("./FusedConv2D");
require("./FusedDepthwiseConv2D");
require("./Gather");
require("./GatherNd");
require("./Greater");
require("./GreaterEqual");
require("./LogicalAnd");
require("./Less");
require("./LessEqual");
require("./Log");
require("./Max");
require("./Maximum");
require("./MaxPool");
require("./Min");
require("./Minimum");
require("./Mul");
require("./NonMaxSuppressionV3");
require("./NonMaxSuppressionV5");
require("./PadV2");
require("./Prelu");
require("./Relu");
require("./Relu6");
require("./Reshape");
require("./ResizeBilinear");
require("./Rsqrt");
require("./ScatterNd");
require("./Sigmoid");
require("./Sin");
require("./Slice");
require("./Square");
require("./Sub");
require("./Sum");
require("./Tanh");
require("./Tile");
require("./Transpose");
require("./Unpack");
//# sourceMappingURL=all_kernels.js.map