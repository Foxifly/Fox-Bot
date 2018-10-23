const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const giveaways = lowdb(new FileSync("databases/fun/giveaway.json"));
module.exports = {
  giveawayUnderway: false,
  giveawayTheme: "",
  giveawayError: "",
  giveawayString: "",
  isError: false,
  starter: "",
  starterID: 0,
  giveawayEntries: [],
  entryStatus: false,
  winner: "",
  isWinner: false,
  duration: 0,
  isLeave: false,
  noGiveaways: "There aren't any giveaways running right now. Start one with !giveaway [duration] [theme]",
  getDuration: function (duration, message, starter, starterID) {
    if (duration >= 10 && duration <= 20) {
      this.isError = false;
      this.starter = starter;
      this.starterID = starterID;
      this.duration = duration;
      let theme = message.substring(13).trim()
      if (theme == "") {
        this.giveawayTheme = "mystery"
      } else {
        this.giveawayTheme = theme;
      }
      this.checkIfGiveaway();
    } else if (duration < 10 && duration >= 1) {
      this.starter = starter;
      this.starterID = starterID;
      this.isError = false;
      this.duration = duration;
      let theme = message.substring(12).trim()
      if (theme == "") {
        this.giveawayTheme = "mystery"
      } else {
        this.giveawayTheme = theme;
      }
      this.checkIfGiveaway()
    } else {
      this.giveawayError = "Your duration must be between 5 and 20 minutes."
      this.isError = true;
    }
  },
  checkIfGiveaway: function () {
    if (!this.giveawayUnderway) {
      this.isError = false;
      this.giveawayUnderway = true;
      this.startGiveaway();
    } else {
      this.isError = true;
      this.giveawayError = "There is already a giveaway underway."
    }
  },
  startGiveaway: function () {
    this.giveawayString = `[GIVEAWAY] ${this.starter} has started a ${this.giveawayTheme} giveaway! Type !enter to enter the giveaway. Entries will close in ${this.duration} minutes.`;
    this.giveawayUnderway = true;
    this.selectWinner();
  },
  addEntry(userID) {
    if (this.giveawayEntries.indexOf(userID) > -1) {
      this.entryStatus = false;
    } else if (this.giveawayEntries.indexOf(userID) === -1) {
      this.giveawayEntries.push(userID);
      this.entryStatus = true;
    }
  },
  removeEntry(userID) {
    if (this.giveawayEntries.indexOf(userID) > -1) {
      let entryIndex = this.giveawayEntries.indexOf(userID);
      this.giveawayEntries.splice(entryIndex, 1)
      this.isLeave = true;
    } else {
      this.isLeave = false;
    }
  },
  selectWinner: function () {
    if (this.giveawayEntries.length >= 3) {
      let creatorIndex = this.giveawayEntries.indexOf(this.starter);
      this.giveawayEntries.splice(creatorIndex, 1);
      this.winner = this.giveawayEntries[Math.floor(Math.random() * this.giveawayEntries.length)]
      this.giveawayEntries = [];
      this.isWinner = true;
    } else {
      this.winner = "Not enough entries to select a giveaway winner";
      this.isWinner = false;
    }
  },
  pushWinnerDB: function (winnerName) {
    var date = new Date;
    this.giveawayEntries = [];
    giveaways.get('giveaways').push({
      startedBy: this.starter,
      startedByID: this.starterID,
      theme: this.giveawayTheme,
      time: date.toString(),
      duration: this.duration + "min",
      winner: winnerName,
      winnerid: this.winner
    }).write()

  },
  resetGiveaway: function () {
    this.giveawayUnderway = false,
      this.giveawayTheme = "",
      this.giveawayError = "",
      this.giveawayString = "",
      this.isError = false,
      this.starter = "",
      this.starterID = "",
      this.giveawayEntries = [],
      this.entryStatus = false,
      this.winner = "",
      this.duration = 0
  }
}