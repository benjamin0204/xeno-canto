const https = require("https");
const fs = require("fs");

for (let x = 0; x < 500; x++) {
  getmp3(x);
}

function getmp3(count) {
  fs.readFile(`./urls/test${count}-url.json`, (err, data) => {
    if (err) {
      // printing list of files that had an error
      // formating for 10, 100 and 1000
      if (count < 10) {
        console.log(err.path.toString().slice(-14));
      } else if (count < 100) {
        console.log(err.path.toString().slice(-15));
      } else if (count < 1000) {
        console.log(err.path.toString().slice(-16));
      }
      return;
    }
    url = data.toString();
    url = "https:".concat(url);
    https.get(url, function (res) {
      const filestream = fs.createWriteStream(`./sounds/test${count}.mp3`);
      res.pipe(filestream);
      filestream.on("finish", function () {
        filestream.close();
      });
    });
  });
}
