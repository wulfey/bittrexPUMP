var readline = require("readline");
var IntervalQueries = require("./intervalQueries");

// add in default config options

module.exports = {
  // primary query on main API URI
  menuRunner: () => {
    var configOptions = {
      percentDif: 0.3,
      timeInterval: 10000,
      iterations: 100
    };

    // Declaring Variables
    var timeIntervalSecs;

    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    //=====================================================
    //Menu Questions
    //=====================================================
    function iterationsQuestion() {
      rl.question("How many iterations to run?\n", function(answer) {
        configOptions.iterations = answer;
        recursiveAsyncReadLine();
      });
    }

    function intervalQuestion() {
      rl.question("How seconds per iteration?\n", function(answer) {
        configOptions.timeInterval = answer * 1000;
        timeIntervalSecs = answer;
        recursiveAsyncReadLine();
      });
    }

    function percentToCheck() {
      rl.question("What percent spike to look for:\n", function(answer) {
        configOptions.percentDif = answer;
        console.log("\n");
        recursiveAsyncReadLine();
      });
    }

    function viewParameters() {
      console.log(`Iterations = ${configOptions.iterations}`);
      console.log(`Intervals = ${configOptions.timeInterval} milliseconds`);
      console.log(`Percentage Spike = ${configOptions.percentDif}`);
      console.log("\n");
    }

    //============================================
    //Main Menu
    //============================================
    var recursiveAsyncReadLine = function() {
      rl.question(
        "Menu:\n" +
          "1) Set Iterations\n" +
          "2) Set Interval between Interations\n" +
          "3) Set Percent Difference in Price\n" +
          "4) View Parameters\n" +
          "5) Run Bot\n" +
          "6) Exit\n",
        function(line) {
          switch (line) {
            case "1":
              iterationsQuestion();
              break;
            case "2":
              intervalQuestion();
              break;
            case "3":
              percentToCheck();
              break;
            case "4":
              viewParameters();
              break;
            case "5":
              console.log(`Using the following options: `);
              console.log(`percentDif: ${configOptions.percentDif}`);
              console.log(
                `timeInterval: ${configOptions.timeInterval} milliseconds`
              );
              console.log(`iterations: ${configOptions.iterations}`);
              console.log("---------------");
              return IntervalQueries.intervalQueryRunner(configOptions);
              break;
            case "6":
              return rl.close();
              break;
            default:
              console.log("No such option. Please enter another: ");
          }
          recursiveAsyncReadLine(); //Calling this function again to ask new question
        }
      );
    };

    //Call Function to Execute
    recursiveAsyncReadLine();
  }
};
