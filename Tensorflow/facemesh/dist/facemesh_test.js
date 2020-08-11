"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tf = require("@tensorflow/tfjs-core");
const jasmine_util_1 = require("@tensorflow/tfjs-core/dist/jasmine_util");
const facemesh = require("./index");
const test_util_1 = require("./test_util");
jasmine_util_1.describeWithFlags('Facemesh', jasmine_util_1.ALL_ENVS, () => {
    let model;
    beforeAll(async () => {
        model = await facemesh.load();
    });
    it('estimateFaces does not leak memory', async () => {
        const input = tf.zeros([128, 128, 3]);
        let numTensors = tf.memory().numTensors;
        let returnTensors = false;
        let flipHorizontal = false;
        await model.estimateFaces(input, returnTensors, flipHorizontal);
        expect(tf.memory().numTensors).toEqual(numTensors);
        numTensors = tf.memory().numTensors;
        returnTensors = false;
        flipHorizontal = true;
        await model.estimateFaces(input, returnTensors, flipHorizontal);
        expect(tf.memory().numTensors).toEqual(numTensors);
        numTensors = tf.memory().numTensors;
        returnTensors = true;
        flipHorizontal = false;
        await model.estimateFaces(input, returnTensors, flipHorizontal);
        expect(tf.memory().numTensors).toEqual(numTensors);
        numTensors = tf.memory().numTensors;
        returnTensors = true;
        flipHorizontal = true;
        await model.estimateFaces(input, returnTensors, flipHorizontal);
        expect(tf.memory().numTensors).toEqual(numTensors);
    });
    it('estimateFaces returns objects with expected properties', async () => {
        const input = tf.tensor3d(test_util_1.stubbedImageVals, [128, 128, 3]);
        await model.estimateFaces(input);
        const numTensors = tf.memory().numTensors;
        const result = await model.estimateFaces(input);
        const face = result[0];
        expect(tf.memory().numTensors).toEqual(numTensors);
        expect(face.faceInViewConfidence).toBeDefined();
        expect(face.boundingBox).toBeDefined();
        expect(face.mesh).toBeDefined();
        expect(face.scaledMesh).toBeDefined();
    });
});
//# sourceMappingURL=facemesh_test.js.map