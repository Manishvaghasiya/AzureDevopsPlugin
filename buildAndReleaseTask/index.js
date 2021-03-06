"use strict";
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
exports.__esModule = true;
var task = require("azure-pipelines-task-lib/task");
var axios_1 = require("axios");
var q_1 = require("q");
var fs = require('fs');
var path = require('path');
var dir = require('node-dir');
var copydir = require('copy-dir');
var zipdir = require('zip-dir');
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var inputStringServerURL_1, inputStringBaseURL_1, input_targetType_1, inputScriptFilePath, inputScriptFolderPath, inputStringTestObject_1, reportDploy_1, inputStringBrowser_1, inputStringStepExecutionInterval, inputStringReportInterval_1, inputCaptureFailureScreenshot_1, inputCaptureConditionFailureScreenshot_1, inputMailReport_1, inputBooleanRBTPriorityHigh_1, inputBooleanRBTPriorityMedium_1, inputBooleanRBTPriorityLow_1, inputPassFailPer_1, agentWorkFolder, currentReleaseName_1, TWreportTemplate_1, reportTemplatePath_1, token_1, tmp_1, count_1, isRBTEnable_1, rbtPriorityHigh_1, rbtPriorityMedium_1, rbtPriorityLow_1, checkServerUrl_1, inputScriptPath_1, inputFolderPath_1, screenshotDirectory_1, progressResponse_1, reportInterimResponse_1, reportDployPlace_1, screenshotResponse_1, stepExecutionInterval_1, overallResult_1, passResult_1, failResult_1, skipResult_1, notRunResult_1, varClearInterval_1, reportFolderExtraPath_1, resultCalc, deployReportTemplate, singleFileExecutionThread, convertReportToZIP, today, dd, mm, yyyy, ss, min, hh, timeStamp, files, dirSize, i, error_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 22, , 23]);
                    inputStringServerURL_1 = task.getInput('serverURL', true);
                    inputStringBaseURL_1 = task.getInput('baseURL', false);
                    input_targetType_1 = task.getInput('targetType', false);
                    inputScriptFilePath = task.getInput('filePath', /*required*/ true);
                    inputScriptFolderPath = task.getInput('folderPath', /*required*/ true);
                    inputStringTestObject_1 = task.getInput('testObject', false);
                    reportDploy_1 = task.getInput("reportDploy", true);
                    inputStringBrowser_1 = task.getInput('browser', false);
                    inputStringStepExecutionInterval = task.getInput('stepExecutionInterval', false);
                    inputStringReportInterval_1 = task.getInput('reportInterval', true);
                    inputCaptureFailureScreenshot_1 = task.getInput('captureFailureScreenshot', false);
                    inputCaptureConditionFailureScreenshot_1 = task.getInput('captureConditionFailureScreenshot', false);
                    inputMailReport_1 = task.getInput('mailReport', false);
                    inputBooleanRBTPriorityHigh_1 = task.getInput('rbtPriorityHigh', false);
                    inputBooleanRBTPriorityMedium_1 = task.getInput('rbtPriorityMedium', false);
                    inputBooleanRBTPriorityLow_1 = task.getInput('rbtPriorityLow', false);
                    inputPassFailPer_1 = task.getInput("passFailPer", false);
                    agentWorkFolder = task.getVariable('Agent.RootDirectory');
                    currentReleaseName_1 = task.getVariable('Release.ReleaseName');
                    TWreportTemplate_1 = process.env.APPDATA + "\\TWTemplate";
                    reportTemplatePath_1 = agentWorkFolder + "\\_tasks\\TWExtension_937e4568-749e-40d0-9778-78156ef133d3\\2.0.0\\ReportTemplate";
                    return [4 /*yield*/, q_1.delay(2000)];
                case 1:
                    _a.sent();
                    token_1 = '';
                    tmp_1 = 0;
                    count_1 = 0;
                    isRBTEnable_1 = false;
                    rbtPriorityHigh_1 = false;
                    rbtPriorityMedium_1 = false;
                    rbtPriorityLow_1 = false;
                    reportInterimResponse_1 = '';
                    reportDployPlace_1 = '';
                    stepExecutionInterval_1 = Number(inputStringStepExecutionInterval);
                    overallResult_1 = [];
                    passResult_1 = [];
                    failResult_1 = [];
                    skipResult_1 = [];
                    notRunResult_1 = [];
                    reportFolderExtraPath_1 = '';
                    resultCalc = function () {
                        return __awaiter(this, void 0, void 0, function () {
                            var sumOverall, sumPass, sumFail, sumSkip, sumNotRun, j, k, l, m, i, avgPassPer;
                            return __generator(this, function (_a) {
                                sumOverall = 0;
                                sumPass = 0;
                                sumFail = 0;
                                sumSkip = 0;
                                sumNotRun = 0;
                                for (j = 0; j < passResult_1.length; j++) {
                                    sumPass = (passResult_1[j]) + sumPass;
                                }
                                for (k = 0; k < failResult_1.length; k++) {
                                    sumFail = (failResult_1[k]) + sumFail;
                                }
                                for (l = 0; l < skipResult_1.length; l++) {
                                    sumSkip = (skipResult_1[l]) + sumSkip;
                                }
                                for (m = 0; m < notRunResult_1.length; m++) {
                                    sumNotRun = (notRunResult_1[m]) + sumNotRun;
                                }
                                for (i = 0; i < overallResult_1.length; i++) {
                                    sumOverall = (overallResult_1[i]) + sumOverall;
                                }
                                avgPassPer = sumOverall / overallResult_1.length;
                                if (avgPassPer >= inputPassFailPer_1) {
                                    console.log(" Overall Finished with "
                                        + avgPassPer.toFixed(2) + " % SUCCESS !"
                                        + "\n Overall result  [   PASS :  "
                                        + sumPass + ' |  FAIL :  '
                                        + sumFail + ' |  SKIP :  '
                                        + sumSkip + ' |  NOT RUN  : '
                                        + sumNotRun + "  ] ");
                                }
                                else {
                                    console.log(" Overall Finished with "
                                        + (100 - avgPassPer).toFixed(2) + " % FAILURE !"
                                        + "\n Overall result  [   PASS :  "
                                        + sumPass + ' |  FAIL :  '
                                        + sumFail + ' |  SKIP :  '
                                        + sumSkip + ' |  NOT RUN  : '
                                        + sumNotRun + "  ] ");
                                    throw new Error(" Task Failed ");
                                }
                                return [2 /*return*/];
                            });
                        });
                    };
                    deployReportTemplate = function (folderTimeStamp) {
                        return __awaiter(this, void 0, void 0, function () {
                            var today, dd, mm, yyyy, ss, min, hh, timeStamp;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        today = new Date();
                                        dd = today.getDate();
                                        mm = today.getMonth() + 1;
                                        yyyy = today.getFullYear();
                                        ss = today.getSeconds();
                                        min = today.getMinutes();
                                        hh = today.getHours();
                                        dd = dd < 10 ? '0' + dd : dd;
                                        mm = mm < 10 ? '0' + mm : mm;
                                        hh = hh > 12 ? hh - 12 : hh;
                                        hh = hh < 10 ? '0' + hh : hh;
                                        min = min < 10 ? '0' + min : min;
                                        ss = ss < 10 ? '0' + ss : ss;
                                        timeStamp = dd + mm + yyyy + "_" + hh + min + ss;
                                        reportFolderExtraPath_1 = folderTimeStamp ? "\\Reports_" + currentReleaseName_1 + "_" + folderTimeStamp : '';
                                        reportDployPlace_1 = reportDploy_1 + reportFolderExtraPath_1 + "\\Report_" + currentReleaseName_1 + "_" + timeStamp;
                                        if (!!fs.existsSync(TWreportTemplate_1)) return [3 /*break*/, 3];
                                        return [4 /*yield*/, copydir.sync(reportTemplatePath_1, TWreportTemplate_1)];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, q_1.delay(2000)];
                                    case 2:
                                        _a.sent();
                                        return [3 /*break*/, 6];
                                    case 3:
                                        if (!!fs.existsSync(TWreportTemplate_1)) return [3 /*break*/, 6];
                                        return [4 /*yield*/, copydir.sync(reportTemplatePath_1, TWreportTemplate_1)];
                                    case 4:
                                        _a.sent();
                                        return [4 /*yield*/, q_1.delay(2000)];
                                    case 5:
                                        _a.sent();
                                        _a.label = 6;
                                    case 6:
                                        if (!!fs.existsSync(TWreportTemplate_1)) return [3 /*break*/, 9];
                                        return [4 /*yield*/, copydir.sync(TWreportTemplate_1, reportDployPlace_1)];
                                    case 7:
                                        _a.sent();
                                        return [4 /*yield*/, q_1.delay(2000)];
                                    case 8:
                                        _a.sent();
                                        return [3 /*break*/, 13];
                                    case 9:
                                        if (!!fs.existsSync(reportDployPlace_1)) return [3 /*break*/, 12];
                                        return [4 /*yield*/, copydir.sync(TWreportTemplate_1, reportDployPlace_1)];
                                    case 10:
                                        _a.sent();
                                        return [4 /*yield*/, q_1.delay(2000)];
                                    case 11:
                                        _a.sent();
                                        return [3 /*break*/, 13];
                                    case 12: throw new Error(" Task Failed : Report Template not Found !!");
                                    case 13:
                                        screenshotDirectory_1 = reportDployPlace_1 + "\\screenshots";
                                        return [4 /*yield*/, fs.readdir(screenshotDirectory_1, function (err, files) {
                                                // if (err) throw new Error(" Task Failed : Report Template not Found !!");
                                                for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                                                    var file = files_1[_i];
                                                    fs.unlink(path.join(screenshotDirectory_1, file), function (err) {
                                                        // if (err) throw new Error(" Task Failed : Error in cleaning Screenshot directory ");
                                                    });
                                                }
                                            })];
                                    case 14:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        });
                    };
                    singleFileExecutionThread = function () {
                        return __awaiter(this, void 0, void 0, function () {
                            function process() {
                                return __awaiter(this, void 0, void 0, function () {
                                    var progressLog;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, progress_response()];
                                            case 1:
                                                progressLog = _a.sent();
                                                if (!(progressLog && progressLog != undefined)) return [3 /*break*/, 6];
                                                if (!(progressLog.status == 'play')) return [3 /*break*/, 5];
                                                return [4 /*yield*/, q_1.delay(5000)];
                                            case 2:
                                                _a.sent();
                                                if (progressLog.progress > tmp_1) {
                                                    console.log(" Script  " + progressLog.progress + " %  completed");
                                                }
                                                return [4 /*yield*/, progressLog.progress];
                                            case 3:
                                                tmp_1 = _a.sent();
                                                return [4 /*yield*/, process()];
                                            case 4:
                                                _a.sent();
                                                _a.label = 5;
                                            case 5: return [3 /*break*/, 10];
                                            case 6:
                                                count_1++;
                                                if (!(count_1 < 5)) return [3 /*break*/, 9];
                                                return [4 /*yield*/, q_1.delay(2000)];
                                            case 7:
                                                _a.sent();
                                                return [4 /*yield*/, process()];
                                            case 8:
                                                _a.sent();
                                                return [3 /*break*/, 10];
                                            case 9:
                                                count_1 = 0;
                                                _a.label = 10;
                                            case 10: return [2 /*return*/];
                                        }
                                    });
                                });
                            }
                            function reportGenerate() {
                                return __awaiter(this, void 0, void 0, function () {
                                    var isReportGenerate, filePath, error_2;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, report_interim()];
                                            case 1:
                                                isReportGenerate = _a.sent();
                                                if (!((isReportGenerate != undefined) && isReportGenerate)) return [3 /*break*/, 3];
                                                return [4 /*yield*/, isReportGenerate];
                                            case 2:
                                                reportInterimResponse_1 = _a.sent();
                                                _a.label = 3;
                                            case 3:
                                                filePath = reportDployPlace_1 + "\\data\\results.js";
                                                _a.label = 4;
                                            case 4:
                                                _a.trys.push([4, 7, , 8]);
                                                if (!((isReportGenerate != undefined) && isReportGenerate)) return [3 /*break*/, 6];
                                                return [4 /*yield*/, fs.writeFile(filePath, "var results = " + JSON.stringify(isReportGenerate) + ";", function (err) {
                                                        if (err)
                                                            throw new Error(" Task failed : Error in Report generation !! ");
                                                    })];
                                            case 5:
                                                _a.sent();
                                                _a.label = 6;
                                            case 6: return [3 /*break*/, 8];
                                            case 7:
                                                error_2 = _a.sent();
                                                return [3 /*break*/, 8];
                                            case 8: return [2 /*return*/];
                                        }
                                    });
                                });
                            }
                            function screenshotGeneration() {
                                return __awaiter(this, void 0, void 0, function () {
                                    var isScreenshotGenerateByte, screenshotFile, screenshotByteCode, imageFileName, base64, encodings, bytes, byteLength, byteRemainder, mainLength, a, b, c, d, chunk, i;
                                    var _this = this;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, screenshot()];
                                            case 1:
                                                isScreenshotGenerateByte = _a.sent();
                                                return [4 /*yield*/, isScreenshotGenerateByte];
                                            case 2:
                                                _a.sent();
                                                if (!isScreenshotGenerateByte) return [3 /*break*/, 8];
                                                return [4 /*yield*/, isScreenshotGenerateByte.screenshot[0]];
                                            case 3:
                                                screenshotFile = _a.sent();
                                                return [4 /*yield*/, isScreenshotGenerateByte.imagebytes[0]];
                                            case 4:
                                                screenshotByteCode = _a.sent();
                                                imageFileName = screenshotDirectory_1 + "\\" + screenshotFile;
                                                return [4 /*yield*/, fs.exists(screenshotDirectory_1, function (exists) { return __awaiter(_this, void 0, void 0, function () {
                                                        return __generator(this, function (_a) {
                                                            switch (_a.label) {
                                                                case 0:
                                                                    if (!!exists) return [3 /*break*/, 2];
                                                                    return [4 /*yield*/, fs.mkdir(screenshotDirectory_1, { recursive: true }, function (err) {
                                                                            // if (err) throw new Error(" Error in screenshot generation (Create Directory)!!");
                                                                        })];
                                                                case 1:
                                                                    _a.sent();
                                                                    _a.label = 2;
                                                                case 2: return [2 /*return*/];
                                                            }
                                                        });
                                                    }); })];
                                            case 5:
                                                _a.sent();
                                                return [4 /*yield*/, screenshotByteCode];
                                            case 6:
                                                _a.sent();
                                                if (!screenshotByteCode) return [3 /*break*/, 8];
                                                base64 = '';
                                                encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                                                bytes = new Uint8Array(screenshotByteCode);
                                                byteLength = bytes.byteLength;
                                                byteRemainder = byteLength % 3;
                                                mainLength = byteLength - byteRemainder;
                                                a = void 0;
                                                b = void 0;
                                                c = void 0;
                                                d = void 0;
                                                chunk = void 0;
                                                for (i = 0; i < mainLength; i += 3) {
                                                    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
                                                    a = (chunk & 16515072) >> 18;
                                                    b = (chunk & 258048) >> 12;
                                                    c = (chunk & 4032) >> 6;
                                                    d = chunk & 63;
                                                    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
                                                }
                                                if (byteRemainder === 1) {
                                                    chunk = bytes[mainLength];
                                                    a = (chunk & 252) >> 2;
                                                    b = (chunk & 3) << 4;
                                                    base64 += "" + encodings[a] + encodings[b] + "==";
                                                }
                                                else if (byteRemainder === 2) {
                                                    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];
                                                    a = (chunk & 64512) >> 10;
                                                    b = (chunk & 1008) >> 4;
                                                    c = (chunk & 15) << 2;
                                                    base64 += "" + encodings[a] + encodings[b] + encodings[c] + "=";
                                                }
                                                //screenshot generate
                                                return [4 /*yield*/, fs.writeFile(imageFileName, base64, 'base64', function (err) {
                                                        // if (err) throw new Error(" Error in screenshot generation (Base64)!! ");
                                                    })];
                                            case 7:
                                                //screenshot generate
                                                _a.sent();
                                                _a.label = 8;
                                            case 8: return [2 /*return*/];
                                        }
                                    });
                                });
                            }
                            function step_interval() {
                                return __awaiter(this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        if (stepExecutionInterval_1 > 0) {
                                            return [2 /*return*/, stepExecutionInterval_1];
                                        }
                                        else {
                                            return [2 /*return*/, 2000];
                                        }
                                        return [2 /*return*/];
                                    });
                                });
                            }
                            function checkServer() {
                                return __awaiter(this, void 0, void 0, function () {
                                    var url;
                                    return __generator(this, function (_a) {
                                        url = inputStringServerURL_1;
                                        return [2 /*return*/, axios_1["default"].get(url, {
                                                headers: {
                                                    "Content-Type": "application/json"
                                                }
                                            }).then(function (response) {
                                                if (response) {
                                                    checkServerUrl_1 = response.data;
                                                    return checkServerUrl_1;
                                                }
                                                else {
                                                    return 'false';
                                                }
                                            })["catch"](function (error) {
                                                if (error)
                                                    throw new Error("Testingwhiz server at + [" + inputStringServerURL_1 + "]" + " is not up.");
                                            })];
                                    });
                                });
                            }
                            function getTokenForFile() {
                                return __awaiter(this, void 0, void 0, function () {
                                    var urlLoad;
                                    return __generator(this, function (_a) {
                                        urlLoad = inputStringServerURL_1 + 'load?';
                                        return [2 /*return*/, axios_1["default"].put(urlLoad, {
                                                "fileName": inputScriptPath_1,
                                                "fileType": "twizx",
                                                headers: {
                                                    "Content-Type": "application/json"
                                                }
                                            }).then(function (response) {
                                                if (response) {
                                                    token_1 = response.data;
                                                    return token_1;
                                                }
                                                else {
                                                    return false;
                                                }
                                            })["catch"](function (error) {
                                                if (error)
                                                    throw new Error(" [" + inputStringServerURL_1 + "]" + " is Invalid URL or proided Script or File Path is wrong "
                                                        + "\n Please Provide URL of the TestingWhiz Automation server in the format http://host:port/ or Check the proided Script or File Path");
                                            })];
                                    });
                                });
                            }
                            function setParamsForFile() {
                                return __awaiter(this, void 0, void 0, function () {
                                    var urlParam, stepInterval;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (isRBTEnable_1) {
                                                    rbtPriorityHigh_1 = inputBooleanRBTPriorityHigh_1 === 'true';
                                                    rbtPriorityMedium_1 = inputBooleanRBTPriorityLow_1 === 'true';
                                                    rbtPriorityLow_1 = inputBooleanRBTPriorityMedium_1 === 'true';
                                                }
                                                else {
                                                    rbtPriorityHigh_1 = false;
                                                    rbtPriorityMedium_1 = false;
                                                    rbtPriorityLow_1 = false;
                                                }
                                                urlParam = inputStringServerURL_1 + "params?token=" + token_1;
                                                return [4 /*yield*/, step_interval()];
                                            case 1:
                                                stepInterval = _a.sent();
                                                return [2 /*return*/, axios_1["default"].put(urlParam, {
                                                        "browser": inputStringBrowser_1,
                                                        "interval": stepInterval,
                                                        "operatingSystem": "Windows",
                                                        "version": "",
                                                        "isRBTEnable": isRBTEnable_1,
                                                        "highPriority": rbtPriorityHigh_1,
                                                        "mediumPriority": rbtPriorityMedium_1,
                                                        "lowPriority": rbtPriorityLow_1,
                                                        "testObject": inputStringTestObject_1 || "",
                                                        "reportPath": reportDployPlace_1,
                                                        "baseURL": inputStringBaseURL_1,
                                                        "isFailureScreenshot": inputCaptureFailureScreenshot_1,
                                                        "isConditionFailureScreenshot": inputCaptureConditionFailureScreenshot_1,
                                                        headers: {
                                                            "Content-Type": "application/json"
                                                        }
                                                    }).then(function (response) {
                                                        if (response) {
                                                            return true;
                                                        }
                                                        else {
                                                            return false;
                                                        }
                                                    })["catch"](function (error) {
                                                        if (error)
                                                            throw new Error(" [Parameter for Script]" + " is Invalid !!! \n Please Provide Valid Parameters");
                                                    })];
                                        }
                                    });
                                });
                            }
                            function runScript() {
                                return __awaiter(this, void 0, void 0, function () {
                                    var urlPlay;
                                    return __generator(this, function (_a) {
                                        urlPlay = inputStringServerURL_1 + "play?token=" + token_1;
                                        return [2 /*return*/, axios_1["default"].put(urlPlay, {
                                                headers: {
                                                    "Content-Type": "application/json"
                                                }
                                            }).then(function (response) {
                                                if (response) {
                                                    return true;
                                                }
                                                else {
                                                    return false;
                                                }
                                            })["catch"](function (error) {
                                                if (error)
                                                    throw new Error("Error in script Execution !!!");
                                            })];
                                    });
                                });
                            }
                            function progress_response() {
                                return __awaiter(this, void 0, void 0, function () {
                                    var urlProgressResponse;
                                    return __generator(this, function (_a) {
                                        urlProgressResponse = inputStringServerURL_1 + "progress?token=" + token_1;
                                        return [2 /*return*/, axios_1["default"].put(urlProgressResponse, {
                                                headers: {
                                                    "Content-Type": "application/json"
                                                }
                                            }).then(function (response) {
                                                if (response) {
                                                    progressResponse_1 = response.data;
                                                    return progressResponse_1;
                                                }
                                                else {
                                                    return 'false';
                                                }
                                            })["catch"](function (error) {
                                                // if(error) throw new Error("");
                                            })];
                                    });
                                });
                            }
                            function report_interim() {
                                return __awaiter(this, void 0, void 0, function () {
                                    var urlReport_interim;
                                    return __generator(this, function (_a) {
                                        urlReport_interim = inputStringServerURL_1 + "report_interim?token=" + token_1;
                                        return [2 /*return*/, axios_1["default"].put(urlReport_interim, {
                                                headers: {
                                                    "Content-Type": "application/json"
                                                }
                                            }).then(function (response) {
                                                if (response) {
                                                    reportInterimResponse_1 = response.data;
                                                    return reportInterimResponse_1;
                                                }
                                                else {
                                                    return false;
                                                }
                                            })["catch"](function () {
                                                // if(error) throw new Error("");
                                            })];
                                    });
                                });
                            }
                            function screenshot() {
                                return __awaiter(this, void 0, void 0, function () {
                                    var urlReport_interim;
                                    return __generator(this, function (_a) {
                                        urlReport_interim = inputStringServerURL_1 + "screenshot?token=" + token_1;
                                        return [2 /*return*/, axios_1["default"].put(urlReport_interim, {
                                                headers: {
                                                    "Content-Type": "application/json"
                                                }
                                            }).then(function (response) {
                                                if (response) {
                                                    screenshotResponse_1 = response.data;
                                                    return screenshotResponse_1;
                                                }
                                                else {
                                                    return false;
                                                }
                                            })["catch"](function () {
                                                // if(error) throw new Error("");
                                            })];
                                    });
                                });
                            }
                            var isServerUp, isTokenRecieved, isparamResponseRecieved, isScriptPlay, result, tmpPass, tmpFail, tmpSkip, tmpNotRun, totalCase, passPercentage;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        //Task Parameters
                                        console.log('\n Server URl : ' + inputStringServerURL_1);
                                        if (inputStringBaseURL_1) {
                                            console.log(' Base URl : ' + inputStringBaseURL_1);
                                        }
                                        else {
                                            console.log(' Base URl : ');
                                        }
                                        if (inputFolderPath_1) {
                                            console.log(' Folder Path : ' + inputFolderPath_1);
                                        }
                                        else {
                                            console.log(' Script Path : ' + inputScriptPath_1);
                                        }
                                        console.log(' Test Object : ' + inputStringTestObject_1);
                                        console.log(' Report Path : ' + reportDployPlace_1);
                                        console.log(' Browser : ' + inputStringBrowser_1);
                                        if (inputPassFailPer_1) {
                                            console.log(" Passing '%' : " + inputPassFailPer_1 + ' %');
                                        }
                                        else {
                                            console.log(" Passing '%' : 0 %");
                                        }
                                        console.log(' Capture Failure Screenshot : ' + inputCaptureFailureScreenshot_1);
                                        console.log(' Capture Condition Failure Screenshot : ' + inputCaptureConditionFailureScreenshot_1);
                                        console.log(' Send Report With Mail : ' + inputMailReport_1);
                                        return [4 /*yield*/, q_1.delay(1000)];
                                    case 1:
                                        _a.sent();
                                        isRBTEnable_1 = (inputBooleanRBTPriorityHigh_1 === 'true' || inputBooleanRBTPriorityMedium_1 === 'true' || inputBooleanRBTPriorityLow_1 === 'true' || false);
                                        return [4 /*yield*/, q_1.delay(1000)];
                                    case 2:
                                        _a.sent();
                                        console.log(' Is RBT enabled execution : ', isRBTEnable_1 + '');
                                        if (isRBTEnable_1) {
                                            console.log(' RBT Priority High : ', inputBooleanRBTPriorityHigh_1);
                                            console.log(' RBT Priority Medium : ', inputBooleanRBTPriorityMedium_1);
                                            console.log(' RBT Priority Low : ', inputBooleanRBTPriorityLow_1);
                                        }
                                        return [4 /*yield*/, checkServer()];
                                    case 3:
                                        isServerUp = _a.sent();
                                        if (!isServerUp) return [3 /*break*/, 21];
                                        return [4 /*yield*/, getTokenForFile()];
                                    case 4:
                                        isTokenRecieved = _a.sent();
                                        if (!isTokenRecieved) return [3 /*break*/, 19];
                                        console.log(" Playing with token : " + isTokenRecieved);
                                        return [4 /*yield*/, setParamsForFile()];
                                    case 5:
                                        isparamResponseRecieved = _a.sent();
                                        if (!isparamResponseRecieved) return [3 /*break*/, 17];
                                        return [4 /*yield*/, runScript()];
                                    case 6:
                                        isScriptPlay = _a.sent();
                                        varClearInterval_1 = setInterval(screenshotGeneration, 1000);
                                        console.log(" Executing Script File : " + inputScriptPath_1);
                                        console.log("\n ========================== Script Execution Start ===========================");
                                        console.log("\n Script  0 %  completed");
                                        if (!isScriptPlay) return [3 /*break*/, 15];
                                        return [4 /*yield*/, process()];
                                    case 7:
                                        _a.sent();
                                        console.log(" Script  100 %  completed");
                                        console.log("\n ========================== Script Execution End ===========================\n");
                                        return [4 /*yield*/, reportGenerate()];
                                    case 8:
                                        _a.sent();
                                        clearInterval(varClearInterval_1);
                                        return [4 /*yield*/, q_1.delay(Number(inputStringReportInterval_1))];
                                    case 9:
                                        _a.sent();
                                        return [4 /*yield*/, reportInterimResponse_1.result];
                                    case 10:
                                        result = _a.sent();
                                        return [4 /*yield*/, result.pass];
                                    case 11:
                                        tmpPass = _a.sent();
                                        return [4 /*yield*/, result.fail];
                                    case 12:
                                        tmpFail = _a.sent();
                                        return [4 /*yield*/, result.skip];
                                    case 13:
                                        tmpSkip = _a.sent();
                                        return [4 /*yield*/, result.notRun];
                                    case 14:
                                        tmpNotRun = _a.sent();
                                        totalCase = tmpPass + tmpFail + tmpNotRun;
                                        passPercentage = tmpPass / totalCase * 100;
                                        overallResult_1.push(passPercentage);
                                        passResult_1.push(tmpPass);
                                        failResult_1.push(tmpFail);
                                        skipResult_1.push(tmpSkip);
                                        notRunResult_1.push(tmpNotRun);
                                        try {
                                            if (tmpPass != 0 && (tmpPass >= tmpFail)) {
                                                console.log(" Report for the testingwhiz script " + ' [ ' + inputScriptPath_1 + ' ] '
                                                    + "\n with result [ "
                                                    + '  PASS :  ' + tmpPass
                                                    + ' |  FAIL :  ' + tmpFail
                                                    + ' |  SKIP :  ' + tmpSkip
                                                    + ' |  NOT RUN  : '
                                                    + tmpNotRun + ' ] '
                                                    + "\n is here at " + ' [ ' + reportDployPlace_1 + ' ] \n');
                                            }
                                            else {
                                                console.log(" Report for the testingwhiz script " + ' [ ' + inputScriptPath_1 + ' ] '
                                                    + "\n with result [ "
                                                    + '  PASS :  ' + tmpPass
                                                    + ' |  FAIL :  ' + tmpFail
                                                    + ' |  SKIP :  ' + tmpSkip
                                                    + ' |  NOT RUN  : ' + tmpNotRun + ' ] '
                                                    + "\n is here at " + ' [ ' + reportDployPlace_1 + ' ] \n');
                                            }
                                        }
                                        catch (error) {
                                            // console.log("Task ERROR : ", error);
                                        }
                                        if (tmpPass != 0 && (tmpPass >= tmpFail)) {
                                            console.log("\n Finished : SUCCESS ! \n");
                                        }
                                        else {
                                            console.log("\n Finished : FAILED !\n");
                                        }
                                        return [3 /*break*/, 16];
                                    case 15: throw new Error(" Task Failed : Error in script execution ");
                                    case 16: return [3 /*break*/, 18];
                                    case 17: throw new Error(" Task Failed : Parameter is not set ");
                                    case 18: return [3 /*break*/, 20];
                                    case 19: throw new Error(" Task Failed : TWToken not Found ");
                                    case 20: return [3 /*break*/, 22];
                                    case 21: throw new Error(" Task Failed : Testingwhiz server is not UP !");
                                    case 22: return [2 /*return*/];
                                }
                            });
                        });
                    };
                    convertReportToZIP = function () { return __awaiter(_this, void 0, void 0, function () {
                        var folderPath;
                        return __generator(this, function (_a) {
                            if (inputMailReport_1 === 'true') {
                                if (input_targetType_1.toUpperCase() == 'FILEPATH') {
                                    task.setVariable('reportDeployPath', reportDployPlace_1 + '.zip');
                                    zipdir(reportDployPlace_1, { saveTo: reportDployPlace_1 + '.zip' }, function (err, buffer) {
                                        // do something
                                    });
                                }
                                else if (input_targetType_1.toUpperCase() == 'FOLDERPATH') {
                                    folderPath = reportDploy_1 + "\\" + reportFolderExtraPath_1;
                                    task.setVariable('reportDeployPath', folderPath + '.zip');
                                    zipdir(folderPath, { saveTo: folderPath + '.zip' }, function (err, buffer) {
                                        // do something
                                    });
                                }
                            }
                            return [2 /*return*/];
                        });
                    }); };
                    if (!!(inputPassFailPer_1 <= 100 && inputPassFailPer_1 >= 0)) return [3 /*break*/, 2];
                    console.log("\n");
                    throw new Error(inputPassFailPer_1 + "is Inavlid Pass/Fail Percentage value. Please Provide valid value between [1 - 100]. ");
                case 2:
                    if (!!(inputStringReportInterval_1 > '0')) return [3 /*break*/, 3];
                    console.log("\n");
                    throw new Error(inputStringReportInterval_1 + ' is Inavlid value for Report interval. Please Provide valid value greater than 1000 ms.');
                case 3:
                    if (!(input_targetType_1.toUpperCase() == 'FILEPATH')) return [3 /*break*/, 10];
                    inputScriptPath_1 = inputScriptFilePath;
                    if (!(!task.stats(inputScriptPath_1).isFile() || !inputScriptPath_1.toUpperCase().match(/\.TWIZX$/))) return [3 /*break*/, 4];
                    console.log("\n");
                    throw new Error(inputScriptPath_1 + " is Invalid File [ Only TWIZX/twizx file is accepted ] ");
                case 4:
                    console.log("\n\n\n Task Configuration ");
                    return [4 /*yield*/, deployReportTemplate(false)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, singleFileExecutionThread()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, convertReportToZIP()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, resultCalc()];
                case 8:
                    _a.sent();
                    _a.label = 9;
                case 9: return [3 /*break*/, 21];
                case 10:
                    if (!(input_targetType_1.toUpperCase() == 'FOLDERPATH')) return [3 /*break*/, 21];
                    inputFolderPath_1 = inputScriptFolderPath;
                    today = new Date();
                    dd = today.getDate();
                    mm = today.getMonth() + 1;
                    yyyy = today.getFullYear();
                    ss = today.getSeconds();
                    min = today.getMinutes();
                    hh = today.getHours();
                    dd = dd < 10 ? '0' + dd : dd;
                    mm = mm < 10 ? '0' + mm : mm;
                    hh = hh > 12 ? hh - 12 : hh;
                    hh = hh < 10 ? '0' + hh : hh;
                    min = min < 10 ? '0' + min : min;
                    ss = ss < 10 ? '0' + ss : ss;
                    timeStamp = dd + mm + yyyy + "_" + hh + min + ss;
                    files = dir.files(inputFolderPath_1, { sync: true });
                    dirSize = files.length;
                    return [4 /*yield*/, dirSize];
                case 11:
                    _a.sent(), files;
                    i = 0;
                    _a.label = 12;
                case 12:
                    if (!(i < dirSize)) return [3 /*break*/, 18];
                    if (!(task.stats(files[i]).isFile() && files[i].toUpperCase().match(/\.TWIZX$/))) return [3 /*break*/, 16];
                    return [4 /*yield*/, files[i]];
                case 13:
                    inputScriptPath_1 = _a.sent();
                    console.log("\n\n\n Task Configuration\n");
                    return [4 /*yield*/, deployReportTemplate(timeStamp)];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, singleFileExecutionThread()];
                case 15:
                    _a.sent();
                    return [3 /*break*/, 17];
                case 16:
                    console.log(" Inavaid files are : ", files[i]);
                    _a.label = 17;
                case 17:
                    i++;
                    return [3 /*break*/, 12];
                case 18: return [4 /*yield*/, convertReportToZIP()];
                case 19:
                    _a.sent();
                    return [4 /*yield*/, resultCalc()];
                case 20:
                    _a.sent();
                    _a.label = 21;
                case 21: return [3 /*break*/, 23];
                case 22:
                    error_1 = _a.sent();
                    task.setResult(task.TaskResult.Failed, error_1);
                    return [3 /*break*/, 23];
                case 23: return [2 /*return*/];
            }
        });
    });
}
run();
