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
const { saveData } = require('./dataBaseUpload');
//Set up the Twitter client with the credentials
//Function downloads and outputs tweet text
function storeTweets(keyword) {
    return __awaiter(this, void 0, void 0, function* () {
        let client = new Twitter({
            consumer_key: process.env.CONSUMER_KEY,
            consumer_secret: process.env.CONSUMER_SECRET,
            access_token_key: process.env.ACCESS_TOKEN_KEY,
            access_token_secret: process.env.ACCESS_TOKEN_SECRET,
            bearer_token: process.env.BEARER_TOKEN,
        });
        try {
            //Set up parameters for the search
            let searchParams = {
                q: keyword,
                count: 10,
                lang: "en",
            };
            //Wait for search to execute asynchronously
            let results = yield client.get("search/tweets", searchParams);
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
            promiseArray = results.statuses.map((tweet) => {
                // console.log(
                //   "Tweet id: " +
                //     tweet.id +
                //     ". Tweet text: " +
                //     tweet.text +
                //     ". Tweet Time: " +
                //     tweet.created_at
                // );
                //Store save data promise in array
                return saveData(stringifyData(tweet.id), tweet.text, tweet.created_at);
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
storeTweets("#bitcoin since:2021-01-01");
storeTweets("#tron since:2021-01-01-01");
storeTweets("#ethereum since:2021-01-01");
storeTweets("#tether since:2021-01-01");
storeTweets("#binance since:2021-01-01");
//# sourceMappingURL=twittercloud.js.map