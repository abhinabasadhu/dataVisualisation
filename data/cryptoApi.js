// const upload = ()=>{
//     const findBit = async (url = "https://api.nomics.com/v1/exchange-rates/history")=>{
//         url += "?" + "key=" + process.env.API ;
//         url += "&currency=BTC"  ;
//         url += "&start=2021-01-01"; 
//    return await require('axios').get(url);
//     };
//     const findTron = (url = "https://api.nomics.com/v1/exchange-rates/history")=>{
//         url += "?" + "key=" + process.env.API ;
//         url += "&currency=TRX"  ;
//         url += "&start=2021-01-01"; 
//     return require('axios').get(url);
//     };
//     const findBin =(url = "https://api.nomics.com/v1/exchange-rates/history")=>{
//         url += "?" + "key=" + process.env.API ;
//         url += "&currency=BNB"  ;
//         url += "&start=2021-01-01"; 
//     return require('axios').get(url);
//     };
//     const findEth = (url = "https://api.nomics.com/v1/exchange-rates/history")=>{
//         url += "?" + "key=" + process.env.API ;
//         url += "&currency=ETH"  ;
//         url += "&start=2021-01-01"; 
//     return require('axios').get(url);
//     };
//     const findTeth = (url = "https://api.nomics.com/v1/exchange-rates/history")=>{
//         url += "?" + "key=" + process.env.API ;
//         url += "&currency=USDT"  ;
//         url += "&start=2021-01-01"; 
//     return require('axios').get(url);
//     };
//     const printCurreny = ({data})=>{
//         let date: Date = new Date();
//         let startTimestamp = date.getTime();
//         for(let value of data){
//             const currency = value.currency;
//             const rates = value.rate;
//             const timeStamp = value.timestamp;
//             var input = {
//                 currency :currency,
//                 rates :rates,
//                 time :timeStamp
//             };
//             var params = {
//                 TableName: "exchange",
//                 Item: input
//             };
//         }
//         return Promise.resolve(data.next);
//     };
//     find()
//     .then(printCurreny)
//     .catch((err)=>{
//         console.log("Error",err)
//     });
// };
// upload();
// // //Time library that we will use to increment dates.
// const moment = require('moment');
// //Axios will handle HTTP requests to web service
// const axios = require ('axios');
// //Reads keys from .env file
// const dotenv = require('dotenv');
// //Copy variables in file into environment variables
// dotenv.config();
// import { savecryptoData } from "./dataBaseUpload";
// //https://api.nomics.com/v1/exchange-rates/history?key=your-key-here&currency=BTC&start=2018-04-14T00%3A00%3A00Z&end=2018-05-14T00%3A00%3A00Z
// //Class that wraps fixer.io web service
// export class Nomic {
//     //Base URL of fixer.io API
//     baseURL: string = "https://api.nomics.com/v1/exchange-rates/history";
//     //Returns a Promise that will get the exchange rates for the specified date
//     getExchangeRates(date: string ): Promise<object> {
//         //Build URL for API call 
//         let url:string = this.baseURL + "?";
//         url += "key=" + process.env.API;
//         url += "&currency=" + ;
//         url += "&start=2021-01-01";
//         //Output URL and return Promise
//         console.log("Building .io Promise with URL: " + url);
//         return axios.get(url);
//     }
// }
// //Gets the historical data for a range of dates.
// async function getHistoricalData(startDate: string, numDays: number){
//     /* You should check that the start date plus the number of days is
//     less than the current date*/
//     //Create moment date, which will enable us to add days easily.
//     let date = moment(startDate);
//     //Create instance of Fixer.io class
//     let NomicIo: Nomic = new Nomic();
//     //Array to hold promises
//     let promiseArray: Array<Promise<object>> = [];
//     //Work forward from start date
//     for(let i: number =0; i<numDays; ++i){
//         //Add axios promise to array
//         promiseArray.push(NomicIo.getExchangeRates(date.format("YYYY-MM-DD"));
//         //Increase the number of days
//         date.add(1, 'days');
//     }
//     //Wait for all promises to execute
//     try {
//         let resultArray: Array<object> = await Promise.all(promiseArray);4
//         //Output the data
//         resultArray.forEach((result)=>{
//             console.log(result);
//             //data contains the body of the web service response
//             let data = result['data'];
//             //Check that API call succeeded.
//             if(data.success != true){
//                 console.log("Error: " + JSON.stringify(data.error));
//             }
//             else{
//                 //Output the result - you should put this data in the database
//                 console.log("Date: " + data.date +
//                     " BTC: " + data.rates.USD +
//                     " ETH: " + data.rates.CAD +
//                     " XRP: " + data.rates.GBP
//                 );
//             }
//         });
//     }
//     catch(error){
//         console.log("Error: " + JSON.stringify(error));
//     }
// }
// //Call function to get historical data
// getHistoricalData('2015-12-24', 10);
//# sourceMappingURL=cryptoApi.js.map