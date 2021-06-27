"use strict";

var AWS = require("aws-sdk");

var _require = require("aws-sdk/clients/dynamodb"),
    DocumentClient = _require.DocumentClient;

var comprehend = new AWS.Comprehend();

exports.handler = function _callee2(event) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log(JSON.stringify(event));
          _context2.prev = 1;
          // extract data from event
          event.Records.forEach(function _callee(record) {
            var id, text, timestamp, currency, params, result, param2, store;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    id = record.NewImage.id;
                    text = record.NewImage.text;
                    timestamp = record.NewImage.time;
                    currency = record.NewImage.currency;
                    console.log(id, text, timestamp, currency);
                    params = {
                      text: text,
                      LanguageCode: "en"
                    }; // sentiment comprehend

                    _context.next = 8;
                    return regeneratorRuntime.awrap(comprehend.detectSentiment(params).promise());

                  case 8:
                    result = _context.sent;
                    // save it to the dynamodb
                    param2 = {
                      TableName: "sentimentData",
                      Item: {
                        textSentiment: result,
                        id: id,
                        timestamp: timestamp,
                        currency: currency
                      }
                    }; // store the record in database

                    _context.next = 12;
                    return regeneratorRuntime.awrap(DocumentClient.put(param2).promise());

                  case 12:
                    store = _context.sent;
                    return _context.abrupt("return", store);

                  case 14:
                  case "end":
                    return _context.stop();
                }
              }
            });
          });
          return _context2.abrupt("return", response);

        case 6:
          _context2.prev = 6;
          _context2.t0 = _context2["catch"](1);
          console.log(_context2.t0);

        case 9:
          ;

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 6]]);
};