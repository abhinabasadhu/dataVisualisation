let AWS = require("aws-sdk");

//Import functions for database
let db = require('database');

module.exports.getSendDataPromises = async (data, domainName, stage) => {
console.log("enter function")    
    let clientIdArray = (await db.getConnectionIds()).Items;
    console.log("\nClient IDs:\n" + JSON.stringify(clientIdArray));

    //Create API Gateway management class.
    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
        endpoint: domainName + '/' + stage
    });

    //Try to send message to connected clients
    let dataPromiseArray = clientIdArray.map( async item => {
        try{
            console.log("Sending message '" + data + "' to: " + item.connectionId);

            //Create parameters for API Gateway
            let apiMsg = {
                ConnectionId: item.connectionId,
                Data: data
            };

            //Wait for API Gateway to execute and log result
            await apigwManagementApi.postToConnection(apiMsg).promise();
            console.log("Message '" + data + "' sent to: " + item.connectionId);
        }
        catch(err){
            console.log("Failed to send message to: " + item.ConnectionId);

            //Delete connection ID from database
            if(err.statusCode == 410) {
                try {
                    await db.deleteConnectionId(item.connectionId);
                }
                catch (err) {
                    console.log("ERROR deleting connectionId: " + JSON.stringify(err));
                    throw err;
                }
            }
            else{
                console.log("UNKNOWN ERROR: " + JSON.stringify(err));
                throw err;
            }
        }
    });

    return dataPromiseArray;
};

module.exports.sendMessage = async(connId,data, domainName, stage)=>{
    //Create API Gateway management class.
    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
        endpoint: domainName + '/' + stage
    });
    let dataPromiseArray = connId.map( async item => {
        try{
            console.log("Sending message '" + data + "' to: " + item.connectionId);

            //Create parameters for API Gateway
            let apiMsg = {
                ConnectionId: item.connectionId,
                Data: data
            };

            //Wait for API Gateway to execute and log result
            await apigwManagementApi.postToConnection(apiMsg).promise();
            console.log("Message '" + data + "' sent to: " + item.cnnectionId);
        }
        catch(err){
            console.log("Failed to send message to: " + item.ConnectionId);

            //Delete connection ID from database
            if(err.statusCode == 410) {
                try {
                    await db.deleteConnectionId(item.ConnectionId);
                }
                catch (err) {
                    console.log("ERROR deleting connectionId: " + JSON.stringify(err));
                    throw err;
                }
            }
            else{
                console.log("UNKNOWN ERROR: " + JSON.stringify(err));
                throw err;
            }
        }
    });

    return dataPromiseArray;
}