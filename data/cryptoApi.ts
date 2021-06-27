require("dotenv").config()
import axios from "axios";

const {setupDocClient, saveBNBData,saveUSDTData,saveTRXData,saveBTCData,saveETHData} = require('./dataBaseUpload.ts')

function setupDatabase(){
    setupDocClient()
  }

let url = "https://api.nomics.com/v1/exchange-rates/history";

let bitcoinUrl = url + "?" + "key=" + process.env.API + "&currency=BTC" + "&start=2018-01-01T00:00:00Z";
let etherumUrl =  url + "?" + "key=" + process.env.API + "&currency=ETH" + "&start=2018-06-01T00:00:00Z";
let tronUrl =  url +"?" + "key=" + process.env.API + "&currency=TRX" + "&start=2018-06-01T00:00:00Z";
let tetherUrl = url + "?" + "key=" + process.env.API + "&currency=USDT" + "&start=2018-06-01T00:00:00Z";
let binanaceUrl = url + "?" + "key=" + process.env.API + "&currency=BNB" + "&start=2018-06-01T00:00:00Z" ;

interface currencyData {
    timestamp: Date
    rate: string
    type: "eth" | "btc" | "trx" | "usdt" | "bnb"
}
let btcArray : currencyData[] = [];
let ethArray : currencyData[] = [];
let usdtArray : currencyData[] = [];
let trxArray : currencyData[] = [];
let bnbArray : currencyData[] = [];


function sleep(ms){
    return new Promise(resolve=>setTimeout(resolve,ms));
}

async function callBTCApi() {
  await axios.get(bitcoinUrl)
 .then((response)=>{
 for(let value of response.data){
    btcArray.push({
    timestamp: value.timestamp,
    rate: value.rate,
    type: "btc"
    })
}
})
.catch((error)=>{
    console.log(error);
})
};
async function callETHApi(){
    await axios.get(etherumUrl)
    .then((response)=>{
        for(let value of response.data){
            ethArray.push({
                timestamp: value.timestamp ,
                rate: value.rate,
                type: "eth"
                })
        }
    })
    .catch((error)=>{
        console.log(error);
    })
}

async function callTRXApi(){
    await axios.get(tronUrl)
    .then((response)=>{
        for(let value of response.data){
            trxArray.push({
                timestamp:value.timestamp,
                rate: value.rate,
                type: "trx"
            })
        }
    })
    .catch((error)=>{
console.log(error);
    })
}

async function callUSDTApi(){
    await axios.get(tetherUrl)
    .then((response)=>{
        for(let value of response.data){
            usdtArray.push({
                timestamp:value.timestamp,
                rate: value.rate,
                type: "usdt"
            })
        }
    })
    .catch((error)=>{
        console.log(error);
    })
}

async function callBNBApi(){
    await axios.get(binanaceUrl)
    .then((response)=>{
        for(let value of response.data){
            bnbArray.push({
                timestamp : value.timestamp,
                rate: value.rate,
                type: "bnb"
            })
        }
    })
    .catch((error)=>{
        console.log(error);
    })
}
async function delay(){
  callBTCApi();
   await sleep(2000);
 callETHApi();
    await sleep(2000);
    callTRXApi();
    await sleep(2000);
  callUSDTApi();
    await sleep(2000);
    callBNBApi();
}


async function runCode(){
    await delay()
    await setupDocClient()
   console.log(btcArray.length);
   console.log(ethArray.length);
   console.log(usdtArray.length);
   console.log(bnbArray.length);
   console.log(trxArray.length);
    await saveBTCData(btcArray);
    await saveETHData(ethArray);
    await saveUSDTData(usdtArray);
    await saveBNBData(bnbArray);
    await saveTRXData(trxArray);

    // await Promise.all(resultArray.map(result => bulkSaveCryptoData(result.type,result.rate, result.timestamp)))
    console.log("Saved data")
}

// savecryptoData(resultArray);
// we cant use await as directly on the file 

runCode()