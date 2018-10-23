const PlugAPI = require("plugapi");

module.exports = {
  banLength: "",
  banKeyword: "",
  forceBanLength: "",
  waitlistBanLength: "",
  waitlistBanKeyword: "",
  muteLength: "",
  muteKeyword: "",
  getBanLength: function (length) {
    switch (length) {
    case "perm":
    case "permanent":
      this.banLength = PlugAPI.BAN.PERMA;
      this.banKeyword = "permanently";
      this.forceBanLength = "f"
      break;
    case "temp":
    case "day":
      this.banLength = PlugAPI.BAN.DAY;
      this.banKeyword = "for a day";
      this.forceBanLength = "d"
      break;
    case "hour":
      this.banLength = PlugAPI.BAN.HOUR;
      this.banKeyword = "for an hour";
      this.forceBanLength = "h"
      break;
    default:
      this.banLength = PlugAPI.BAN.HOUR;
      this.banKeyword = "for an hour";
      this.forceBanLength = "f"
      break;
    }
  },
  getWaitlistBanLength: function (length) {
    switch (length) {
    case "perm":
    case "permanent":
      this.waitlistBanLength = PlugAPI.WLBAN.PERMA;
      this.waitlistBanKeyword = "permanently";
      break;
    case "temp":
    case "day":
    case "24h":
    case "24":
    case 24:
      this.waitlistBanLength = PlugAPI.WLBAN.LONG;
      this.waitlistBanKeyword = "for a day";
      break;
    case "medium":
    case "30m":
    case "30":
    case 30:
      this.waitlistBanLength = PlugAPI.WLBAN.MEDIUM;
      this.waitlistBanKeyword = "for 30 minutes.";
      break;
    case "short":
    case "15m":
    case "15":
    case 15:
      this.waitlistBanLength = PlugAPI.WLBAN.SHORT;
      this.waitlistBanKeyword = "for 15 minutes.";
      break;
    default:
      this.waitlistBanLength = PlugAPI.WLBAN.MEDIUM;
      this.waitlistBanKeyword = "for 30 minutes.";
      break;
    }
  },
  getMuteLength: function (length) {
    switch (length) {
    case "long":
    case "45m":
    case "45":
    case 45:
      this.muteLength = PlugAPI.MUTE.LONG;
      this.muteKeyword = "for 45 minutes.";
      break;
    case "medium":
    case "30m":
    case "30":
    case 30:
      this.muteLength = PlugAPI.MUTE.MEDIUM;
      this.muteKeyword = "for 30 minutes.";
      break;
    case "short":
    case "15m":
    case "15":
    case 15:
      this.muteLength = PlugAPI.MUTE.SHORT;
      this.muteKeyword = "for 15 minutes.";
      break;
    default:
      this.muteLength = PlugAPI.MUTE.MEDIUM;
      this.muteKeyword = "for 30 minutes.";
      break;
    }
  }

}