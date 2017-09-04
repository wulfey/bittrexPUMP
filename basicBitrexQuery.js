// install node
// install npm
// move to directory
// : npm init
// : npm install
// : npm install --save node.bittrex.api"
// : node basicBitrexQuery.js
// this will dump the basic query into the console

const keys = require("./keys");
var request = require("request-promise");
var bittrex = require("./node.bittrex.api");
const TEST_URI = "https://bittrex.com/api/v1.1/public/getmarketsummaries";

bittrex.options({
  apikey: keys.API_KEY,
  apisecret: keys.API_SECRET
});

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

bittrex.getcandles(
  {
    marketName: "USDT-BTC",
    tickInterval: 5000
  },
  function(data, err) {
    if (err) {
      /**
      {
        success: false,
        message: 'INVALID_TICK_INTERVAL',
        result: null 
      }
    */
      return console.error(err);
    }
    // console.log(data);
  }
);

var reqOptions = {
  method: "GET",
  uri: TEST_URI,
  headers: {
    "user-agent": "node.js"
  },
  json: true
};

var count = 0;
var intervalObject = setInterval(function() {
  request(reqOptions)
    .then(function(parsedBody) {
      console.log("Got response : " + JSON.stringify(parsedBody, null, 2));
    })
    .catch(function(err) {
      console.log("request failed : " + err);
    });
  console.log("Iterations: " + count);
  count++;
}, 1000);
