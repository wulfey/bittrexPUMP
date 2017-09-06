const request = require("request-promise");
const DEFAULT_URI = "https://bittrex.com/api/v1.1/public/getmarketsummaries";

var defaultReqOptions = {
  method: "GET",
  uri: DEFAULT_URI,
  headers: {
    "user-agent": "node.js"
  },
  json: true
};

module.exports = {
  // primary query on main API URI
  queryBittrex: async (reqOptions = defaultReqOptions, URI = DEFAULT_URI) => {
    // allows submission of other URIs to overload defaults
    reqOptions.uri = URI;

    try {
      let JSONResults = await request(reqOptions);

      return JSONResults;
    } catch (err) {
      console.log("queryBittrex API cal failed : " + err);
    }
  }
};
