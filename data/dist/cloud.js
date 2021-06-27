var AWS = require("aws-sdk");
let awsConfig = {
    region: "eu-west-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com",
};
AWS.config.update(awsConfig);
let docClient = new AWS.DynamoDB.DocumentClient();
const upload = () => {
    const find = (url = "https://api.nomics.com/v1/exchange-rates?key=69e8c37edac818d2c3baccbd9b4bf003") => {
        return require('axios').get(url);
    };
    const printCurreny = ({ data }) => {
        let date = new Date();
        let startTimestamp = date.getTime();
        for (let value of data) {
            const currency = value.currency;
            const rates = value.rate;
            const timeStamp = value.timestamp;
            var input = {
                currency: currency,
                rates: rates,
                time: timeStamp
            };
            var params = {
                TableName: "exchange",
                Item: input
            };
            docClient.put(params, (err, data) => {
                if (err) {
                    console.log("rates::save::error" + JSON.stringify(err, null, 2));
                }
                else {
                    console.log("rates::save::success" + JSON.stringify(data, null, 2));
                }
            });
        }
        return Promise.resolve(data.next);
    };
    find()
        .then(printCurreny)
        .catch((err) => {
        console.log("Error", err);
    });
};
upload();
