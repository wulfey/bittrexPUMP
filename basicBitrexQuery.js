// install node
// install npm
// move to directory
// : npm init
// : npm install
// : npm install --save node.bittrex.api"
// : node basicBitrexQuery.js
// this will dump the basic query into the console

// const keys = require("./keys");
const request = require("request-promise");
const bittrex = require("./node.bittrex.api");
const TEST_URI = "https://bittrex.com/api/v1.1/public/getmarketsummaries";

//Configuration VARIABLES
//===============================================
//Variables that can be modified
var percentDif = -1000; //minimum % gain
var timeInterval = 5000; //time to wait before iterations in milliseconds
var iterations = 0; //number of iterations to run script, set to <=0 to run infinite
//==============================================

var reqOptions = {
  method: "GET",
  uri: TEST_URI,
  headers: {
    "user-agent": "node.js"
  },
  json: true
};

var previousResult = [];
// helper to enable name to name comparisons of values
var previousHash = {};

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

//this is the next thing returned by the interval caller
var nextResult = [];

//helper variables to store values for the comparisons
var count = 0;
var numbersToNamesHash = {};
var differenceArray = [];
var nextHash = {};
var dif = 0;

var intervalObject = setInterval(
  function() {
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

    // adjust the count here or comment this out to disable automatic shutdowns

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
