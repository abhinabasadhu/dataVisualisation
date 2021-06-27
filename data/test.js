let AWS = require("aws-sdk");
let docClient

function setupDocClient() {
    AWS.config.update({
        region: "us-east-1"
    });

    docClient = new AWS.DynamoDB.DocumentClient();
}
async function scanData() {
    let BTC2 = [];
    let result2;
    let BTC1 = [];
    let result1;
    var params1 = {
        TableName: "prediction-BTC",
    }
    result1 = await docClient.scan(params1).promise();
    result1.Items.forEach((item) => BTC1.push(item.mean))
    console.log(BTC1)
    var params2 = {
        TableName: "sentimentbtcData"
    }
    result2 = await docClient.scan(params2).promise();
    result2.Items.forEach((item) => BTC2.push(item.Sentiment));
    console.log(BTC2);
    let data = {
        BTC1: BTC1,
        BTC2: BTC2
    }
    console.log(data)
    return data;
}




setupDocClient()
scanData()

//console.log(data);