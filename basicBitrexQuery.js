// install node
// install npm
// then install dependencies:
// npm install -g node.bittrex.api
// run by moving terminal to file location, then type "node bittrexPUMP.js"

const API_KEY = require("./keys");

var bittrex = require("node.bittrex.api");
bittrex.options({
  apikey: API_KEY,
  apisecret: API_SECRET
});

bittrex.getticker({ market: data.result[i].MarketName }, function(ticker) {
  console.log(ticker);
});
console.log(data);

bittrex.getmarketsummaries(function(data, err) {
  if (err) {
    return console.error(err);
  }
  for (var i in data.result) {
    bittrex.getticker({ market: data.result[i].MarketName }, function(ticker) {
      // console.log(ticker);
    });
  }
});
