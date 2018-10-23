const settings = require("../../settings/botsettings.json");
const cooldowns = require("../../settings/cooldowns.json");

module.exports = {
  lotteryAnnounce: "/me [LOTTERY] It's lottery time! Type !lottery in the next 3 minutes to win a waitlist boost.",
  lotteryHelp: "A lottery is hosted every hour between XX:00-XX:03. To enter, type !lottery. Winners are given a waitlist boost.",
  lotteryEntries: [],
  isEntered: false,
  entryMessage: "",
  winnerMessage: "",
  isWinner: false,
  winnerID: 0,
  isDJ: false,
  isLeave: false,
  lotteryAnnounceCooldown: function () {
    cooldowns.lottery = true;
    setTimeout(() => cooldowns.lottery = false, 100000);
  },
  lotteryEntryCooldown: function () {
    cooldowns.lottery3 = false;
    setTimeout(() => cooldowns.lottery3 = true, 5000);
  },
  lotteryWinnerCooldown: function () {
    cooldowns.lottery2 = true;
    setTimeout(() => cooldowns.lottery2 = false, 100000);
  },
  enterLottery: function (userID) {
    if (this.lotteryEntries.indexOf(userID) > -1) {
      this.isEntered = false;
      this.entryMessage = "You are already entered.";
      this.lotteryEntryCooldown();
    } else if (this.lotteryEntries.indexOf(userID) === -1) {
      this.isEntered = true;
      this.lotteryEntries.push(userID);
      this.entryMessage = "Entered successfully."
      this.lotteryEntryCooldown();
    }
  },
  getWinner: function (djID) {
    if (this.lotteryEntries.length >= 2) {
      this.isWinner = true;
      this.winnerID = this.lotteryEntries[Math.floor(Math.random() * this.lotteryEntries.length)];
      if (djID == this.winnerID) {
        this.isDJ = true;
        this.winnerMessage = "You're the winner, but you're djing. Have some candy, instead.";
      } else {
        this.isDJ = false;
        this.winnerMessage = "You've won the lottery!"
      }
    } else {
      this.isWinner = false;
      this.winnerMessage = "Insufficient entries.";
    }
    setTimeout(() => { this.resetLottery(); }, 10000);
  },
  resetLottery: function () {
    this.lotteryEntries = [];
    this.isEntered = false;
    this.entryMessage = "";
    this.winnerMessage = "";
    this.isWinner = false;
    this.winnerID = 0;
    this.isDJ = false;
  },
  removeEntry: function (userID) {
    let leave = this.lotteryEntries.indexOf(userID)
    if (leave > -1) {
      this.lotteryEntries.splice(leave, 1);
      this.isLeave = true;
    } else {
      this.isLeave = false;
    }
  }

}