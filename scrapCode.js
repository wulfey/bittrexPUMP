
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