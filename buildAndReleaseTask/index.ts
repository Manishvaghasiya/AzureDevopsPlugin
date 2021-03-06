import task = require('azure-pipelines-task-lib/task');
import axios from 'axios';
import { delay, async } from 'q';
const fs = require('fs');
const path = require('path');
let dir = require('node-dir');
let copydir = require('copy-dir');
var zipdir = require('zip-dir');

async function run() {

    try {

        const inputStringServerURL: string = task.getInput('serverURL', true);
        const inputStringBaseURL: string = task.getInput('baseURL', false);
        const input_targetType: string = task.getInput('targetType', false);
        const inputScriptFilePath: string = task.getInput('filePath',/*required*/ true);
        const inputScriptFolderPath: string = task.getInput('folderPath', /*required*/ true);
        const inputStringTestObject: string = task.getInput('testObject', false);
        const reportDploy: string = task.getInput("reportDploy", true);
        const inputStringBrowser: string = task.getInput('browser', false);
        const inputStringStepExecutionInterval: string = task.getInput('stepExecutionInterval', false);
        const inputStringReportInterval: string = task.getInput('reportInterval', true);
        const inputCaptureFailureScreenshot: string = task.getInput('captureFailureScreenshot', false);
        const inputCaptureConditionFailureScreenshot: string = task.getInput('captureConditionFailureScreenshot', false);
        const inputMailReport: string = task.getInput('mailReport', false);
        const inputBooleanRBTPriorityHigh: string = task.getInput('rbtPriorityHigh', false);
        const inputBooleanRBTPriorityMedium: string = task.getInput('rbtPriorityMedium', false);
        const inputBooleanRBTPriorityLow: string = task.getInput('rbtPriorityLow', false);
        const inputPassFailPer: any = task.getInput("passFailPer", false);
        const agentWorkFolder = task.getVariable('Agent.RootDirectory');
        const currentReleaseName = task.getVariable('Release.ReleaseName');
        const TWreportTemplate = process.env.APPDATA + "\\TWTemplate";
        const reportTemplatePath = agentWorkFolder + "\\_tasks\\TWExtension_937e4568-749e-40d0-9778-78156ef133d3\\2.0.0\\ReportTemplate";

        await delay(2000);

        let token: any = '';
        let tmp: number = 0;
        let count: number = 0;
        let isRBTEnable: boolean = false;
        let rbtPriorityHigh: boolean = false;
        let rbtPriorityMedium: boolean = false;
        let rbtPriorityLow: boolean = false;
        let checkServerUrl: any;
        let inputScriptPath: string;
        let inputFolderPath: string;
        let screenshotDirectory: string;
        let progressResponse: any;
        let reportInterimResponse: any = '';
        let reportDployPlace: string = '';
        let screenshotResponse: any;
        let stepExecutionInterval = Number(inputStringStepExecutionInterval);
        let overallResult: Array<number> = [];
        let passResult: Array<number> = [];
        let failResult: Array<number> = [];
        let skipResult: Array<number> = [];
        let notRunResult: Array<number> = [];
        let varClearInterval: any;
        let reportFolderExtraPath: string = '';

        let resultCalc = async function () {

            let sumOverall = 0;
            let sumPass = 0;
            let sumFail = 0;
            let sumSkip = 0;
            let sumNotRun = 0;

            for (let j = 0; j < passResult.length; j++) {
                sumPass = (passResult[j]) + sumPass;
            }
            for (let k = 0; k < failResult.length; k++) {
                sumFail = (failResult[k]) + sumFail;
            }
            for (let l = 0; l < skipResult.length; l++) {
                sumSkip = (skipResult[l]) + sumSkip;
            }
            for (let m = 0; m < notRunResult.length; m++) {
                sumNotRun = (notRunResult[m]) + sumNotRun;
            }
            for (let i = 0; i < overallResult.length; i++) {
                sumOverall = (overallResult[i]) + sumOverall;
            }

            const avgPassPer = sumOverall / overallResult.length;

            if (avgPassPer >= inputPassFailPer) {

                console.log(" Overall Finished with "
                    + avgPassPer.toFixed(2) + " % SUCCESS !"
                    + "\n Overall result  [   PASS :  "
                    + sumPass + ' |  FAIL :  '
                    + sumFail + ' |  SKIP :  '
                    + sumSkip + ' |  NOT RUN  : '
                    + sumNotRun + "  ] "
                );

            } else {

                console.log(" Overall Finished with "
                    + (100 - avgPassPer).toFixed(2) + " % FAILURE !"
                    + "\n Overall result  [   PASS :  "
                    + sumPass + ' |  FAIL :  '
                    + sumFail + ' |  SKIP :  '
                    + sumSkip + ' |  NOT RUN  : '
                    + sumNotRun + "  ] "
                );
                throw new Error(" Task Failed ");
            }
        }


        //*********************** twizx file execution function start ***********************//

        let deployReportTemplate = async function (folderTimeStamp?: any) {

            const today = new Date();
            let dd: any = today.getDate();
            let mm: any = today.getMonth() + 1;
            let yyyy = today.getFullYear();
            let ss: any = today.getSeconds();
            let min: any = today.getMinutes();
            let hh: any = today.getHours();
            dd = dd < 10 ? '0' + dd : dd;
            mm = mm < 10 ? '0' + mm : mm;
            hh = hh > 12 ? hh - 12 : hh;
            hh = hh < 10 ? '0' + hh : hh;
            min = min < 10 ? '0' + min : min;
            ss = ss < 10 ? '0' + ss : ss;
            const timeStamp = dd + '' + mm + '' + yyyy + '' + "_" + hh + '' + min + '' + ss + '';
            reportFolderExtraPath = folderTimeStamp ? "\\Reports_" + currentReleaseName + "_" + folderTimeStamp : '';
            reportDployPlace = reportDploy + reportFolderExtraPath + "\\Report_" + currentReleaseName + "_" + timeStamp;
            if (!fs.existsSync(TWreportTemplate)) {
                await copydir.sync(reportTemplatePath, TWreportTemplate);
                await delay(2000);
            } else if (!fs.existsSync(TWreportTemplate)) {
                await copydir.sync(reportTemplatePath, TWreportTemplate);
                await delay(2000);
            }

            if (!fs.existsSync(TWreportTemplate)) {
                await copydir.sync(TWreportTemplate, reportDployPlace);
                await delay(2000);
            } else if (!fs.existsSync(reportDployPlace)) {
                await copydir.sync(TWreportTemplate, reportDployPlace);
                await delay(2000);
            } else {
                throw new Error(" Task Failed : Report Template not Found !!");
            }

            screenshotDirectory = reportDployPlace + "\\screenshots";
            await fs.readdir(screenshotDirectory, (err: any, files: any) => {
                // if (err) throw new Error(" Task Failed : Report Template not Found !!");
                for (const file of files) {
                    fs.unlink(path.join(screenshotDirectory, file), (err: any) => {
                        // if (err) throw new Error(" Task Failed : Error in cleaning Screenshot directory ");
                    });
                }
            });
        }

        let singleFileExecutionThread = async function () {

            //Task Parameters

            console.log('\n Server URl : ' + inputStringServerURL);
            if (inputStringBaseURL) {
                console.log(' Base URl : ' + inputStringBaseURL);
            } else {
                console.log(' Base URl : ');
            }
            if (inputFolderPath) {
                console.log(' Folder Path : ' + inputFolderPath);
            } else {
                console.log(' Script Path : ' + inputScriptPath);
            }
            console.log(' Test Object : ' + inputStringTestObject);
            console.log(' Report Path : ' + reportDployPlace);
            console.log(' Browser : ' + inputStringBrowser);
            if (inputPassFailPer) {
                console.log(" Passing '%' : " + inputPassFailPer + ' %');
            } else {
                console.log(" Passing '%' : 0 %");
            }
            console.log(' Capture Failure Screenshot : ' + inputCaptureFailureScreenshot);
            console.log(' Capture Condition Failure Screenshot : ' + inputCaptureConditionFailureScreenshot);
            console.log(' Send Report With Mail : ' + inputMailReport);
            await delay(1000);
            isRBTEnable = (inputBooleanRBTPriorityHigh === 'true' || inputBooleanRBTPriorityMedium === 'true' || inputBooleanRBTPriorityLow === 'true' || false);
            await delay(1000);
            console.log(' Is RBT enabled execution : ', isRBTEnable + '');
            if (isRBTEnable) {
                console.log(' RBT Priority High : ', inputBooleanRBTPriorityHigh);
                console.log(' RBT Priority Medium : ', inputBooleanRBTPriorityMedium);
                console.log(' RBT Priority Low : ', inputBooleanRBTPriorityLow);
            }

            //Process starts
            const isServerUp = await checkServer();
            if (isServerUp) {

                const isTokenRecieved = await getTokenForFile();

                if (isTokenRecieved) {
                    console.log(" Playing with token : " + isTokenRecieved);
                    const isparamResponseRecieved = await setParamsForFile();

                    if (isparamResponseRecieved) {

                        const isScriptPlay = await runScript();
                        varClearInterval = setInterval(screenshotGeneration, 1000);
                        console.log(" Executing Script File : " + inputScriptPath);
                        console.log("\n ========================== Script Execution Start ===========================");
                        console.log("\n Script  0 %  completed");

                        if (isScriptPlay) {

                            await process();
                            console.log(" Script  100 %  completed");
                            console.log("\n ========================== Script Execution End ===========================\n");
                            await reportGenerate();
                            clearInterval(varClearInterval);
                            await delay(Number(inputStringReportInterval));
                            let result = await reportInterimResponse.result;
                            let tmpPass = await result.pass;
                            let tmpFail = await result.fail;
                            let tmpSkip = await result.skip;
                            let tmpNotRun = await result.notRun;
                            let totalCase = tmpPass + tmpFail + tmpNotRun;
                            let passPercentage = tmpPass / totalCase * 100;
                            overallResult.push(passPercentage);
                            passResult.push(tmpPass);
                            failResult.push(tmpFail);
                            skipResult.push(tmpSkip);
                            notRunResult.push(tmpNotRun);

                            try {
                                if (tmpPass != 0 && (tmpPass >= tmpFail)) {

                                    console.log(" Report for the testingwhiz script " + ' [ ' + inputScriptPath + ' ] '
                                        + "\n with result [ "
                                        + '  PASS :  ' + tmpPass
                                        + ' |  FAIL :  ' + tmpFail
                                        + ' |  SKIP :  ' + tmpSkip
                                        + ' |  NOT RUN  : '
                                        + tmpNotRun + ' ] '
                                        + "\n is here at " + ' [ ' + reportDployPlace + ' ] \n'
                                    );

                                } else {

                                    console.log(" Report for the testingwhiz script " + ' [ ' + inputScriptPath + ' ] '
                                        + "\n with result [ "
                                        + '  PASS :  ' + tmpPass
                                        + ' |  FAIL :  ' + tmpFail
                                        + ' |  SKIP :  ' + tmpSkip
                                        + ' |  NOT RUN  : ' + tmpNotRun + ' ] '
                                        + "\n is here at " + ' [ ' + reportDployPlace + ' ] \n'
                                    );
                                }
                            } catch (error) {
                                // console.log("Task ERROR : ", error);
                            }

                            if (tmpPass != 0 && (tmpPass >= tmpFail)) {
                                console.log("\n Finished : SUCCESS ! \n");
                            } else {
                                console.log("\n Finished : FAILED !\n");
                            }
                        } else {
                            throw new Error(" Task Failed : Error in script execution ");
                        }

                    } else {
                        throw new Error(" Task Failed : Parameter is not set ");
                    }

                } else {
                    throw new Error(" Task Failed : TWToken not Found ");
                }
            } else {
                throw new Error(" Task Failed : Testingwhiz server is not UP !");
            }


            async function process() {
                let progressLog = await progress_response();
                if (progressLog && progressLog != undefined) {
                    if (progressLog.status == 'play') {
                        await delay(5000);
                        if (progressLog.progress > tmp) {
                            console.log(" Script  " + progressLog.progress + " %  completed");
                        }
                        tmp = await progressLog.progress;
                        await process();
                    }
                } else {
                    count++;
                    if (count < 5) {
                        await delay(2000);
                        await process();
                    } else {
                        count = 0;
                    }
                }
            }


            async function reportGenerate() {
                const isReportGenerate = await report_interim();
                if ((isReportGenerate != undefined) && isReportGenerate) {
                    reportInterimResponse = await isReportGenerate;
                }
                const filePath = reportDployPlace + "\\data\\results.js";
                try {
                    if ((isReportGenerate != undefined) && isReportGenerate) {
                        await fs.writeFile(filePath, "var results = " + JSON.stringify(isReportGenerate) + ";", function (err: any) {
                            if (err) throw new Error(" Task failed : Error in Report generation !! ");
                        });
                    }
                } catch (error) {
                    // console.log("\n WARNING : In report generation");
                }
            }


            async function screenshotGeneration() {
                const isScreenshotGenerateByte = await screenshot();
                await isScreenshotGenerateByte;
                if (isScreenshotGenerateByte) {
                    let screenshotFile = await isScreenshotGenerateByte.screenshot[0];
                    const screenshotByteCode = await isScreenshotGenerateByte.imagebytes[0];
                    let imageFileName = screenshotDirectory + "\\" + screenshotFile;

                    await fs.exists(screenshotDirectory, async (exists: any) => {
                        if (!exists) {
                            await fs.mkdir(screenshotDirectory, { recursive: true }, (err: any) => {
                                // if (err) throw new Error(" Error in screenshot generation (Create Directory)!!");
                            });
                        }
                    })

                    await screenshotByteCode;
                    if (screenshotByteCode) {
                        //base64ArrayBuffer conversion
                        let base64 = '';
                        const encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

                        const bytes = new Uint8Array(screenshotByteCode);
                        const byteLength = bytes.byteLength;
                        const byteRemainder = byteLength % 3;
                        const mainLength = byteLength - byteRemainder;

                        let a;
                        let b;
                        let c;
                        let d;
                        let chunk;

                        for (let i = 0; i < mainLength; i += 3) {
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
                            base64 += `${encodings[a]}${encodings[b]}==`;
                        }
                        else if (byteRemainder === 2) {
                            chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];
                            a = (chunk & 64512) >> 10;
                            b = (chunk & 1008) >> 4;
                            c = (chunk & 15) << 2;
                            base64 += `${encodings[a]}${encodings[b]}${encodings[c]}=`;
                        }
                        //screenshot generate
                        await fs.writeFile(imageFileName, base64, 'base64', function (err: any) {
                            // if (err) throw new Error(" Error in screenshot generation (Base64)!! ");
                        });
                    }
                }
            }


            async function step_interval() {

                if (stepExecutionInterval > 0) {
                    return stepExecutionInterval;
                }
                else {
                    return 2000;
                }
            }

            async function checkServer() {

                let url = inputStringServerURL;
                return axios.get(url, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(function (response) {
                    if (response) {
                        checkServerUrl = response.data;
                        return checkServerUrl;
                    } else {
                        return 'false';
                    }
                }).catch(function (error) {
                    if (error) throw new Error("Testingwhiz server at + [" + inputStringServerURL + "]" + " is not up.");
                });
            }

            async function getTokenForFile() {

                let urlLoad = inputStringServerURL + 'load?';
                return axios.put(urlLoad, {
                    "fileName": inputScriptPath,
                    "fileType": "twizx",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(function (response) {
                    if (response) {
                        token = response.data;
                        return token;
                    } else {
                        return false;
                    }
                }).catch(function (error) {
                    if (error) throw new Error(" [" + inputStringServerURL + "]" + " is Invalid URL or proided Script or File Path is wrong "
                        + "\n Please Provide URL of the TestingWhiz Automation server in the format http://host:port/ or Check the proided Script or File Path");
                });
            }


            async function setParamsForFile() {

                if (isRBTEnable) {
                    rbtPriorityHigh = inputBooleanRBTPriorityHigh === 'true';
                    rbtPriorityMedium = inputBooleanRBTPriorityMedium === 'true';
                    rbtPriorityLow = inputBooleanRBTPriorityLow === 'true';
                } else {
                    rbtPriorityHigh = false;
                    rbtPriorityMedium = false;
                    rbtPriorityLow = false;
                }

                let urlParam = inputStringServerURL + "params?token=" + token;
                let stepInterval = await step_interval()

                return axios.put(urlParam, {
                    "browser": inputStringBrowser,
                    "interval": stepInterval,
                    "operatingSystem": "Windows",
                    "version": "",
                    "isRBTEnable": isRBTEnable,
                    "highPriority": rbtPriorityHigh,
                    "mediumPriority": rbtPriorityMedium,
                    "lowPriority": rbtPriorityLow,
                    "testObject": inputStringTestObject || "",
                    "reportPath": reportDployPlace,
                    "baseURL": inputStringBaseURL,
                    "isFailureScreenshot": inputCaptureFailureScreenshot,
                    "isConditionFailureScreenshot": inputCaptureConditionFailureScreenshot,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(function (response) {
                    if (response) {
                        return true;
                    } else {
                        return false;
                    }
                }).catch(function (error) {
                    if (error) throw new Error(" [Parameter for Script]" + " is Invalid !!! \n Please Provide Valid Parameters");
                });
            }


            async function runScript() {

                let urlPlay = inputStringServerURL + "play?token=" + token;
                return axios.put(urlPlay, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(function (response) {
                    if (response) {
                        return true;
                    } else {
                        return false;
                    }
                }).catch(function (error) {
                    if (error) throw new Error("Error in script Execution !!!");
                });
            }


            async function progress_response() {

                let urlProgressResponse = inputStringServerURL + "progress?token=" + token;
                return axios.put(urlProgressResponse, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(function (response) {
                    if (response) {
                        progressResponse = response.data;
                        return progressResponse;
                    } else {
                        return 'false';
                    }
                }).catch(function (error) {
                    // if(error) throw new Error("");
                });
            }


            async function report_interim() {

                let urlReport_interim = inputStringServerURL + "report_interim?token=" + token;
                return axios.put(urlReport_interim, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(function (response) {
                    if (response) {
                        reportInterimResponse = response.data;
                        return reportInterimResponse;
                    } else {
                        return false;
                    }
                }).catch(function () {
                    // if(error) throw new Error("");
                });
            }


            async function screenshot() {

                let urlReport_interim = inputStringServerURL + "screenshot?token=" + token;
                return axios.put(urlReport_interim, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(function (response) {
                    if (response) {
                        screenshotResponse = response.data;
                        return screenshotResponse;
                    } else {
                        return false;
                    }
                }).catch(function () {
                    // if(error) throw new Error("");
                });
            }
        }

        const convertReportToZIP = async () => {
            if (inputMailReport === 'true') {
                if (input_targetType.toUpperCase() == 'FILEPATH') {
                    task.setVariable('reportDeployPath', reportDployPlace + '.zip');
                    zipdir(reportDployPlace, { saveTo: reportDployPlace + '.zip' }, function (err: any, buffer: any) {
                        // do something
                    });
                } else if (input_targetType.toUpperCase() == 'FOLDERPATH') {
                    const folderPath: string = reportDploy + "\\" + reportFolderExtraPath
                    task.setVariable('reportDeployPath', folderPath + '.zip');
                    zipdir(folderPath, { saveTo: folderPath + '.zip' }, function (err: any, buffer: any) {
                        // do something
                    });
                }
            }
        }

        //*********************** twizx file execution function end ***********************//

        if (!(inputPassFailPer <= 100 && inputPassFailPer >= 0)) {
            console.log("\n");
            throw new Error(inputPassFailPer + "is Inavlid Pass/Fail Percentage value. Please Provide valid value between [1 - 100]. ");

        } else if (!(inputStringReportInterval > '0')) {
            console.log("\n");
            throw new Error(inputStringReportInterval + ' is Inavlid value for Report interval. Please Provide valid value greater than 1000 ms.');

        } else if (input_targetType.toUpperCase() == 'FILEPATH') {

            inputScriptPath = inputScriptFilePath;
            if (!task.stats(inputScriptPath).isFile() || !inputScriptPath.toUpperCase().match(/\.TWIZX$/)) {
                console.log("\n");
                throw new Error(inputScriptPath + " is Invalid File [ Only TWIZX/twizx file is accepted ] ");
            } else {
                console.log("\n\n\n Task Configuration ");
                await deployReportTemplate(false);
                await singleFileExecutionThread();
                await convertReportToZIP();
                await resultCalc();
            }
        }
        else if (input_targetType.toUpperCase() == 'FOLDERPATH') {
            inputFolderPath = inputScriptFolderPath;
            const today = new Date();
            let dd: any = today.getDate();
            let mm: any = today.getMonth() + 1;
            let yyyy = today.getFullYear();
            let ss: any = today.getSeconds();
            let min: any = today.getMinutes();
            let hh: any = today.getHours();
            dd = dd < 10 ? '0' + dd : dd;
            mm = mm < 10 ? '0' + mm : mm;
            hh = hh > 12 ? hh - 12 : hh;
            hh = hh < 10 ? '0' + hh : hh;
            min = min < 10 ? '0' + min : min;
            ss = ss < 10 ? '0' + ss : ss;
            const timeStamp = dd + '' + mm + '' + yyyy + '' + "_" + hh + '' + min + '' + ss + '';
            let files = dir.files(inputFolderPath, { sync: true });
            const dirSize = files.length;
            await dirSize, files;

            for (let i = 0; i < dirSize; i++) {
                if (task.stats(files[i]).isFile() && files[i].toUpperCase().match(/\.TWIZX$/)) {
                    inputScriptPath = await files[i];
                    console.log("\n\n\n Task Configuration\n");
                    await deployReportTemplate(timeStamp);
                    await singleFileExecutionThread();
                } else {
                    console.log(" Inavaid files are : ", files[i]);
                }
            }
            await convertReportToZIP();
            await resultCalc();
        }
    }

    catch (error) {
        task.setResult(task.TaskResult.Failed, error);
    }
}

run();