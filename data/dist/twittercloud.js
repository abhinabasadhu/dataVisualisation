var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//Module that reads keys from .env file
//Copy variables in file into environment variables
require("dotenv").config();
//Node Twitter library
const Twitter = require("twitter");
//Database module
const { saveData, setupDocClient } = require('./dataBaseUpload.ts');
//Set up the Twitter client with the credentials
let client = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    bearer_token: process.env.BEARER_TOKEN,
});
// Setup database client 
function setupDatabase() {
    setupDocClient();
}
//Function downloads and outputs tweet text
function storeTweets() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //Set up parameters for the search
            let bitParamas = {
                q: "#btc",
                count: 10,
                lang: "en",
            };
            let tronParams = {
                q: "#trx",
                count: 10,
                lang: "en",
            };
            let tetherParams = {
                q: "#usdt",
                count: 10,
                lang: "en",
            };
            let ethereumParams = {
                q: "#eth",
                count: 10,
                lang: "en",
            };
            let binanceParams = {
                q: "#bnb",
                count: 10,
                lang: "en",
            };
            //Wait for search to execute asynchronously
            let bitResults = yield client.get("search/tweets", bitParamas);
            let tethResults = yield client.get("search/tweets", tetherParams);
            let ethResults = yield client.get("search/tweets", ethereumParams);
            let binResults = yield client.get("search/tweets", binanceParams);
            let tronResults = yield client.get("search/tweets", tronParams);
            //Output the result
            let promiseArray = [];
            // its creating uncessary variables 
            // instad creating it multiples we create it once and use it  
            let stringifyData = (data) => {
                let dataStr = JSON.stringify(data, (key, value) => {
                    if (typeof value === "bigint")
                        return value.toString();
                    else
                        return value; // return everything else unchanged
                });
                return dataStr;
            };
            promiseArray = bitResults.statuses.map((tweet) => {
                //Store save data promise in array
                return saveData(stringifyData(tweet.id), tweet.text, tweet.created_at, "btc");
            });
            promiseArray = tethResults.statuses.map((tweet) => {
                return saveData(stringifyData(tweet.id), tweet.text, tweet.created_at, "usdt");
            });
            promiseArray = ethResults.statuses.map((tweet) => {
                return saveData(stringifyData(tweet.id), tweet.text, tweet.created_at, "eth");
            });
            promiseArray = binResults.statuses.map((tweet) => {
                return saveData(stringifyData(tweet.id), tweet.text, tweet.created_at, "bnb");
            });
            promiseArray = tronResults.statuses.map((tweet) => {
                return saveData(stringifyData(tweet.id), tweet.text, tweet.created_at, "trx");
            });
            let databaseResult = yield Promise.all(promiseArray);
            console.log("Database result: " + JSON.stringify(databaseResult));
        }
        catch (error) {
            console.log(JSON.stringify(error));
        }
    });
}
//Call function to search for tweets with specified subject
// Bitcoin BTC
// Binance Coin BNB
// Ethereum ETH
// Tether USDT
// Tron TRX
setupDatabase();
storeTweets();
