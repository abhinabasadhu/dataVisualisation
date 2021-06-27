//Import AWS
let AWS = require("aws-sdk");

let docClient = new AWS.DynamoDB.DocumentClient();

//Data that we are going to send to endpoint
let endpointData = {
    "instances": [{
        "start": "2021-01-01",
        "target": [1.001656730965704, 0.9995253527683057, 0.9959147692859794, 1.0004642031750286, 1.0013530971769902, 1.0004095773857218, 1.0016650779593743, 1.0015289265770249, 1.001610531167588, 1.0001980963426602, 1.0015352447172503, 1.0006398864840642, 1.0000411718226188, 0.9988053655139072, 1.0013119376303024, 1.000518885562634, 1.0007127882154174, 1.00100394630139, 1.0003638351723068, 1.0008703564009522, 0.999873677188173, 1.001872790787186, 1.0010838988166644, 1.0016399470417936, 1.001152299113448, 1.0007966178850556, 1.003043502680977, 1.0005555015302876, 1.0000290415402737, 0.9995395397776643, 1.0001345034264446, 1.0008566684602576, 1.0008834055739608, 0.9991838225298715, 1.0010322533299607, 0.9993084334674956, 1.0013723378165194, 1.0016652289150578, 1.0005323588986834, 1.0008668145305049, 1.0014071100938162, 1.0002566298749886, 1.0019531297476785, 1.0016950608255115, 1.002287613549458, 1.000852476970032, 1.001540954239857, 1.0009970612052932, 0.9999798325302184, 1.0005853364499713, 1.0015787961242424, 1.0017479011054224, 1.0015468953158848, 1.0011453199603566, 1.0022335444472503, 1.0035123014792564, 1.001834409900364, 1.00299163672133, 1.002806259917975, 1.0005293835243783, 1.0020740998552413, 1.001782386448685, 1.0025872930159878, 1.001929643333385, 1.0002219393909901, 0.9991233016707292, 1.0015582942580485, 0.996896249626485, 0.9998545908222635, 0.9995073127386727, 1.0031549292774662, 0.9974791878240378, 1.0010362079886992, 1.0030294565316393, 1.0003888420914424, 0.9985995231273405, 1.0003067267631194, 1.000697157855536, 1.0062374789959225, 1.0104417644921375, 0.9988739914910257, 1.0033713062419511, 1.0034118607394846, 1.0024807802206, 1.0009265482237117, 0.998566835000259, 0.9984049340307756, 0.9986737301584865, 1.0003639317988553, 0.9994740293642437, 0.9994375187405449, 1.00053782159237, 1.0042949226533315, 1.0017313413078557, 1.0072895523511713, 1.0086351505462505, 1.0038715290207674, 1.0006561273980976, 1.003842290875742, 1.0015801245356377]
    }],
    "configuration": {
        "num_samples": 50,
        "output_types": ["mean", "quantiles", "samples"],
        "quantiles": ["0.1", "0.9"]
    }
};

// name of endpoint
const endpointName = "usdtdata2";


//saving data to dynamo
async function saveData(mean) {
    var date = new Date("2021-01-01");
    var predictedTime = date.toLocaleDateString(date.setDate(date.getDate() + 100))
    try {
        let params2 = {
            TableName: "prediction-USDT",
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

            // STORE DATA IN PREDICTION TABLE
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