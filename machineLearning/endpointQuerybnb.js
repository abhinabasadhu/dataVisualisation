//Import AWS
let AWS = require("aws-sdk");

let docClient = new AWS.DynamoDB.DocumentClient();

//Data that we are going to send to endpoint
let endpointData = {
    "instances": [{
        "start": "2021-01-01",
        "target": [41.15083801516573, 41.811127236661605, 42.225590416220314, 43.83663888462067, 42.43869164749536, 43.77274330497753, 42.465150082188416, 38.63471507329471, 38.28180229673063, 40.27256680990043, 41.87139271117079, 40.942882646362015, 43.16261207252392, 45.93577077217246, 45.38967557822531, 42.68624732405787, 42.686182047642, 38.69999230408248, 40.987362114667235, 41.02170610038281, 41.90380804400105, 41.91604133390757, 41.413761007011004, 41.18738333553718, 42.714899007575504, 42.96521118964706, 44.839817797301954, 44.41516336732151, 51.55663730236599, 51.12577332573029, 52.31658700187159, 56.28049351005794, 67.6908739627365, 72.98334096707356, 68.63915964853534, 79.89520856893743, 107.58560056403769, 129.21571103359298, 124.21742645727154, 137.06469131699845, 133.64804026489182, 136.28858835412794, 130.0623192471935, 130.6807404315536, 166.02527564851158, 195.60509970184634, 334.31493571988483, 255.17783216057754, 296.15599865529305, 268.63512054004167, 232.9075421133215, 255.81121291151516, 237.39596606727667, 224.56161911524927, 227.86774926353752, 211.32519648552687, 256.20296651259525, 241.16621381101626, 242.5680309743949, 232.13427381593405, 227.80375999081474, 227.71204577879686, 240.73369002407185, 239.81926642764682, 292.65320333821495, 278.77447899152304, 289.99162297133887, 265.5841105037574, 275.5072660627631, 264.4658333141696, 256.6238715360765, 259.9722091431668, 269.80250401819757, 263.68485027450316, 264.6288132873561, 266.3702047812636, 267.0525168964121, 257.70415870792925, 258.91458743141635, 253.20899218049632, 237.59943173004152, 257.4121042172432, 270.4051788605577, 270.0511068501304, 275.5268740479275, 311.78159409049096, 302.33064292071776, 334.8215756598245, 338.7516228730545, 323.37038519214684, 350.29386511500536, 367.5384389551934, 404.31035256872343, 377.5379034932417, 419.3453221725243, 455.88435106088184, 472.65305224233515, 527.2306192426189, 597.0554428465009, 561.121989162362]
    }],
    "configuration": {
        "num_samples": 50,
        "output_types": ["mean", "quantiles", "samples"],
        "quantiles": ["0.1", "0.9"]
    }
};

// name of endpoint
const endpointName = "bnbrates";


//saving data to dynamo
async function saveData(mean) {
    var date = new Date("2021-01-01");
    var predictedTime = date.toLocaleDateString(date.setDate(date.getDate() + 100))
    try {
        let params2 = {
            TableName: "prediction-BNB",
            Item: { time: predictedTime, mean }
        }
        await docClient.put(params2).promise();
    } catch (err) {
        console.log(err);
    }
}
// stringify values 
let stringifyData = (data) => {
    let dataStr = JSON.stringify(data, (key, value) => {
        if (typeof value === "bigint") return value.toString();
        else return value; // return everything else unchanged
    });
    return dataStr;
};

// Parameters for calling endpoint
let params = {
    EndpointName: endpointName,
    Body: JSON.stringify(endpointData),
    ContentType: "application/json",
    Accept: "application/json"
};

//AWS class that will query endpoint
let awsRuntime = new AWS.SageMakerRuntime({});

//Handler for Lambda function
exports.handler = event => {
    //Call endpoint and handle response
    awsRuntime.invokeEndpoint(params, async(err, data) => {
        if (err) { //An error occurred
            console.log(err, err.stack);

            //Return error response
            const response = {
                statusCode: 500,
                body: JSON.stringify('ERROR: ' + JSON.stringify(err)),
            };
            return response;
        } else {
            //Successful response
            //Convert response data to JSON
            let responseData = JSON.parse(Buffer.from(data.Body).toString('utf8'));
            console.log(JSON.stringify(responseData));

            //  STORE DATA IN PREDICTION TABLE
            responseData.predictions.map(item => {
                    return saveData(stringifyData(item.mean))
                })
                //Return successful response
            const response = {
                statusCode: 200,
                body: JSON.stringify('Predictions stored.'),
            };
            return response;
        }
    });
};