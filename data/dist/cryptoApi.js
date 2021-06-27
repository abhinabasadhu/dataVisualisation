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
require("dotenv").config();
const axios_1 = require("axios");
const { setupDocClient, saveBNBData, saveUSDTData, saveTRXData, saveBTCData, saveETHData } = require('./dataBaseUpload.ts');
function setupDatabase() {
    setupDocClient();
}
let url = "https://api.nomics.com/v1/exchange-rates/history";
let bitcoinUrl = url + "?" + "key=" + process.env.API + "&currency=BTC" + "&start=2018-01-01T00:00:00Z";
let etherumUrl = url + "?" + "key=" + process.env.API + "&currency=ETH" + "&start=2018-06-01T00:00:00Z";
let tronUrl = url + "?" + "key=" + process.env.API + "&currency=TRX" + "&start=2018-06-01T00:00:00Z";
let tetherUrl = url + "?" + "key=" + process.env.API + "&currency=USDT" + "&start=2018-06-01T00:00:00Z";
let binanaceUrl = url + "?" + "key=" + process.env.API + "&currency=BNB" + "&start=2018-06-01T00:00:00Z";
let btcArray = [];
let ethArray = [];
let usdtArray = [];
let trxArray = [];
let bnbArray = [];
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function callBTCApi() {
    return __awaiter(this, void 0, void 0, function* () {
        yield axios_1.default.get(bitcoinUrl)
            .then((response) => {
            for (let value of response.data) {
                btcArray.push({
                    timestamp: value.timestamp,
                    rate: value.rate,
                    type: "btc"
                });
            }
        })
            .catch((error) => {
            console.log(error);
        });
    });
}
;
function callETHApi() {
    return __awaiter(this, void 0, void 0, function* () {
        yield axios_1.default.get(etherumUrl)
            .then((response) => {
            for (let value of response.data) {
                ethArray.push({
                    timestamp: value.timestamp,
                    rate: value.rate,
                    type: "eth"
                });
            }
        })
            .catch((error) => {
            console.log(error);
        });
    });
}
function callTRXApi() {
    return __awaiter(this, void 0, void 0, function* () {
        yield axios_1.default.get(tronUrl)
            .then((response) => {
            for (let value of response.data) {
                trxArray.push({
                    timestamp: value.timestamp,
                    rate: value.rate,
                    type: "trx"
                });
            }
        })
            .catch((error) => {
            console.log(error);
        });
    });
}
function callUSDTApi() {
    return __awaiter(this, void 0, void 0, function* () {
        yield axios_1.default.get(tetherUrl)
            .then((response) => {
            for (let value of response.data) {
                usdtArray.push({
                    timestamp: value.timestamp,
                    rate: value.rate,
                    type: "usdt"
                });
            }
        })
            .catch((error) => {
            console.log(error);
        });
    });
}
function callBNBApi() {
    return __awaiter(this, void 0, void 0, function* () {
        yield axios_1.default.get(binanaceUrl)
            .then((response) => {
            for (let value of response.data) {
                bnbArray.push({
                    timestamp: value.timestamp,
                    rate: value.rate,
                    type: "bnb"
                });
            }
        })
            .catch((error) => {
            console.log(error);
        });
    });
}
function delay() {
    return __awaiter(this, void 0, void 0, function* () {
        //  callBTCApi();
        //   await sleep(2000);
        callETHApi();
        yield sleep(2000);
        callTRXApi();
        yield sleep(2000);
        callUSDTApi();
        yield sleep(2000);
        callBNBApi();
    });
}
function runCode() {
    return __awaiter(this, void 0, void 0, function* () {
        yield delay();
        yield setupDocClient();
        console.log(btcArray.length);
        console.log(ethArray.length);
        console.log(usdtArray.length);
        console.log(bnbArray.length);
        console.log(trxArray.length);
        yield saveBTCData(btcArray);
        yield saveETHData(ethArray);
        yield saveUSDTData(usdtArray);
        yield saveBNBData(bnbArray);
        yield saveTRXData(trxArray);
        // await Promise.all(resultArray.map(result => bulkSaveCryptoData(result.type,result.rate, result.timestamp)))
        console.log("Saved data");
    });
}
// savecryptoData(resultArray);
// we cant use await as directly on the file 
runCode();
