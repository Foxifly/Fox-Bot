const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const songLogs = lowdb(new FileSync("databases/songs/songlogs.json"));
const dba = require("../database_modules/dbaccess.js");
module.exports = {
  lockskipReason: "",
  blockedWords: ['bass boost', 'bass boosted', 'bassboost', 'amv', 'a m v', 'nightcore', 'night core', 'nightstep', 'night step'],
  banWords: ['earrape', 'ear rape', 'girl moaning', 'woman moaning', 'gemidao do zap'],
  genreViolation: false,
  genreViolators: [],
  violationLimit: false,
  historyViolators: [],
  historySkip: false,
  banUser: false,
  gotBanned: [],
  getLockskipReason: function (msg) {
    switch (msg) {
    case "theme":
      this.lockskipReason = "[Room Theme]"
      break;
    case "history":
      this.lockskipReason = "[DJ History]"
      break;
    case "sound":
      this.lockskipReason = "[Song Unavailable]"
      break;
    case "request":
      this.lockskipReason = "[User Requested]"
      break;
    default:
      this.lockskipReason = ""
    }
  },
  genreCheck: function (title, author, userID) {
    this.genreViolation = false;
    this.banUser = false;
    this.banWords.map(word => {
      if (title.indexOf(word) > -1 || author.indexOf(word) > -1) {
        this.banUser = true;
      }

    })
    if (this.banUser) {
      this.gotBanned.push(userID);
    } else {
      this.blockedWords.map(word => {
        if (title.indexOf(word) > -1 || author.indexOf(word) > -1) {
          this.genreViolation = true;
          this.violationCheck(userID);
        }
      })
    }
  },

  violationCheck: function (userID) {
    this.violationLimit = false
    if (this.genreViolators.length > 0) {
      this.genreViolators.map(violator => {
        if (violator.userID == userID) {
          violator.count++;
          if (violator.count >= 2) {
            this.violationLimit = true;
            this.resetGenreViolations(violator);
          }
        } else {
          this.genreViolators.push({
            userID: userID,
            count: 1
          })
          this.timeoutReset(userID);
        }
      })
    } else {
      this.genreViolators.push({
        userID: userID,
        count: 1
      });
      this.timeoutReset(userID);
    }
  },
  historyCheck: function (userID) {
    this.historySkip = false
    if (this.historyViolators.length > 0) {
      this.historyViolators.map(violator => {
        if (violator.userID == userID) {
          violator.count++;
          if (violator.count >= 2) {
            this.historySkip = true;
            this.resetHistoryViolations(violator);
          }
        } else {
          this.historyViolators.push({
            userID: userID,
            count: 1
          })
          this.timeoutHistoryReset(userID);
        }
      })
    } else {
      this.historyViolators.push({
        userID: userID,
        count: 1
      })
      this.timeoutHistoryReset(userID);
    }

  },
  resetGenreViolations: function (violator) {
    let violatorIndex = this.genreViolators.indexOf(violator);
    this.genreViolators.splice(violatorIndex, 1);
  },
  resetHistoryViolations: function (violator) {
    let violatorIndex = this.historyViolators.indexOf(violator);
    this.historyViolators.splice(violatorIndex, 1);
  },
  timeoutReset: function (userID) {
    setTimeout(() => {
      if (this.genreViolators.length > 0) {
        this.genreViolators.map(violator => {
          if (violator.userID == userID) {
            let violatorIndex = this.genreViolators.indexOf(violator);
            this.genreViolators.splice(violatorIndex, 1);
          }
        })
      }
    }, 2700000)
  },
  timeoutHistoryReset: function (userID) { //I WAS HERE
    setTimeout(() => {
      if (this.historyViolators.length > 0) {
        this.historyViolators.map(violator => {
          if (violator.userID == userID) {
            let violatorIndex = this.historyViolators.indexOf(violator);
            this.historyViolators.splice(violatorIndex, 1);
          }
        })
      }
    }, 2700000)
  },
  addNewSongLog: function (songName, songArtist, songCID, songID, dateTime, timesPlayed) {
    songLogs.get('songs').push({
      name: songName,
      artist: songArtist,
      cid: songCID,
      id: songID,
      lastplayed: dateTime,
      timesplayed: timesPlayed
    }).write();
  },
  updateSongLog: function (songCID, dateTime) {
    let addLog = songLogs.get('songs').find({ cid: songCID }).map().value();
    let newTimesPlayed = addLog[5] + 1;
    songLogs.get('songs').find({ cid: songCID }).assign({ lastplayed: dateTime, timesplayed: newTimesPlayed }).write();
  }
}