//Import AWS
let AWS = require("aws-sdk");

let docClient = new AWS.DynamoDB.DocumentClient();

//Data that we are going to send to endpoint
let endpointData = {
    "instances": [{
        "start": "2021-01-01",
        "target": [29356.582981023003, 32114.952545188924, 32822.50828148216, 32013.795962470842, 33947.03813979604, 36815.59054421876, 39523.784223747054, 40634.26757372354, 40159.288052282885, 38173.930778495596, 35465.91093793353, 34020.23738529898, 37395.10413191071, 39141.754206791986, 36825.45253203586, 36032.32234877908, 35834.885235698806, 36622.50795032677, 35919.01963017266, 35507.934321137385, 30827.535866139082, 33021.254407048924, 32111.851058809272, 32292.28552219656, 32298.149375580735, 32491.058420435496, 30458.966492809435, 33427.57461161304, 34265.91426190793, 34311.64568548925, 33140.62438073095, 33561.29888942863, 35529.96591658374, 37652.095110831724, 37044.254834259176, 38241.796287711855, 39274.99926815619, 38876.16949560484, 46409.205154090756, 46453.15968230423, 44876.293508160445, 47996.07625538635, 47436.06453854616, 47244.8071655457, 48679.12210723686, 47954.063833929875, 49240.64444036457, 52184.60272743196, 51561.72102722785, 55898.95859009074, 55941.00666340744, 57483.75355178617, 54103.929564816426, 48939.65234251408, 49759.1688109796, 47168.08757148826, 46430.66228921716, 46236.59530097228, 45232.83925945128, 49688.375103169026, 48490.43305841428, 50461.01917835067, 48505.223436067296, 48841.88471290147, 48877.23626313597, 50945.25334756384, 52444.886545803376, 54816.81684018141, 55860.93440858428, 57747.169838468886, 57299.342185254536, 61030.89570981033, 59036.06131532005, 55764.1250807415, 56939.994865266846, 58826.96008797419, 57779.00081595525, 58112.97704042576, 58216.830772839865, 57490.928826316376, 54185.2190249767, 54567.87679409251, 52470.30439503824, 51493.79837201434, 55131.2531870318, 55879.1589925118, 55835.542376142126, 57623.07641707703, 58834.497693421305, 58781.59495180782, 58707.638213973994, 59001.46754244261, 57165.37368038212, 58223.40815084753, 59012.76032265571, 58009.20889248508, 56057.02456547252, 58064.97193018012, 58256.9090996868, 60529.98285146009]
    }],
    "configuration": {
        "num_samples": 50,
        "output_types": ["mean", "quantiles", "samples"],
        "quantiles": ["0.1", "0.9"]
    }
};

// name of endpoint
const endpointName = "btcrates";


//saving data to dynamo
async function saveData(mean) {
    var date = new Date("2021-01-01");
    var predictedTime = date.toLocaleDateString(date.setDate(date.getDate() + 100))
    try {
        let params2 = {
            TableName: "prediction-BTC",
            Item: { mean: mean, time: predictedTime }
        }
        docClient.put(params2).promise();
    } catch (err) {
        console.log(err);
    }
}
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