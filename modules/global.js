const lowdb = require("lowdb");
const cooldowns = require("../settings/cooldowns.json");
const settings = require("../settings/settings.js");
const FileSync = require("lowdb/adapters/FileSync");
const changelog = lowdb(new FileSync("settings/changelog.json"));

module.exports = {
  autoWoot: "",
  autoSkip: "",
  timeGuard: "",
  lottery: "",
  urbanDictionary: "",
  ads: "",
  voteSystem: "",
  welcomes: "",
  toggleKeyword: "",
  toggleTitle: "",
  cooldownChanged: false,
  cooldownError: "",
  cooldownSuccess: "",
  getTime: function (a) {
    let b = a % 60,
      c = Math.floor(a / 36e2),
      d = Math.floor(a / 864e2);
    if (a < 36e2)
      return (
        (a / 60 < 10 ? "0" : "") +
        Math.floor(a / 60) +
        " m " +
        (b < 10 ? "0" : "") +
        Math.floor(b) +
        " s"
      );
    a -= c * 36e2;
    b = a % 60;
    c -= d * 24;
    return (
      (d > 0 ? d + " d " + (d === 1 ? "" : "s") + " and " : "") +
      (c < 10 ? "0" : "") +
      Math.floor(c) +
      " h " +
      (a / 60 < 10 ? "0" : "") +
      Math.floor(a / 60) +
      " m " +
      (b < 10 ? "0" : "") +
      Math.floor(b) +
      " s"
    );
  },
  commandCooldown: function () {
    cooldowns.cmd = true;
    setTimeout(() => (cooldowns.cmd = false), settings.cooldownCmd * 1000);
  },
  shotCooldown: function () {
    cooldowns.shot = true;
    setTimeout(() => cooldowns.shot = false, 10000);
  },
  motdCooldown: function () {
    cooldowns.motd = true;
    setTimeout(() => cooldowns.motd = false, 20000);
  },
  adCooldown: function () {
    cooldowns.ad = true;
    setTimeout(() => cooldowns.ad = false, 2500000);
  },
  getSettings: function () {
    settings.toggleAutowoot ? this.autoWoot = "on" : this.autoWoot = "off";
    settings.toggleAutoskip ? this.autoSkip = "on" : this.autoSkip = "off";
    settings.toggleTimeguard ? this.timeGuard = "on" : this.timeGuard = "off";
    settings.toggleLottery ? this.lottery = "on" : this.lottery = "off";
    settings.toggleVoteSystem ? this.voteSystem = "on" : this.voteSystem = "off";
    settings.toggleUrban ? this.urbanDictionary = "on" : this.urbanDictionary = "off";
    settings.toggleAds ? this.ads = "on" : this.ads = "off";
    settings.toggleWelcomes ? this.welcomes = "on" : this.welcomes = "off";
  },
  toggleSettings: function (toToggle) {
    switch (toToggle) {
    case "woot":
    case "autowoot":
      settings.toggleAutowoot ? settings.toggleAutowoot = false : settings.toggleAutowoot = true;
      settings.toggleAutowoot ? this.toggleKeyword = "enabled" : this.toggleKeyword = "disabled";
      this.toggleTitle = "Autowoot"
      settings.updateAutowoot();
      break;
    case "autoskip":
    case "skip":
      settings.toggleAutoskip ? settings.toggleAutoskip = false : settings.toggleAutoskip = true;
      settings.toggleAutoskip ? this.toggleKeyword = "enabled" : this.toggleKeyword = "disabled";
      this.toggleTitle = "Autoskip"
      settings.updateAutoskip();
      break;
    case "timeguard":
      settings.toggleTimeguard ? settings.toggleTimeguard = false : settings.toggleTimeguard = true;
      settings.toggleTimeguard ? this.toggleKeyword = "enabled" : this.toggleKeyword = "disabled";
      this.toggleTitle = "Timeguard"
      settings.updateTimeguard();
      break;
    case "vote":
    case "voting":
      settings.toggleVoteSystem ? settings.toggleVoteSystem = false : settings.toggleVoteSystem = true;
      settings.toggleVoteSystem ? this.toggleKeyword = "enabled" : this.toggleKeyword = "disabled";
      this.toggleTitle = "Vote System"
      settings.updateAutowoot();
      break;
    case "lottery":
    case "lotto":
      settings.toggleLottery ? settings.toggleLottery = false : settings.toggleLottery = true;
      settings.toggleLottery ? this.toggleKeyword = "enabled" : this.toggleKeyword = "disabled";
      this.toggleTitle = "Lottery"
      settings.updateLottery();
      break;
    case "urban":
    case "urbandictionary":
      settings.toggleUrban ? settings.toggleUrban = false : settings.toggleUrban = true;
      settings.toggleUrban ? this.toggleKeyword = "enabled" : this.toggleKeyword = "disabled";
      this.toggleTitle = "Urban Dictionary"
      settings.updateUrban();
      break;
    case "ads":
    case "ad":
      settings.toggleAds ? settings.toggleAds = false : settings.toggleAds = true;
      settings.toggleAds ? this.toggleKeyword = "enabled" : this.toggleKeyword = "disabled";
      this.toggleTitle = "Bot advertisements"
      settings.updateAds();
      break;
    case "welcomes":
    case "welcome":
      settings.toggleWelcomes ? settings.toggleWelcomes = false : settings.toggleWelcomes = true;
      settings.toggleWelcomes ? this.toggleKeyword = "enabled" : this.toggleKeyword = "disabled";
      this.toggleTitle = "Welcome Messages"
      settings.updateWelcomes();
      break;
    case "history":
      settings.toggleHistory ? settings.toggleHistory = false : settings.toggleHistory = true;
      settings.toggleHistory ? this.toggleKeyword = "enabled" : this.toggleKeyword = "disabled";
      this.toggleTitle = "History protection"
      settings.updateHistory();
      break;
    case "genreguard":
    case "genre":
      settings.toggleGenreGuard ? settings.toggleGenreGuard = false : settings.toggleGenreGuard = true;
      settings.toggleGenreGuard ? this.toggleKeyword = "enabled" : this.toggleKeyword = "disabled";
      this.toggleTitle = "Genre protection"
      settings.updateGenreGuard();
      break;
    case "event":
      this.eventToggle();
      settings.toggleEvent ? this.toggleKeyword = "enabled" : this.toggleKeyword = "disabled";
      this.toggleTitle = "Event Mode"
      settings.updateEvent();
      break;
    default:
      this.toggleTitle = "Invalid usage."
      this.toggleKeyword = "!toggle [keyword]"
    }

  },
  eventToggle: function () {
    if (!settings.toggleEvent) {
      settings.toggleEvent = true;
      settings.toggleTimeguard = false;
      settings.cooldowmCmd = 10;
      settings.toggleAds = false;
      settings.toggleWelcomes = false;
    } else if (settings.toggleEvent) {
      settings.toggleEvent = false;
      settings.toggleTitle = true;
      settings.cooldowmCmd = 5;
      settings.toggleAds = true;
      settings.toggleWelcomes = true;
    }

  },
  getCooldown: function (toCooldown, timeCooldown) {
    this.cooldownChanged = false;
    switch (toCooldown) {
    case "command":
    case "cmd":
    case "commands":
      if (!isNaN(timeCooldown) && timeCooldown <= 30 && timeCooldown > 0) {
        settings.cooldownCmd = timeCooldown;
        this.cooldownChanged = true;
        this.cooldownSuccess = `Global command cooldown is now set to ${settings.cooldownCmd}s`
        settings.updateCooldownCmd()
      } else {
        this.cooldownError = "Commamd cooldown time must range from 1 to 30s."
        this.cooldownChanged = false;
      }
      break;
    case "dc":
    case "disconnect":
      if (!isNaN(timeCooldown) && timeCooldown <= 60 && timeCooldown >= 15) {
        settings.cooldownDC = timeCooldown;
        this.cooldownChanged = true;
        this.cooldownSuccess = `Global disconnect cooldown now set to ${settings.cooldownDC}m.`
        settings.updateCooldownDC();
      } else {
        this.cooldownError = "DC cooldown time must range from 15 to 60m."
        this.cooldownChanged = false;
      }
      break;
    default:
      this.cooldownChanged = false;
      this.cooldownError = 'Invalid usage. !cooldown [item] [time]';
    }
  },
  updateVersion: function (version) {
    let split = version.split('.');
    let firstNumber = Number(split[0]),
      secondNumber = Number(split[1]),
      thirdNumber = Number(split[2]);
    if (thirdNumber < 99) {
      thirdNumber++;
    } else if (thirdNumber === 99) {
      secondNumber++;
      thirdNumber = 0;
    }
    settings.version = `${firstNumber}.${secondNumber}.${thirdNumber}`;
    settings.updateVersion();
  },
  updateVersionInformation: function (notes) {
    changelog.get('versions').push({
      version: settings.version,
      notes: notes
    }).write();

  }
};