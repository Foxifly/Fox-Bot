const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const songLogs = lowdb(new FileSync("databases/songs/songlogs.json"));


function deleteDupes() {
  let songCount = songLogs
    .get("songs")
    .size()
    .value();
  for (let i = 0; i < songCount; i++) {
    for (let j = 1; j < songCount; j++) {
      if (songLogs.get(`songs[${i}].cid`).value() === songLogs.get(`songs[${j}].cid`).value()) {
        console.log(i);
        console.log(j);
        if (songLogs.get(`songs[${i}].cid`).value() && i != j) {
          let hi = songLogs.get(`songs[${j}].id`).value();
          let title2 = songLogs.get(`songs[${j}].name`).value();
          let title1 = songLogs.get(`songs[${i}].name`).value();
          songLogs.get('songs').remove({ id: hi }).write()
          console.log("Removed duplicate " + title1 + " " + title2);
        }
      }
    }
  }
}
deleteDupes();