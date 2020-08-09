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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tfjs_core_1 = require("@tensorflow/tfjs-core");
var tfjs_backend_wasm_js_1 = __importDefault(require("../wasm-out/tfjs-backend-wasm.js"));
var WASM_PRIORITY = 2;
var BackendWasm = /** @class */ (function (_super) {
    __extends(BackendWasm, _super);
    function BackendWasm(wasm) {
        var _this = _super.call(this) || this;
        _this.wasm = wasm;
        // 0 is reserved for null data ids.
        _this.dataIdNextNumber = 1;
        _this.wasm.tfjs.init();
        _this.dataIdMap = new tfjs_core_1.DataStorage(_this, tfjs_core_1.engine());
        return _this;
    }
    BackendWasm.prototype.write = function (values, shape, dtype) {
        var dataId = {};
        this.move(dataId, values, shape, dtype);
        return dataId;
    };
    BackendWasm.prototype.numDataIds = function () {
        return this.dataIdMap.numDataIds();
    };
    BackendWasm.prototype.time = function (f) {
        return __awaiter(this, void 0, void 0, function () {
            var start, kernelMs;
            return __generator(this, function (_a) {
                start = tfjs_core_1.util.now();
                f();
                kernelMs = tfjs_core_1.util.now() - start;
                return [2 /*return*/, { kernelMs: kernelMs }];
            });
        });
    };
    BackendWasm.prototype.move = function (dataId, values, shape, dtype) {
        var id = this.dataIdNextNumber++;
        if (dtype === 'string') {
            var stringBytes = values;
            this.dataIdMap.set(dataId, { id: id, stringBytes: stringBytes, shape: shape, dtype: dtype, memoryOffset: null });
            return;
        }
        var size = tfjs_core_1.util.sizeFromShape(shape);
        var numBytes = size * tfjs_core_1.util.bytesPerElement(dtype);
        var memoryOffset = this.wasm._malloc(numBytes);
        this.dataIdMap.set(dataId, { id: id, memoryOffset: memoryOffset, shape: shape, dtype: dtype });
        this.wasm.tfjs.registerTensor(id, size, memoryOffset);
        if (values != null) {
            this.wasm.HEAPU8.set(new Uint8Array(values.buffer, 0, numBytes), memoryOffset);
        }
    };
    BackendWasm.prototype.read = function (dataId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.readSync(dataId)];
            });
        });
    };
    BackendWasm.prototype.readSync = function (dataId) {
        var _a = this.dataIdMap.get(dataId), memoryOffset = _a.memoryOffset, dtype = _a.dtype, shape = _a.shape, stringBytes = _a.stringBytes;
        if (dtype === 'string') {
            return stringBytes;
        }
        var bytes = this.wasm.HEAPU8.slice(memoryOffset, memoryOffset + tfjs_core_1.util.sizeFromShape(shape) * tfjs_core_1.util.bytesPerElement(dtype));
        return typedArrayFromBuffer(bytes.buffer, dtype);
    };
    BackendWasm.prototype.disposeData = function (dataId) {
        var data = this.dataIdMap.get(dataId);
        this.wasm._free(data.memoryOffset);
        this.wasm.tfjs.disposeData(data.id);
        this.dataIdMap.delete(dataId);
    };
    BackendWasm.prototype.floatPrecision = function () {
        return 32;
    };
    // Returns the memory offset of a tensor. Useful for debugging and unit
    // testing.
    BackendWasm.prototype.getMemoryOffset = function (dataId) {
        return this.dataIdMap.get(dataId).memoryOffset;
    };
    BackendWasm.prototype.dispose = function () {
        this.wasm.tfjs.dispose();
        this.wasm = null;
    };
    BackendWasm.prototype.memory = function () {
        return { unreliable: false };
    };
    /**
     * Make a tensor info for the output of an op. If `memoryOffset` is not
     * present, this method allocates memory on the WASM heap. If `memoryOffset`
     * is present, the memory was allocated elsewhere (in c++) and we just record
     * the pointer where that memory lives.
     */
    BackendWasm.prototype.makeOutput = function (shape, dtype, memoryOffset) {
        var dataId;
        if (memoryOffset == null) {
            dataId = this.write(null /* values */, shape, dtype);
        }
        else {
            dataId = {};
            var id = this.dataIdNextNumber++;
            this.dataIdMap.set(dataId, { id: id, memoryOffset: memoryOffset, shape: shape, dtype: dtype });
            var size = tfjs_core_1.util.sizeFromShape(shape);
            this.wasm.tfjs.registerTensor(id, size, memoryOffset);
        }
        return { dataId: dataId, shape: shape, dtype: dtype };
    };
    BackendWasm.prototype.typedArrayFromHeap = function (_a) {
        var shape = _a.shape, dtype = _a.dtype, dataId = _a.dataId;
        var buffer = this.wasm.HEAPU8.buffer;
        var memoryOffset = this.dataIdMap.get(dataId).memoryOffset;
        var size = tfjs_core_1.util.sizeFromShape(shape);
        switch (dtype) {
            case 'float32':
                return new Float32Array(buffer, memoryOffset, size);
            case 'int32':
                return new Int32Array(buffer, memoryOffset, size);
            case 'bool':
                return new Uint8Array(buffer, memoryOffset, size);
            default:
                throw new Error("Uknown dtype " + dtype);
        }
    };
    return BackendWasm;
}(tfjs_core_1.KernelBackend));
exports.BackendWasm = BackendWasm;
tfjs_core_1.registerBackend('wasm', function () { return __awaiter(_this, void 0, void 0, function () {
    var wasm;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, init()];
            case 1:
                wasm = (_a.sent()).wasm;
                return [2 /*return*/, new BackendWasm(wasm)];
        }
    });
}); }, WASM_PRIORITY);
/**
 * Initializes the wasm module and creates the js <--> wasm bridge.
 *
 * NOTE: We wrap the wasm module in a object with property 'wasm' instead of
 * returning Promise<BackendWasmModule> to avoid freezing Chrome (last tested in
 * Chrome 76).
 */
