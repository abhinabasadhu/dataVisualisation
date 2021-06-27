//Import AWS
let AWS = require("aws-sdk");

let docClient = new AWS.DynamoDB.DocumentClient();

//Data that we are going to send to endpoint
let endpointData = {
    "instances": [{
        "start": "2020-05-28",
        "target": [266.2301617433942,279.9242394447288,280.9009000862385,267.22148576082117,286.1528077256399,285.7469888177263,300.9467761153462,285.3145902189268,313.70129374995315,295.90244071475036,322.2380351251043,302.07481807851616,331.0816973516186,310.9807500587001,305.42303806892227,326.9429036139322,332.42764508015273,308.6355597592848,320.3406197075291,320.68513354010486,292.14686335411943,312.9153353168382,295.58558202964593,306.00162009185874,303.918309349832,277.8182017729803,300.67035913884075,274.8504827166832,285.5308518152881,291.31749412447465,285.46523075089067,312.0605594912729,313.7500293964264,313.27124577695065,333.89644830975584,313.9498738557531,341.0934369654238,336.8434547863861,324.14958616521153,330.5027375657445,315.5394561322167,339.62050122462455,340.25543331128046,306.9304936119662,306.7790738265711,308.6495491008843,297.3812535153513,307.2491293040516,308.2563118610065,308.97990542688257,299.4548449516307,286.125185493669,301.46923545054085,305.3854505303409,324.23753691196407,311.43178288776676,335.3110349381863,326.4766397975502,319.6035497352973,337.10437835618984,325.1609729994105,354.77180379093505,350.90493907376276,359.5728481227348,359.0690130330642,343.65604408804546,337.4937062830894,339.975281311816,342.84345553964,318.8714804382515,327.4396021379876,308.68507717280187,304.7954178225751,303.3186563876598,305.16509947722415,327.75996356060585,302.4270465416157,305.84351364027026,333.88092160459354,336.4255665161098,324.7077699845691,340.67706246959574,347.32209082642106,333.167461161162,364.5718560237973,355.26592526363527,367.9571326876858,353.4202000192576,341.32431570355493,337.0579303843422,360.06508299331085,358.1189192146392,348.48660650990627,347.3056986125298,337.92518763895123,322.87145738272454,310.22753631155535,309.07940870497333,312.4151498629657,331.3500166016163]
    }],
    "configuration": {
        "num_samples": 50,
        "output_types": ["mean", "quantiles", "samples"],
        "quantiles": ["0.1", "0.9"]
    }
};

// name of endpoint
const endpointName = "synthetic";


//saving data to dynamo
async function saveData(mean){
    var date = new Date("2021-01-01");
       var predictedTime = date.toLocaleDateString(date.setDate(date.getDate()+100))
            try{
            let params2 = {
                TableName: "prediction-syntheicData",
                Item: {time: predictedTime, mean}
            }
           await docClient.put(params2).promise();
            }catch(err){
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
       responseData.predictions.map(item=>{
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