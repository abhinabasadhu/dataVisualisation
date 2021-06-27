"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveETHData = exports.saveBTCData = exports.saveTRXData = exports.saveUSDTData = exports.saveBNBData = exports.setupDocClient = exports.saveData = void 0;
var AWS = require("aws-sdk");
let docClient;
function setupDocClient() {
    AWS.config.update({
        region: "us-east-1"
    });
    docClient = new AWS.DynamoDB.DocumentClient();
}
exports.setupDocClient = setupDocClient;
function saveData(tweetId, tweetText, tweetTime, currency) {
    return __awaiter(this, void 0, void 0, function* () {
        try { //Table name and data for table
            let params = {
                TableName: "tweets",
                Item: {
                    id: tweetId,
                    text: tweetText,
                    time: tweetTime,
                    currency,
                }
            };
            console.log(`Currency ${currency}`);
            const data = yield docClient.put(params).promise();
            return data;
        }
        catch (err) {
            console.log(err);
        }
    });
}
exports.saveData = saveData;
;
function saveBTCData(data) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const item of data) {
            const date = new Date(item.timestamp);
            const key = `${item.type}.${date.getDate()}-${date.getMonth()}-${date.getUTCFullYear()}`;
            try {
                let params = {
                    TableName: "btcExchangeRate",
                    Item: {
                        rate: item.rate,
                        time: key,
                    }
                };
                console.log(item);
                const data = yield docClient.put(params).promise();
                yield sleep(1100);
            }
            catch (err) {
                console.log(err);
            }
        }
    });
}
exports.saveBTCData = saveBTCData;
function saveETHData(data) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const item of data) {
            const date = new Date(item.timestamp);
            const key = `${item.type}.${date.getDate()}-${date.getMonth()}-${date.getUTCFullYear()}`;
            try {
                let params = {
                    TableName: "ethExhangeRate",
                    Item: { time: key,
                        rate: item.rate,
                    }
                };
                console.log(item);
                const data = yield docClient.put(params).promise();
                yield sleep(1100);
            }
            catch (err) {
                console.log(err);
            }
        }
    });
}
exports.saveETHData = saveETHData;
function saveUSDTData(data) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const item of data) {
            const date = new Date(item.timestamp);
            const key = `${item.type}.${date.getDate()}-${date.getMonth()}-${date.getUTCFullYear()}`;
            try {
                let params = {
                    TableName: "ethExhangeRate",
                    Item: {
                        rate: item.rate,
                        time: key,
                    }
                };
                console.log(item);
                const data = yield docClient.put(params).promise();
                yield sleep(1100);
            }
            catch (err) {
                console.log(err);
            }
        }
    });
}
exports.saveUSDTData = saveUSDTData;
function saveTRXData(data) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const item of data) {
            const date = new Date(item.timestamp);
            const key = `${item.type}.${date.getDate()}-${date.getMonth()}-${date.getUTCFullYear()}`;
            try {
                let params = {
                    TableName: "trxExchangeRate",
                    Item: {
                        rate: item.rate,
                        time: key,
                    }
                };
                console.log(item);
                const data = yield docClient.put(params).promise();
                yield sleep(1100);
            }
            catch (err) {
                console.log(err);
            }
        }
    });
}
exports.saveTRXData = saveTRXData;
function saveBNBData(data) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const item of data) {
            const date = new Date(item.timestamp);
            const key = `${item.type}.${date.getDate()}-${date.getMonth()}-${date.getUTCFullYear()}`;
            try {
                let params = {
                    TableName: "bnbExchangeRate",
                    Item: {
                        rate: item.rate,
                        time: key,
                    }
                };
                console.log(item);
                const data = yield docClient.put(params).promise();
                yield sleep(1100);
            }
            catch (err) {
                console.log(err);
            }
        }
    });
}
exports.saveBNBData = saveBNBData;
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// async function savecryptoData(currency: string,rate:number,timestamp: number): Promise<string>{
//   try{
// let params={
//     TableName: "cryptoData",
//     Item: {
//         currency: currency,
//         rate: rate,
//         timestamp: timestamp,
//     }
// };
//       const data = await docClient.put(params).promise();
//       return data;
//     }catch(err){
//       console.log(err);
//     }
// };
