//Import AWS
let AWS = require("aws-sdk");

let docClient = new AWS.DynamoDB.DocumentClient();

//Data that we are going to send to endpoint
let endpointData = {
    "instances": [{
        "start": "2021-01-01",
        "target": [730.694067408721, 773.5089624849729, 974.8940663285435, 1042.3538182445266, 1101.068634562031, 1210.0216736409677, 1226.9216656437372, 1217.2970340576808, 1278.2951605943554, 1255.540856324731, 1088.8772443962487, 1049.5438335623262, 1130.9156623525494, 1231.2020164053552, 1169.3320829156457, 1228.9901398675695, 1233.3508248983778, 1258.5895641753102, 1368.6984857019208, 1377.960634679753, 1111.615895264396, 1235.4342820336813, 1234.488172626882, 1393.4950968472447, 1319.4928957348616, 1360.363271540483, 1243.2962236386923, 1330.8638369181633, 1379.7392209103725, 1378.8401062131961, 1314.7176796087863, 1375.1165826971057, 1513.6552232434778, 1666.6809818439285, 1600.0109833505107, 1718.9445490237356, 1679.3640182851339, 1615.744763605857, 1752.203332402795, 1770.6070576795003, 1743.9289614569777, 1787.690750473859, 1845.622374083676, 1818.6162106655188, 1805.1167500255654, 1780.0806920123343, 1784.483177274371, 1851.948172267192, 1938.7027098247647, 1957.3406169129848, 1916.7634551738463, 1936.3268856541804, 1777.7914753263613, 1578.8914687677461, 1626.518510846067, 1483.7209840348655, 1448.9484750758543, 1462.6867413031646, 1422.698669234307, 1573.0095503692512, 1490.4143380548705, 1571.501377639233, 1542.178045220015, 1531.6232384268058, 1651.899558861462, 1726.7318514985386, 1834.9580764916357, 1869.197283854645, 1795.995409894418, 1826.7115315620365, 1772.1576236815436, 1918.90774506155, 1850.7381053446272, 1796.9082043392907, 1807.5792925052006, 1822.7839249580265, 1780.3798675252294, 1812.4567989758116, 1808.8758068372672, 1788.2979533083767, 1685.4837208884599, 1674.7348490551296, 1587.9613933926041, 1592.4127319112592, 1702.2841812144272, 1714.838728269112, 1688.9186761853566, 1816.5087008909532, 1842.1932375569836, 1917.2821991357007, 1966.2962639673801, 2134.400205610877, 2013.9063194034122, 2078.2298677240487, 2105.899943883341, 2114.7645934304805, 1969.8292020940216, 2083.1028588689114, 2071.406950042935, 2165.378754746820]
    }],
    "configuration": {
        "num_samples": 50,
        "output_types": ["mean", "quantiles", "samples"],
        "quantiles": ["0.1", "0.9"]
    }
};

// name of endpoint
const endpointName = "ethrates";


//saving data to dynamo
async function saveData(mean) {
    var date = new Date("2021-01-01");
    var predictedTime = date.toLocaleDateString(date.setDate(date.getDate() + 100))
    try {
        let params2 = {
            TableName: "prediction-ETH",
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