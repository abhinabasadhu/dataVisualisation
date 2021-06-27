var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.saveData = void 0;
    var AWS = require("aws-sdk");
    let awsConfig = {
        region: "us-east-1",
        endpoint: "https://dynamodb.us-east-1.amazonaws.com",
    };
    AWS.config.update(awsConfig);
    let docClient = new AWS.DynamoDB.DocumentClient();
    function saveData(tweetId, tweetText, tweetTime) {
        return __awaiter(this, void 0, void 0, function* () {
            try { //Table name and data for table
                let params = {
                    TableName: "twitter",
                    Item: {
                        id: tweetId,
                        text: tweetText,
                        time: tweetTime //Text of tweet
                    }
                };
                console.log("Im here");
                const data = yield docClient.put(params).promise();
                return data;
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    exports.saveData = saveData;
    ;
});
// // module.exports = function savecryptoData(currency: string,rate:number,timestamp: number): Promise<string>{
// // let params={
// //     TableName: "exhange",
// //     Item: {
// //         currency: currency,
// //         rate: rate,
// //         timestamp: timestamp,
// //     }
// // };
// // return new Promise<string>((resolve,reject)=>{
// //     docClient.put(params,(err,data)=>{
// //         if(err){
// //             reject("Unable to add data"+ JSON.stringify(err));
// //         }
// //         else{
// //             resolve("Item added to table with id:" +data);
// //         }
// //     })
// // });
// // }
//# sourceMappingURL=dataBaseUpload.js.map