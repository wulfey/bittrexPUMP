var APIqueries = require("./queryBittrex");

var defaultConfigOptions = {
  percentDif: 0.3,
  timeInterval: 20000,
  iterations: 0
};

module.exports = {
  // primary query on main API URI
  intervalQueryRunner: (configOptions = defaultConfigOptions) => {
    //Set VARIABLES
    var percentDif = configOptions.percentDif;
    var timeInterval = configOptions.timeInterval;
    var iterations = configOptions.iterations;

    // ********************  INITIALIZE PREVIOUS BLOCK ******************** //
    var previousHash = {};
    var previousResultArray = [];
    APIqueries.queryBittrex().then(JSONResults => {
      // results array is very large, 259 entries, each result has many subfields
      previousResultArray = JSONResults.result;
      // this loads the previous hash with ~ {BTC-ETH: 0.4, ...}
      previousResultArray.forEach(result => {
        previousHash[result.MarketName] = result.Last;
      });
      // console.log(previousResultArray[0]);
      // console.log(previousHash[previousResultArray[0].MarketName]);
    });
    // ******************************************************* //

    //this is the next thing returned by the interval caller
    var nextResultArray = [];
    var nextHash = {};

    //helper variables to store values for the comparisons
    var count = 0;
    var dif = 0;
    var numbersToNamesHash = {};
    var differenceArray = [];

    var intervalObject = setInterval(
      async () => {
        try {
          let JSONResults = await APIqueries.queryBittrex();

          // reset the storage arrays
          numbersToNamesHash = {};
          differenceArray = [];

          //load up the difference arrays and hashes
          nextResultArray = JSONResults.result;
          // console.log(nextResultArray[0]);

          //load up the nextHash array of names to numbers to help comparison
          nextResultArray.forEach(result => {
            nextHash[result.MarketName] = result.Last;
          });
          // console.log(`THis many keys: ${Object.keys(nextHash).length}`);

          //for each key in the nextHash, check its different with previous hash
          Object.keys(nextHash).forEach(market => {
            dif = nextHash[market] / previousHash[market] * 100 - 100;

            // if the delta is non0 and > config, then put it in differenceArray
            if (dif != 0 && dif > percentDif) {
              // numbersToNamesHash stores data about a market retrievable by dif
              numbersToNamesHash[dif] = {
                MarketName: market,
                prev: previousHash[market],
                next: nextHash[market]
              };
              // differenceArray can later be sorted and operated on, use the dif to access other data in the hash above
              differenceArray.push(dif);
            }
          });

          // check for mismatch in number of results returned from API calls
          if (previousResultArray.length !== nextResultArray.length) {
            console.log(
              "WARNING: different numbers of results returned. Chart missing."
            );
          }

          //sort differenceArray in ascending order
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
          previousResultArray = nextResultArray;
          previousHash = new Object();
          Object.keys(nextHash).forEach(MarketName => {
            previousHash[MarketName] = nextHash[MarketName];
          });
        } catch (err) {
          console.log("INTERVAL request failed : " + err);
        }

        // Iteration limits
        count++;
        if (iterations > 0) {
          if (count == iterations) {
            console.log(`exiting after ${count} iterations`);
            clearInterval(intervalObject);
          }
        }
      },
      // interval of requests in milliseconds, see config
      timeInterval
    );
  }
};
