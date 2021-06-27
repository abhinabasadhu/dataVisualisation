

//Copy variables in file into environment variables
require("dotenv").config();

//Node Twitter library
const Twitter = require("twitter");

//Database module
const {saveBNBtweet,saveUSDTtweet,saveTRXtweet,saveETHtweet,saveBTCtweet, setupDocClient} = require('./dataBaseUpload.ts');

//Set up the Twitter client with the credentials
let client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  bearer_token: process.env.BEARER_TOKEN,
});

// Setup database client 
function setupDatabase(){
setupDocClient();
}

interface currencyTweet {
  currency : "btc" | "eth" | "bnb" | "usdt" | "trx",
  timestamp : Date,
  id : string,
  text : string
}
//Function downloads and outputs tweet text
async function storeTweets() {
  
  try {
    //Set up parameters for the search

    let bitParamas = {
      q: "#btc",
      count: 100,
      lang: "en",
    };

    let tronParams= {
      q: "#trx",
      count: 1000,
      lang: "en",
    };
    let tetherParams= {
      q: "#usdt",
      count: 1000,
      lang: "en",
    };
    let ethereumParams= {
      q: "#eth",
      count: 1000,
      lang: "en",
    };
    let binanceParams= {
      q: "#bnb",
      count: 1000,
      lang: "en",
    };

    //Wait for search to execute asynchronously
    let bitResults = await client.get("search/tweets", bitParamas);
    let tethResults =await client.get("search/tweets", tetherParams);
    let ethResults = await client.get("search/tweets", ethereumParams);
    let binResults =await client.get("search/tweets", binanceParams);
    let tronResults = await client.get("search/tweets", tronParams);
    //Output the result
    let btcTweet: currencyTweet[] = [];
    let ethTweet: currencyTweet[] = [];
    let usdtTweet: currencyTweet[] = [];
    let trxTweet: currencyTweet[] = [];
    let bnbTweet: currencyTweet[] = [];


    // its creating uncessary variables 
    // instead creating it multiples we create it once and use it  
    let stringifyData = (data) => {
      let dataStr = JSON.stringify(data, (key, value) => {
        if (typeof value === "bigint") return value.toString();
        else return value; // return everything else unchanged
      });
      return dataStr;
    };

     btcTweet = bitResults.statuses.map((tweet) => {
      console.log(btcTweet.length);
    //Store save data promise in array
    return saveBTCtweet(stringifyData(tweet.id),tweet.text, tweet.created_at,"btc");
    });
     usdtTweet = tethResults.statuses.map((tweet)=>{
      return saveUSDTtweet(stringifyData(tweet.id),tweet.text,tweet.created_at,"usdt");
    });
   ethTweet = ethResults.statuses.map((tweet)=>{
       return saveETHtweet(stringifyData(tweet.id),tweet.text,tweet.created_at,"eth");
     });
    bnbTweet = binResults.statuses.map((tweet)=>{
     return saveBNBtweet(stringifyData(tweet.id),tweet.text,tweet.created_at,"bnb");
     });
     trxTweet = tronResults.statuses.map((tweet)=>{
      return saveTRXtweet(stringifyData(tweet.id),tweet.text,tweet.created_at,"trx");
     });

    let databaseResult = await Promise.all([btcTweet,usdtTweet,ethTweet,bnbTweet,trxTweet]);
   console.log("Database result: " + JSON.stringify(databaseResult));
  } catch (error) {
    console.log(JSON.stringify(error));
  }
}

//Call function to search for tweets with specified subject
// Bitcoin BTC
// Binance Coin BNB
// Ethereum ETH
// Tether USDT
// Tron TRX
setupDatabase()
storeTweets();

