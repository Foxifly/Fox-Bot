const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
module.exports = {
  songString: "",
  songCount: 0,
  getSongData: function (songCID) {
    const songLogs = lowdb(new FileSync("databases/songs/songlogs.json"));
    this.songString = "";
    let findSongCID = songLogs.get('songs').find({
      cid: songCID
    }).value();
    if (findSongCID == undefined) {
      this.songString = "Cound not find that track CID. Please verify it and try again."
    } else {
      let cidCheck = songLogs
        .get("songs")
        .find({ cid: songCID })
        .map()
        .value();
      let title = cidCheck[0],
        artist = cidCheck[1],
        lastPlayed = cidCheck[4],
        timesPlayed = cidCheck[5];
      this.songString = `Title: ${title} | Artist: ${artist} | Last Played: ${lastPlayed} | Times Played: ${timesPlayed}`;
    }
  },
  getSongTotals: function () {
    const songLogs = lowdb(new FileSync("databases/songs/songlogs.json"));
    this.songCount = songLogs
      .get("songs")
      .size()
      .value();
  },
  userString: "",
  getUserData: function (userID) {
    const seenUsers = lowdb(new FileSync("databases/users/seenusers.json"));
    let numUserID = Number(userID);
    let findUsers = seenUsers.get('seenusers').find({
      userid: numUserID
    }).value();

    if (findUsers == undefined) {
      this.userString = "Cound not find that user. Please verify the User ID and try again."
    } else {
      const userInfo = seenUsers
        .get("seenusers")
        .find({ userid: numUserID })
        .map()
        .value();
      let previousNames = userInfo[12];
      let lastSeen = userInfo[11];
      if (lastSeen && previousNames) {
        this.userString = `${userInfo[0]} (${userID}) was last seen ${lastSeen} Other names you might recognize: ${previousNames}`
      } else if (lastSeen) {
        this.userString = `${userInfo[0]} (${userID}) was last seen ${lastSeen}.`;
      } else {
        this.userString = `I haven't seen ${userID} since my 2.0 update. Unable to retrieve their previous names and last seen information.`
      }
    }
  }
}