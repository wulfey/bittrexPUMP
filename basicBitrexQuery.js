// install node
// install npm
// move to directory
// : npm init
// : npm install
// : npm install --save node.bittrex.api"
// : node basicBitrexQuery.js
// this will dump the basic query into the console

const keys = require("./keys");

var bittrex = require("node.bittrex.api");
bittrex.options({
  apikey: keys.API_KEY,
  apisecret: keys.API_SECRET
});

bittrex.getmarketsummaries(function(data, err) {
  if (err) {
    return console.error(err);
  }

  console.log(data);

  for (var i in data.result) {
    bittrex.getticker({ market: data.result[i].MarketName }, function(ticker) {
      // console.log(ticker);
    });
  }
});
