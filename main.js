/** Dependencies */
var XenoCanto = require("./lib/xeno-canto");
const https = require("https");
const fs = require("fs");
const { start } = require("repl");

// /** A simple search with English common name */
// var beardedBellbird = new XenoCanto();

// let arr;

// beardedBellbird.search("bearded bellbird", function (self) {
//   if (self.entity.id === "1422") {
//   }
//   console.log(self.entity);
//   console.log("numRecordings: " + self.entity.numRecordings);
//   console.log("numSpecies: " + self.entity.numSpecies);
// });

var orthonyxPaupuaTari = new XenoCanto();

var query = {
  //   name: "orthonyx",
  country: "brazil",
  //   location: "tari",
};

orthonyxPaupuaTari.search("Podicipedidae", function (self) {
  // inspect the response object
  let numRecordings = self.entity.numRecordings;
  if (numRecordings.length != 0) {
    let urls = [];
    // saving the urls in a seperate array

    if (numRecordings > 500) {
      for (let x = 0; x < 500 - 1; x++) {
        urls.push(self.entity.recordings[x].file);
      }
    } else {
      for (let x = 0; x < numRecordings - 1; x++) {
        urls.push(self.entity.recordings[x].file);
      }
    }

    let count = 0;
    urls.forEach((url) => {
      // removing the random characters from the url
      url = "https:".concat(url);

      https.get(url, function (res) {
        // gets the html file and saves it as json
        write(res, count);
        // reads the new json file and processes the url string
        read(count);

        count++;
      });
    });
  } else {
    console.log("You may have entered an bird that isnt in the db");
  }
});

// fetching the files

function write(res, count) {
  const filestream = fs.createWriteStream(`./json/test${count}.json`);
  res.pipe(filestream);
  filestream.on("finish", function () {
    filestream.close();
  });
}

function read(count) {
  fs.readFile(`./json/test${count}.json`, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    // grabs the url
    let hasUrl = data.toString().trim().indexOf("//w");

    if (hasUrl != -1) {
      data = data.toString().trim().slice(118);
      let endOfUrl = data.indexOf("/>");
      url = data.slice(2, endOfUrl - 3);
      let filename = `./urls/test${count}-url.json`;
      fs.writeFile(filename, url, (err) => {
        if (err) {
          console.log("Error writing file", err);
        } else {
          console.log(`Successfully wrote file ${filename}`);
        }
      });
    }
  });
}
