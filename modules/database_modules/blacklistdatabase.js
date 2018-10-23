const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const blacklist = lowdb(new FileSync("databases/songs/blacklist.json"));
const songLogs = lowdb(new FileSync("databases/songs/songlogs.json"));
const Client = require("ftp");

module.exports = {
  reason: "",
  trackCID: "",
  trackID: "",
  isFound: false,
  alreadyBlacklisted: false,
  currentSong: false,
  getReason: function (msg, username) {
    let toBlacklist = msg.substring(11).trim();
    if (toBlacklist == "" || toBlacklist == " ") {
      this.reason = "No reason given";
      this.currentSong = true;
    } else if (toBlacklist.startsWith("cid")) {
      this.currentSong = false;
      this.trackCID = msg.substring(15).trim();
      if (this.trackCID == "") {
        this.isFound = false;
      } else {
        this.songCIDLookup(this.trackCID, username);
      }
    } else if (toBlacklist.startsWith("id")) {
      this.currentSong = false;
      this.trackID = msg.substring(14).trim();
      if (this.trackID == "") {
        this.isFound = false;
      } else {
        this.songIDLookup(this.trackID, username);
      }
    } else {
      this.currentSong = true;
      this.reason = toBlacklist;
    }
  },
  blacklistWrite: function (
    songName,
    songArtist,
    songCID,
    songID,
    currentDJ,
    currentDjID,
    dateTime,
    whoBlacklisted
  ) {
    blacklist
      .get("songs")
      .push({
        name: songName,
        artist: songArtist,
        reason: this.reason,
        cid: songCID,
        id: songID,
        whoPlayed: currentDJ,
        whoPlayedID: currentDjID,
        whenPlayed: dateTime,
        blacklistedBy: whoBlacklisted
      })
      .write();
  },
  check: function (
    songName,
    songArtist,
    songCID,
    songID,
    currentDJ,
    currentDjID,
    dateTime,
    whoBlacklisted
  ) {
    const blacklistCheck = blacklist
      .get("songs")
      .find({ cid: songCID })
      .value();
    if (blacklistCheck == undefined) {
      this.alreadyBlacklisted = false;
      this.blacklistWrite(
        songName,
        songArtist,
        songCID,
        songID,
        currentDJ,
        currentDjID,
        dateTime,
        whoBlacklisted
      );
    } else {
      this.alreadyBlacklisted = true;
    }
  },
  advanceCheck: function (songID, songCID) {
    const findCIDEntry = blacklist.get('songs').find({ cid: songCID }).value();
    const findIDEntry = blacklist.get('songs').find({ id: songID }).value();
    if (findIDEntry || findCIDEntry) {
      this.isFound = true;
    } else {
      this.isFound = false;
    }

  },
  songCIDLookup: function (cid, whoBlacklisted) {
    const songFind = songLogs
      .get("songs")
      .find({ cid: cid })
      .value();
    if (songFind != undefined) {
      this.isFound = true;
      const getThisLog = songLogs
        .get("songs")
        .find({ cid: cid })
        .map()
        .value();
      const blacklistCheck = blacklist
        .get("songs")
        .find({ cid: cid })
        .value();
      if (blacklistCheck == undefined) {
        this.alreadyBlacklisted = false;
        this.reason = "Added by CID.";
        this.blacklistWrite(
          getThisLog[0],
          getThisLog[1],
          getThisLog[2],
          getThisLog[3],
          null,
          null,
          null,
          whoBlacklisted
        );
      } else {
        this.alreadyBlacklisted = true;
      }
    } else {
      this.isFound = false;
    }
  },
  songIDLookup: function (id, whoBlacklisted) {
    let numID = Number(id);
    const songFind = songLogs
      .get("songs")
      .find({ id: numID })
      .value();
    if (songFind != undefined) {
      this.isFound = true;
      const getThisLog = songLogs
        .get("songs")
        .find({ id: numID })
        .map()
        .value();
      const blacklistCheck = blacklist
        .get("songs")
        .find({ id: numID })
        .value();
      if (blacklistCheck == undefined) {
        this.alreadyBlacklisted = false;
        this.reason = "Added by ID";
        this.blacklistWrite(
          getThisLog[0],
          getThisLog[1],
          getThisLog[2],
          getThisLog[3],
          null,
          null,
          null,
          whoBlacklisted
        );
      } else {
        this.alreadyBlacklisted = true;
      }
    } else {
      this.isFound = false;
    }
  },
  blacklistFileUpdate: function () {
    var c = new Client();
    c.on('ready', function () {
      c.put('blacklist.json', '/public_html/JSON/blacklist.json', function (err) {
        if (err) throw err;
        c.end();
      });
    });
    c.connect({
      host: "ftp.foxdenedm.com",
      user: "foxdened@foxdenedm.com",
      password: "Callie69!!"
    })
  }
};