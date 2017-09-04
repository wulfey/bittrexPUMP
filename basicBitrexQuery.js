// install node
// install npm
// move to directory
// : npm init
// : npm install
// : npm install --save node.bittrex.api"
// : node basicBitrexQuery.js
// this will dump the basic query into the console

// const keys = require("./keys");
var request = require("request-promise");
var bittrex = require("./node.bittrex.api");
const TEST_URI = "https://bittrex.com/api/v1.1/public/getmarketsummaries";

// bittrex.options({
//   apikey: keys.API_KEY,
//   apisecret: keys.API_SECRET
// });

bittrex.getmarketsummaries(function(data, err) {
  if (err) {
    return console.error(err);
  }

  // console.log(data);

  for (var i in data.result) {
    bittrex.getticker({ market: data.result[i].MarketName }, function(ticker) {
      // console.log(ticker);
    });
  }
});

var market = "BTC-XMR";
bittrex.getmarkethistory({ market }, response => {
  // console.log(response);
});

bittrex.getmarketsummaries(response => {
  // console.log(response);
});

// bittrex.getcandles(
//   {
//     marketName: "USDT-BTC",
//     tickInterval: 5000
//   },
//   function(data, err) {
//     if (err) {
//       /**
//       {
//         success: false,
//         message: 'INVALID_TICK_INTERVAL',
//         result: null
//       }
//     */
//       return console.error(err);
//     }
//     // console.log(data);
//   }
// );

var reqOptions = {
  method: "GET",
  uri: TEST_URI,
  headers: {
    "user-agent": "node.js"
  },
  json: true
};

var previousResult = [];
// var numbersToNamesHash = {};

//load up an initial result from the API call
request(reqOptions)
  .then(function(parsedBody) {
    previousResult = JSON.stringify(parsedBody, null, 2);
    previousResult = parsedBody.result;
    // console.log(previousResult[258]);
    // console.log("Length = " + previousResult.length);
  })
  .catch(function(err) {
    console.log("request failed : " + err);
  });

//this is the next thing returned by the interval caller
var nextResult = [];

//helper variables to store values for the comparisons
var count = 0;
var numbersToNamesHash = {};
var differenceArray = [];
var dif = 0;
//Array.prototype.every()

var intervalObject = setInterval(function() {
  request(reqOptions)
    .then(function(parsedBody) {
      // console.log(previousResult);
      // console.log("Should be previously result ^^^^^");
      // console.log("Got response : " + JSON.stringify(parsedBody, null, 2));

      // reset the storage arrays
      numbersToNamesHash = {};
      differenceArray = [];

      nextResult = parsedBody.result;
      if (previousResult.length === nextResult.length) {
        nextResult.forEach((element, i, array) => {
          dif = nextResult[i].Last / previousResult[i].Last * 100 - 100;
          // console.log(dif);
          if (dif > 0) {
            numbersToNamesHash[dif] = element.MarketName;
            differenceArray.push(dif);
          }
        });
      } else {
        console.log(
          "WARNING: length match failure, different number of coins returned. Comparison failed."
        );
      }
      differenceArray.sort((a, b) => {
        return b - a;
      });

      differenceArray.forEach((elem, i, array) => {
        console.log(
          `${numbersToNamesHash[elem]} increased ${elem.toFixed(5)}%`
        );
      });
      console.log("---------------");

      // console.log(differenceArray);

      previousResult = nextResult;
    })
    .catch(function(err) {
      console.log("request failed : " + err);
    });
  // console.log("Iterations: " + count);
  count++;
  if (count == 5) {
    console.log(`exiting after ${count} iterations`);
    clearInterval(intervalObject);
  }
}, 5000);
