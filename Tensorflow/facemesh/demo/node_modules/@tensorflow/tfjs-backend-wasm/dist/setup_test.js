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
// tslint:disable-next-line:no-imports-from-dist
var jasmine_util_1 = require("@tensorflow/tfjs-core/dist/jasmine_util");
jasmine_util_1.setTestEnvs([{ name: 'test-wasm', backendName: 'wasm', isDataSync: true }]);
/**
 * Tests that have these substrings in their name will be included unless one
 * of the strings in excludes appears in the name.
 */
var TEST_FILTERS = [
    {
        startsWith: 'tensor ',
        excludes: [
            'complex',
            'derivative',
            // Downcasting broken, see: https://github.com/tensorflow/tfjs/issues/2590
            'Tensor2D float32 -> bool', 'Tensor2D int32 -> bool'
        ]
    },
    {
        include: 'add ',
        excludes: [
            'gradient',
            'upcasts when dtypes dont match',
            'complex',
        ]
    },
    {
        include: 'avgPool',
        excludes: [
            'gradient',
            'avgPool3d',
        ]
    },
    {
        include: 'relu',
        excludes: [
            'derivative',
            'gradient',
            'valueAndGradients',
            'fused matmul',
            'broadcasted bias',
        ]
    },
    {
        include: 'maxPool',
        excludes: [
            'maxPoolBackprop',
            'maxPool3d',
            'maxPool3dBackprop',
            'ignores NaNs' // Actual != expected.
        ]
    },
    { include: 'cropAndResize' },
    {
        include: 'resizeBilinear',
        excludes: [
            'gradients' // Not yet implemented.
        ]
    },
    {
        include: 'matmul ',
        excludes: [
            'valueAndGradients',
            'gradient',
            'fused matmul',
            'zero in its shape',
            'matmul followed by mul',
            'upcasts',
        ]
    },
    {
        include: 'depthwiseConv2D ',
        excludes: [
            'broadcasted bias',
            'gradient',
            'NCHW',
        ]
    },
    {
        include: 'conv2d ',
        excludes: [
            'broadcasted bias',
            'basic with elu',
            // supported.
            'gradient',
            'NCHW',
        ]
    },
    {
        include: 'prelu ',
        excludes: [
            'gradient',
            'derivative' // Missing gradient.
        ]
    },
    {
        include: ' cast ',
        excludes: [
            'complex',
            'shallow slice an input that was cast' // Slice is not implemented.
        ]
    },
    {
        include: 'gather',
        excludes: [
            'gradient' // Not yet implemented.
        ]
    },
    {
        include: 'sigmoid ',
        excludes: [
            'sigmoidCrossEntropy',
            'gradient' // Not yet implemented.
        ]
    },
    { include: 'scatterND ' },
    {
        include: 'abs ',
        excludes: [
            'gradient',
            'complex' // Complex numbers not supported yet.
        ]
    },
    {
        include: 'sub ',
        excludes: [
            'complex',
            'gradient',
            'upcasts',
        ]
    },
    {
        include: 'mul ',
        excludes: [
            'complex',
            'gradient',
        ]
    },
    {
        include: 'div ',
        excludes: [
            'gradient',
            'upcasts',
            'broadcasting same rank Tensors different shape',
            // inner dims not
            // supported yet.
            'divNoNan' // divNoNan not yet implemented.
        ]
    },
    {
        include: 'batchNorm',
        excludes: [
            'gradient' // Gradient is missing.
        ]
    },
    { include: 'slice ' },
    { include: 'square ' },
    {
        startsWith: 'min ',
        excludes: [
            'derivative: 1D tensor with max or min value',
            // implemented.
            '2D, axis=0',
            // implemented.
            'index corresponds to start of a non-initial window',
            // implemented.,
            'gradient',
            'ignores NaNs' // Doesn't yet ignore NaN
        ]
    },
    {
        startsWith: 'max ',
        excludes: [
            'derivative: 1D tensor with max or min value',
            // implemented.
            '2D, axis=0',
            // implemented.
            'gradient',
            'ignores NaNs' // Doesn't yet ignore NaN
        ]
    },
    {
        include: 'concat',
        excludes: [
            'complex',
            'gradient' // Split is not yet implemented
        ]
    },
    {
        include: 'transpose',
        excludes: ['oneHot'] // oneHot not yet implemented.
    },
    { include: 'pad ', excludes: ['complex', 'zerosLike'] },
    { include: 'clip', excludes: ['gradient'] },
    { include: 'addN' },
    { include: 'nonMaxSuppression' },
    { include: 'argmax', excludes: ['gradient'] },
    { include: 'exp ' },
    { include: 'unstack' },
    {
        include: 'minimum',
        excludes: [
            'gradient',
            'broadcasts 2x1 Tensor2D and 2x2 Tensor2D' // Broadcasting along inner
            // dims not supported yet.
        ]
    },
    {
        include: 'maximum',
        excludes: [
            'gradient',
            'broadcasts 2x1 Tensor2D and 2x2 Tensor2D' // Broadcasting along inner
            // dims not supported yet.
        ]
    },
    {
        include: 'log ',
    },
    {
        include: 'greater ',
        excludes: [
            'broadcasting Tensor2D shapes',
            // supported yet.
            'broadcasting Tensor3D shapes',
            'broadcasting Tensor4D shapes' // Same as above.
        ]
    },
    {
        include: 'greaterEqual',
        excludes: [
            'gradient',
            'broadcasting Tensor2D shapes',
            // supported yet.
            'broadcasting Tensor3D shapes',
            'broadcasting Tensor4D shapes' // Same as above.
        ]
    },
    {
        include: 'less ',
        excludes: [
            'broadcasting Tensor2D shapes',
            // supported yet.
            'broadcasting Tensor3D shapes',
            'broadcasting Tensor3D float32',
            'broadcasting Tensor4D shapes' // Same as above.
        ]
    },
    {
        include: 'lessEqual',
        excludes: [
            'gradient',
            'broadcasting Tensor2D shapes',
            // supported yet.
            'broadcasting Tensor3D shapes',
            'broadcasting Tensor3D float32',
            'broadcasting Tensor4D shapes' // Same as above.
        ]
    },
    {
        include: 'mean ',
        excludes: [
            'axis=0',
        ]
    },
    { startsWith: 'sum ' },
    {
        startsWith: 'logicalAnd ',
        excludes: [
            'broadcasting Tensor2D shapes',
            // not yet supported.
            'broadcasting Tensor3D shapes',
            'broadcasting Tensor4D shapes',
        ]
    },
    {
        startsWith: 'tile ',
        excludes: [
            'gradient',
            'string tensor' // String tensors not yet implemented.
        ]
    },
    { startsWith: 'sin ' },
    {
        startsWith: 'cos ',
        excludes: [
            'gradient',
        ]
    },
    {
        startsWith: 'tanh ',
        excludes: ['gradient'] // Gradient not yet implemented.
    },
    {
        startsWith: 'rsqrt ',
        excludes: ['gradient'] // Gradient not yet implemented.
    },
];
var customInclude = function (testName) {
    // Include all regular describe() tests.
    if (testName.indexOf('test-wasm') < 0) {
        return true;
    }
    // Include all of the wasm specific tests.
    if (testName.startsWith('wasm')) {
        return true;
    }
    return false;
};
jasmine_util_1.setupTestFilters(TEST_FILTERS, customInclude);
// Import and run all the tests from core.
// tslint:disable-next-line:no-imports-from-dist
require("@tensorflow/tfjs-core/dist/tests");
//# sourceMappingURL=setup_test.js.map