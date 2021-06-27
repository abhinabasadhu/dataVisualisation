//Import external library with websocket functions
let ws = require('websocket');
const {getAllData} = require("./database.js");
//Hard coded domain name and stage - use when pushing messages from server to client

let domainName = "orzqgfj7ll.execute-api.us-east-1.amazonaws.com";
let stage = "production";

exports.handler = async (event, context) => {
    try {
        //Allocate domain name and stage dynamically
        console.log("I am HERE 1")
          let domainName = "orzqgfj7ll.execute-api.us-east-1.amazonaws.com";
          let stage = "production";
        //let connId = event.requestContext.connectionId;

        console.log("I am HERE 2")
      console.log("Domain: " + domainName + "; Stage: " + stage);
        
        let data = JSON.stringify(await getAllData())  ;
        console.log("I am HERE 3")
        console.log(JSON.stringify(data));
        console.log("I am HERE 4")
        
     //   let result = await ws.sendMessage(connId,data, domainName, stage);
        
    //    await Promise.all(result);

        //Get promises message to connected clients
  let sendDataPromises = await ws.getSendDataPromises(data, domainName, stage);
      console.log("I am HERE 5")
    //Execute promises
        await Promise.all(sendDataPromises);
    
    }catch(err){
        console.log("ERROR: " + JSON.stringify(err) );
        return { statusCode: 500, body: "Error: " + JSON.stringify(err) };
    }

    //Success
    return { statusCode: 200, body: "Data sent successfully." };
        
   } ;