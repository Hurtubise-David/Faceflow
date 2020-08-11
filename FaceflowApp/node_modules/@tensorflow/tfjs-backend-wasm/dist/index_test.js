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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tf = __importStar(require("@tensorflow/tfjs-core"));
var tfjs_core_1 = require("@tensorflow/tfjs-core");
// tslint:disable-next-line:no-imports-from-dist
var jasmine_util_1 = require("@tensorflow/tfjs-core/dist/jasmine_util");
var backend_wasm_1 = require("./backend_wasm");
var index_1 = require("./index");
/**
 * Tests specific to the wasm backend. The name of these tests must start with
 * 'wasm' so that they are always included in the test runner. See
 * `env.specFilter` in `setup_test.ts` for details.
 */
jasmine_util_1.describeWithFlags('wasm read/write', jasmine_util_1.ALL_ENVS, function () {
    it('write and read values', function () { return __awaiter(_this, void 0, void 0, function () {
        var x, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    x = tf.tensor1d([1, 2, 3]);
                    _b = (_a = tfjs_core_1.test_util).expectArraysClose;
                    _c = [[1, 2, 3]];
                    return [4 /*yield*/, x.data()];
                case 1:
                    _b.apply(_a, _c.concat([_d.sent()]));
                    return [2 /*return*/];
            }
        });
    }); });
    it('allocate repetitively and confirm reuse of heap space', function () {
        var backend = tf.backend();
        var size = 100;
        // Allocate for the first time, record the memory offset and dispose.
        var t1 = tf.zeros([size]);
        var memOffset1 = backend.getMemoryOffset(t1.dataId);
        t1.dispose();
        // Allocate again and make sure the offset is the same (memory was reused).
        var t2 = tf.zeros([size]);
        var memOffset2 = backend.getMemoryOffset(t2.dataId);
        // This should fail in case of a memory leak.
        expect(memOffset1).toBe(memOffset2);
    });
});
jasmine_util_1.describeWithFlags('wasm init', jasmine_util_1.BROWSER_ENVS, function () {
    beforeEach(function () {
        tfjs_core_1.registerBackend('wasm-test', function () { return __awaiter(_this, void 0, void 0, function () {
            var wasm;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, backend_wasm_1.init()];
                    case 1:
                        wasm = (_a.sent()).wasm;
                        return [2 /*return*/, new index_1.BackendWasm(wasm)];
                }
            });
        }); }, 100);
        // Silences backend registration warnings.
        spyOn(console, 'warn');
        spyOn(console, 'log');
    });
    afterEach(function () {
        backend_wasm_1.resetWasmPath();
        tfjs_core_1.removeBackend('wasm-test');
    });
    it('backend init fails when the path is invalid', function () { return __awaiter(_this, void 0, void 0, function () {
        var wasmPath, realFetch, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    index_1.setWasmPath('invalid/path');
                    realFetch = fetch;
                    spyOn(self, 'fetch').and.callFake(function (path) {
                        wasmPath = path;
                        return realFetch(path);
                    });
                    _a = expect;
                    return [4 /*yield*/, tf.setBackend('wasm-test')];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toBe(false);
                    expect(wasmPath).toBe('invalid/path');
                    return [2 /*return*/];
            }
        });
    }); });
    it('backend init succeeds with default path', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = expect;
                    return [4 /*yield*/, tf.setBackend('wasm-test')];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    it('setWasmPath called too late', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Set an invalid path.
                    index_1.setWasmPath('invalid/path');
                    return [4 /*yield*/, tf.setBackend('wasm-test')];
                case 1:
                    _a.sent();
                    // Setting the path too late.
                    expect(function () { return index_1.setWasmPath('too/late'); })
                        .toThrowError(/The WASM backend was already initialized. Make sure/);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=index_test.js.map