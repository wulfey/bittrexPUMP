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

var reqOptions = {
  method: "GET",
  uri: TEST_URI,
  headers: {
    "user-agent": "node.js"
  },
  json: true
};

var previousResult = [];

//load up an initial result from the API call
request(reqOptions)
  .then(function(parsedBody) {
    previousResult = parsedBody.result;
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

var intervalObject = setInterval(
  function() {
    request(reqOptions)
      .then(function(parsedBody) {
        // reset the storage arrays
        numbersToNamesHash = {};
        differenceArray = [];

        //load up the difference arrays and hashes
        nextResult = parsedBody.result;
        if (previousResult.length === nextResult.length) {
          nextResult.forEach((element, i, array) => {
            // critical percentage difference calculation
            dif = nextResult[i].Last / previousResult[i].Last * 100 - 100;

            // if the delta is positive, add it to the helpers
            if (dif > 0) {
              numbersToNamesHash[dif] = {
                name: element.MarketName,
                last: nextResult[i].Last,
                prev: previousResult[i].Last
              };
              differenceArray.push(dif);
            }
          });
        } else {
          console.log(
            "WARNING: length match failure, different number of coins returned. Comparison failed."
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
            `${tick.name} increased ${elem.toFixed(
              5
            )}% from ${tick.prev} to ${tick.last}`
          );
        });
        console.log("---------------");

        //make the new result into the old one for the next loop
        previousResult = nextResult;
      })
      .catch(function(err) {
        console.log("request failed : " + err);
      });
    count++;

    // adjust the count here or comment this out to disable automatic shutdowns
    if (count == 5) {
      console.log(`exiting after ${count} iterations`);
      clearInterval(intervalObject);
    }
  },
  //adjust this number in milliseconds to change the polling time
  5000
);
