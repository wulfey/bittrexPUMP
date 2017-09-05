//==============================================
//INSTALLATION
//==============================================
// install node
// install npm
// move to directory
// : npm init
// : npm install
// : npm install --save request-promise
// : npm install --save node.bittrex.api"
// : node basicBitrexQuery.js
// this will dump the basic query into the console

//===============================================
//VARIABLES
//===============================================
//Variables that can be modified
var percentDif = 5; //variable to check for percentage difference check
var timeInterval = 30000; //time to wait before iterations in milliseconds
var timeIntervalSecs = timeInterval / 1000;
var iterations = 20; //number of iterations to run script
//==============================================



//Variables (do not modify)
var request = require("request-promise"); //What is this?
var bittrex = require("node.bittrex.api"); //What is this?
const TEST_URI = "https://bittrex.com/api/v1.1/public/getmarketsummaries"; //bittrex API
var previousResult = []; //array to store first check of last price
var nextResult = []; //array to store second check of last price
var count = 0; //variable to count number of iterations
var numbersToNamesHash = {}; //array to store ticker name and both last prices
var differenceArray = []; //array to store difference between last prices
var previousHash = {};
var nextHash = {};
var dif = 0; //variable to store percentage difference
//=====================================================

//What is this?
var reqOptions = {
  method: "GET",
  uri: TEST_URI,
  headers: {
    "user-agent": "node.js"
  },
  json: true
};

//load up an initial result from the API call
request(reqOptions)
  .then(function(parsedBody) {
    previousResult = parsedBody.result;
    previousResult.forEach(result => {
      previousHash[result.MarketName] = result.Last;
    });
    // console.log(previousHash);
  })
  .catch(function(err) {
    console.log("request failed : " + err);
  });

//Function to keep track of detected Pumps
// function keepTrackMarkets(markets) {
//   var marketsArray = markets;           //setup array for strings
//   var marketsObject = {};               //Setup object for markets + strength
//
//   for (var i=0; i<marketsArray.length; i++) {
//     var marketToCheck = marketsArray[i];
//     if (marketsObject[marketToCheck] == undefined) {
//       //market doesn't exist, add it as a key and set strength value to 1
//       marketsObject[marketToCheck] = 1;
//     } else {
//       //market exist, increment strength by 1
//       marketsObject[marketToCheck] += 1;
//     }
//   }
// }

var intervalObject = setInterval(
  function() {
    console.log("---------------");
    console.log(`Starting iteration ${count} of ${iterations}`);
    console.log(`Seconds between iterations ${timeIntervalSecs}`);

    request(reqOptions)
      .then(function(parsedBody) {
        // reset the storage arrays
        numbersToNamesHash = {};
        differenceArray = [];

        //load up the difference arrays and hashes
        nextResult = parsedBody.result;
        // console.log(nextResult[0]);
        //load up the nextHash array of names to numbers to help comparison
        nextResult.forEach(result => {
          nextHash[result.MarketName] = result.Last;
        });

        // console.log(`THis many keys: ${Object.keys(nextHash).length}`);

        Object.keys(nextHash).forEach(market => {
          // critical percentage difference calculation
          dif = nextHash[market] / previousHash[market] * 100 - 100;

          // if the delta is positive, add it to the helpers
          if (dif != 0 && dif > percentDif) {
            numbersToNamesHash[dif] = {
              MarketName: market,
              prev: previousHash[market],
              next: nextHash[market]
            };
            differenceArray.push(dif);
          }
        });

        if (previousResult.length !== nextResult.length) {
          console.log(
            "WARNING: different numbers of results returned. Chart missing."
          );
        }

        //sort it in ascending order
        differenceArray.sort((a, b) => {
          return b - a;
        });

        //iterate through the difference array and log out names and percentages
        differenceArray.forEach((elem, i, array) => {
          var tick = numbersToNamesHash[elem];
          console.log(
            `${tick.MarketName} ${elem > 0
              ? "increased"
              : "decreased"} ${elem.toFixed(
              5
            )}% from ${tick.prev} to ${tick.next}`
          );
        });
        console.log("---------------");

        //make the new result into the old one for the next loop
        previousResult = nextResult;
        previousHash = new Object();

        Object.keys(nextHash).forEach(MarketName => {
          previousHash[MarketName] = nextHash[MarketName];
        });
      })
      .catch(function(err) {
        console.log("request failed : " + err);
      });
    count++;

    if (iterations > 0) {
      if (count == iterations) {
        console.log(`exiting after ${count} iterations`);
        clearInterval(intervalObject);
      }
    }
  },
  //adjust this number in milliseconds to change the polling time
  timeInterval
);
