//Import AWS
let AWS = require("aws-sdk");

let docClient = new AWS.DynamoDB.DocumentClient();

//Data that we are going to send to endpoint
let endpointData = {
    "instances": [{
        "start": "2021-01-01",
        "target": [0.02689529404567463, 0.027231040427778044, 0.029537654780151412, 0.031101770001931744, 0.02858885389377103, 0.030923163506649316, 0.03126435652246722, 0.030506904769324418, 0.03399640463450835, 0.0329307201548507, 0.029067416620312942, 0.02872729139027479, 0.03070421925251959, 0.030146294463648776, 0.02979909631527767, 0.030155878131325878, 0.03019425923310874, 0.03169501938815835, 0.030710168410500484, 0.03049097151118649, 0.027706110591023302, 0.028668507573592298, 0.029256137328872455, 0.030031366065901264, 0.02958880242036646, 0.02952661207276319, 0.02833883282715625, 0.029555375944724627, 0.03333188117544597, 0.032062195243378236, 0.0315226880229144, 0.03293857049199722, 0.03313801067749117, 0.03445006726603685, 0.03314002333469071, 0.03620754653484416, 0.035100743605390596, 0.03603669539681057, 0.04035674598956725, 0.04611186938931711, 0.0463515863528825, 0.056815132963605026, 0.05523869506620389, 0.05995098455900163, 0.05530938487759433, 0.050889358121480634, 0.052088266270746815, 0.05259110918999049, 0.054932158506374444, 0.06079425485634539, 0.05798076598571321, 0.0594720461071817, 0.05448130967322392, 0.04514930034470878, 0.04826620191808084, 0.04550561426551984, 0.04537604060576698, 0.04674966508472044, 0.04577107345831166, 0.047833007334254815, 0.047085929942636086, 0.049032165090756766, 0.05165645420800072, 0.05034716729060858, 0.05025918669291067, 0.05174462222502907, 0.05308420170257367, 0.052974542301907325, 0.051478627695552705, 0.05151372781077803, 0.05021006369894506, 0.05280441279781922, 0.051119372360220676, 0.05082129408126827, 0.05216522445147717, 0.054865415161625124, 0.05342600839586007, 0.05855470628412522, 0.061490037241043814, 0.06409088288922453, 0.059278785448530866, 0.05864805431565463, 0.05629415137395038, 0.0557267474475493, 0.0648104736679294, 0.06355031096287447, 0.06362795879757567, 0.06470918856188129, 0.06608338449022774, 0.09213710786688446, 0.085600532528642, 0.09266024742816711, 0.10228740215475023, 0.12846492083455716, 0.13969023739814873, 0.12645212905294229, 0.11149566129979324, 0.12431829682676898, 0.11688012682053135, 0.11998395346337665]
    }],
    "configuration": {
        "num_samples": 50,
        "output_types": ["mean", "quantiles", "samples"],
        "quantiles": ["0.1", "0.9"]
    }
};

// name of endpoint
const endpointName = "trxdata";


//saving data to dynamo
async function saveData(mean) {
    var date = new Date("2021-01-01");
    var predictedTime = date.toLocaleDateString(date.setDate(date.getDate() + 100))
    try {
        let params2 = {
            TableName: "prediction-TRX",
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