var AWS = require ("aws-sdk");

let docClient

function setupDocClient(){
AWS.config.update({
  region: "us-east-1"
  });

docClient = new AWS.DynamoDB.DocumentClient();
}

// tweet saving functions with respect to different tables

async function saveBTCtweet(tweetId: string, tweetText: string,): Promise<string> {
    try{  //Table name and data for table
      let params = {
          TableName: "btcTweet",
          Item: {
              id: tweetId,
              text: tweetText
          }
      }
   
      const data = await docClient.put(params).promise();
      return data;
    }catch(err){
      console.log(err);
    }
    };
    async function saveETHtweet(tweetId: string, tweetText: string ): Promise<string> {
      try{  //Table name and data for table
        let params = {
            TableName: "ethTweet",
            Item: {
                id: tweetId,
                text: tweetText
            }
        }
        const data = await docClient.put(params).promise();
        return data;
      }catch(err){
        console.log(err);
      }
      };
      async function saveTRXtweet(tweetId: string, tweetText: string,): Promise<string> {
        try{  //Table name and data for table
          let params = {
              TableName: "trxTweet",
              Item: {
                  id: tweetId,
                  text: tweetText
              }
          }
         
          const data = await docClient.put(params).promise();
          return data;
        }catch(err){
          console.log(err);
        }
        };
        async function saveUSDTtweet(tweetId: string, tweetText: string,): Promise<string> {
          try{  //Table name and data for table
            let params = {
                TableName: "usdtTweet",
                Item: {
                    id: tweetId,
                    text: tweetText
                }
            }
            const data = await docClient.put(params).promise();
            return data;
          }catch(err){
            console.log(err);
          }
          };
          async function saveBNBtweet(tweetId: string, tweetText: string): Promise<string> {
            try{  //Table name and data for table
              let params = {
                  TableName: "bnbTweet",
                  Item: {
                      id: tweetId,
                      text: tweetText
                  }
              }
           
              const data = await docClient.put(params).promise();
              return data;
            }catch(err){
              console.log(err);
            }
            };
export{saveBNBtweet,saveUSDTtweet,saveTRXtweet,saveETHtweet,saveBTCtweet,setupDocClient, saveBNBData,saveUSDTData,saveTRXData,saveBTCData,saveETHData}


// cryptosaving functions with restpect to different currency

async function saveBTCData(data : Array<{type: string,rate:number,timestamp: number}>){
  for(const item of data){
    const date = new Date(item.timestamp)
    const key = `${date.getDate()}-${date.getMonth()}-${date.getUTCFullYear()}`
    try{
      let params={
          TableName: "btcExchangeRate",
          Item: {
              rate: item.rate,
              time: key,
          }
      };
      console.log(item)
      const data = await docClient.put(params).promise();
      await sleep(800)
    }catch(err){
      console.log(err);
    }
  }
}
async function saveETHData(data : Array<{type: string,rate:number,timestamp:number }>){
  for(const item of data){
    const date = new Date(item.timestamp)
    const key = `${date.getDate()}-${date.getMonth()}-${date.getUTCFullYear()}`
   console.log(key);
    try{
      let params={
          TableName: "ethExchangeRate",
          Item: {
            time: key,
              rate: item.rate,
              
          }
      };
      console.log(item)
      const data = await docClient.put(params).promise();
      await sleep(800)
    }catch(err){
      console.log(err);
    }
  }
}
async function saveUSDTData(data : Array<{type: string,rate:number,timestamp: number}>){
  for(const item of data){
    const date = new Date(item.timestamp)
    const key = `${date.getDate()}-${date.getMonth()}-${date.getUTCFullYear()}`
    try{
      let params={
          TableName: "usdtExchangeRate",
          Item: {
              rate: item.rate,
              time: key,
          }
      };
      console.log(item)
      const data = await docClient.put(params).promise();
      await sleep(800)
    }catch(err){
      console.log(err);
    }
  }
}
async function saveTRXData(data : Array<{type: string,rate:number,timestamp: number}>){
  for(const item of data){
    const date = new Date(item.timestamp)
    const key = `${date.getDate()}-${date.getMonth()}-${date.getUTCFullYear()}`
    try{
      let params={
          TableName: "trxExchangeRate",
          Item: {
              rate: item.rate,
              time: key,
          }
      };
      console.log(item)
      const data = await docClient.put(params).promise();
      await sleep(800)
    }catch(err){
      console.log(err);
    }
  }
}
async function saveBNBData(data : Array<{type: string,rate:number,timestamp: number}>){
  for(const item of data){
    const date = new Date(item.timestamp)
    const key = `${date.getDate()}-${date.getMonth()}-${date.getUTCFullYear()}`
    try{
      let params={
          TableName: "bnbExchangeRate",
          Item: {
              rate: item.rate,
              time: key,
          }
      };
      console.log(item)
      const data = await docClient.put(params).promise();
      await sleep(800)
    }catch(err){
      console.log(err);
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

   
