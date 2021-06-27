let AWS = require("aws-sdk");

//Create new DocumentClient
AWS.config.update({region : "us-east-1"});
let documentClient = new AWS.DynamoDB.DocumentClient();

//Returns all of the connection IDs
module.exports.getConnectionIds = async () => {
    let params = {
        TableName: "webSocketClient"
    };
    console.log("I am here dynamo")
    let result  = await documentClient.scan(params).promise();
    console.log(result);
    return result;
};

//Deletes the specified connection ID
module.exports.deleteConnectionId = async (connectionId) => {
    console.log("Deleting connection Id: " + connectionId);

    let params = {
        TableName: "webSocketClient",
        Key: {
            ConnectionId: connectionId
        }
    };
    return documentClient.delete(params).promise();
};

module.exports.getAllData = async()=> {
   let BTC2 = [];
    let result2;
    let BTC1 = [];
    let result1;
    var params1 = {
        TableName: "prediction-BTC",
    }
    result1 = await documentClient.scan(params1).promise();
    result1.Items.forEach((item) => BTC1.push(item.mean))
    console.log(BTC1)
    var params2 = {
        TableName: "sentimentbtcData"
    }
    result2 = await documentClient.scan(params2).promise();
    result2.Items.forEach((item) => BTC2.push(item.Sentiment));
    console.log(BTC2);
    
    // get etherum data 
   let etherumPredicted = [];
   let etherumSentiment = [];
   
   let resultethPredicted;
   let resultethSentiment;
   
   var paramsEth = {
       TableName : "prediction-ETH",
   }
   
   resultethPredicted =await documentClient.scan(paramsEth).promise();
   resultethPredicted.Items.forEach((item)=>etherumPredicted.push(item.mean))
       console.log("I am here dynamo 2")

   var parmasEthsentiment ={
       TableName : "sentimentethData"
   }
   
   resultethSentiment =await documentClient.scan(parmasEthsentiment).promise()
   resultethSentiment.Items.forEach((item)=> etherumSentiment.push(item.Sentiment))
       console.log("I am here dynamo 3")

   ///get BNB data 
   
   let bnbPredicted = [];
   let bnbSentiment = [];
   
   let resultbnbPredicted;
   let resultbnbSentiment;
   
  var paramsbnb = {
      TableName: "prediction-BNB"
  }
  resultbnbPredicted = await documentClient.scan(paramsbnb).promise();
  resultbnbPredicted.Items.forEach((item)=> bnbPredicted.push(item.mean))
      console.log("I am here dynamo 4")

  var paramsbnbSentiment = {
      TableName : "sentimentbnbData"
  }
  resultbnbSentiment = await documentClient.scan(paramsbnbSentiment).promise();
  resultbnbSentiment.Items.forEach((item)=> bnbSentiment.push(item.Sentiment))
      console.log("I am here dynamo 5")

  // get data trx 
  let trxsentiment = [];
  let trxprediction = [];
  
  let resulttrxprediction;
  let resulttrxsentiment;
  
  var paramstrxprediction = {
      TableName:"prediction-TRX"
  }
  resulttrxprediction = await documentClient.scan(paramstrxprediction).promise();
  resulttrxprediction.Items.forEach((item)=> trxprediction.push(item.mean))
      console.log("I am here dynamo 6")

  var paramstrxsentiment = {
      TableName : "sentimenttrxData"
  }
  
  resulttrxsentiment = await documentClient.scan(paramstrxsentiment).promise();
  resulttrxsentiment.Items.forEach((item)=> trxsentiment.push(item.Sentiment))
      console.log("I am here dynamo 7")

  // get data usdt 
  
  let usdtsentiment =[];
  let usdtprediction = [];
  
  let resultusdtsentiemnt;
  let resultusdtprediction;
  
  var paramsusdt = {
      TableName: "prediction-USDT"
  }
  resultusdtprediction = await documentClient.scan(paramsusdt).promise();
  resultusdtprediction.Items.forEach((item)=> usdtprediction.push(item.mean))
      console.log("I am here dynamo 8")

  var paramasusdtsentiment = {
      TableName:"sentimentusdtData"
  }
  
resultusdtsentiemnt = await documentClient.scan(paramasusdtsentiment).promise();
resultusdtsentiemnt.Items.forEach((item)=> usdtsentiment.push(item.Sentiment))
    console.log("I am here dynamo 9")

// get synthetic data prediction
let syntheticData = []
let resultSynthetic;

var paramsSyn = {
    TableName: "prediction-syntheicData"
}
resultSynthetic = await documentClient.scan(paramsSyn).promise();
resultSynthetic.Items.forEach((item)=> syntheticData.push(item.mean))
    console.log("I am here dynamo 10")
//get synthetic data
let actualSyntheticData =[]
let resultActualSyntheticData;

var paramsActSyn = {
    TableName: "syntheticData"
}
resultActualSyntheticData = await documentClient.scan(paramsActSyn).promise();
resultActualSyntheticData.Items.forEach((item)=>actualSyntheticData.push(item.target))




    let data = {
        BTC:{
        BTCPredicted: BTC1,
        BTCSentiment: BTC2,
        },
        ETH:{
        ETHPredicted :etherumPredicted ,
        ETHSentiment :etherumSentiment ,
        },
        BNB:{
            BNBPredicted: bnbPredicted,
            BNBSentiment: bnbSentiment,
        },
        TRX:{
            TRXPredicted: trxprediction,
            TRxSentiment: trxsentiment,
        },
        USDT:{
            USDTPRedicted: usdtprediction,
            USDTSentiment: usdtsentiment,
        },
        Synthetic: syntheticData,
        
        ActualSyntheticData : actualSyntheticData,
        
    }
    console.log(data)
    return data;
}