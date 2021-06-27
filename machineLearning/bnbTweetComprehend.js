let AWS = require("aws-sdk");

let docClient = new AWS.DynamoDB.DocumentClient();

let comprehend = new AWS.Comprehend();

exports.handler = async(event) => {
    for (let record of event.Records) {
        if (record.eventName === "INSERT")
            try {
                let id = record.dynamodb.NewImage.id.S;
                let text = record.dynamodb.NewImage.text.S;

                console.log(`id = ${id} ; text = ${text}`);

                let params = { Text: text, LanguageCode: "en" };

                let result = await comprehend.detectSentiment(params).promise();

                console.log(`sentiment = ${result.Sentiment}`);

                let param2 = {
                    TableName: "sentimentbnbData",
                    Item: {
                        id,
                        Sentiment: result.Sentiment
                    }
                }

                let data = await docClient.put(param2).promise();

                return data;

            } catch (err) {
                console.log(err);
            }
    }
}