function init() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var factoryConfig = {};
                    if (wasmPath != null) {
                        factoryConfig.locateFile = function (path, prefix) {
                            if (path.endsWith('.wasm')) {
                                return wasmPath;
                            }
                            return prefix + path;
                        };
                    }
                    var wasm = tfjs_backend_wasm_js_1.default(factoryConfig);
                    var voidReturnType = null;
                    // Using the tfjs namespace to avoid conflict with emscripten's API.
                    wasm.tfjs = {
                        init: wasm.cwrap('init', null, []),
                        registerTensor: wasm.cwrap('register_tensor', null, [
                            'number',
                            'number',
                            'number',
                        ]),
                        disposeData: wasm.cwrap('dispose_data', voidReturnType, ['number']),
                        dispose: wasm.cwrap('dispose', voidReturnType, []),
                    };
                    var initialized = false;
                    wasm.onRuntimeInitialized = function () {
                        initialized = true;
                        initAborted = false;
                        resolve({ wasm: wasm });
                    };
                    wasm.onAbort = function () {
                        if (initialized) {
                            // Emscripten already called console.warn so no need to double log.
                            return;
                        }
                        if (initAborted) {
                            // Emscripten calls `onAbort` twice, resulting in double error messages.
                            return;
                        }
                        initAborted = true;
                        var rejectMsg = 'Make sure the server can serve the `.wasm` file relative to the ' +
                            'bundled js file. For more details see https://github.com/tensorflow/tfjs/blob/master/tfjs-backend-wasm/README.md#using-bundlers';
                        reject({ message: rejectMsg });
                    };
                })];
        });
    });
}
exports.init = init;
function typedArrayFromBuffer(buffer, dtype) {
    switch (dtype) {
        case 'float32':
            return new Float32Array(buffer);
        case 'int32':
            return new Int32Array(buffer);
        case 'bool':
            return new Uint8Array(buffer);
        default:
            throw new Error("Unknown dtype " + dtype);
    }
}
var wasmPath = null;
var initAborted = false;
/**
 * Sets the path to the `.wasm` file which will be fetched when the wasm
 * backend is initialized. See
 * https://github.com/tensorflow/tfjs/blob/master/tfjs-backend-wasm/README.md#using-bundlers
 * for more details.
 */
/** @doc {heading: 'Environment', namespace: 'wasm'} */
function setWasmPath(path) {
    if (initAborted) {
        throw new Error('The WASM backend was already initialized. Make sure you call ' +
            '`setWasmPath()` before you call `tf.setBackend()` or `tf.ready()`');
    }
    wasmPath = path;
}
exports.setWasmPath = setWasmPath;
/** Used in unit tests. */
function resetWasmPath() {
    wasmPath = null;
}
exports.resetWasmPath = resetWasmPath;
//# sourceMappingURL=backend_wasm.js.map