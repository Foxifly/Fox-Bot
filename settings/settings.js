const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const bs = lowdb(new FileSync("settings/botsettings.json"));

module.exports = {
  plugEmail: bs.get('settings[0].plugEmail').value(),
  plugPassword: bs.get('settings[0].plugPassword').value(),
  version: bs.get('settings[0].version').value(),
  toggleAutowoot: bs.get('settings[0].toggleAutowoot').value(),
  toggleAutoskip: bs.get('settings[0].toggleAutoskip').value(),
  toggleTimeguard: bs.get('settings[0].toggleTimeguard').value(),
  toggleLottery: bs.get('settings[0].toggleLottery').value(),
  toggleAds: bs.get('settings[0].toggleAds').value(),
  toggleWelcomes: bs.get('settings[0].toggleWelcomes').value(),
  toggleEvent: bs.get('settings[0].toggleEvent').value(),
  toggleGenreGuard: bs.get('settings[0].toggleGenreGuard').value(),
  toggleMotds: bs.get('settings[0].toggleMotds').value(),
  toggleUrban: bs.get('settings[0].toggleUrban').value(),
  toggleCleverBot: bs.get('settings[0].toggleCleverBot').value(),
  toggleVoteSystem: bs.get('settings[0].toggleVoteSystem').value(),
  toggleHistory: bs.get('settings[0].toggleHistory').value(),
  cooldownCmd: bs.get('settings[0].cooldownCmd').value(),
  cooldownDC: bs.get('settings[0].cooldownDC').value(),
  translatorKey: bs.get('settings[0].translatorKey').value(),
  scKey: bs.get('settings[0].scKey').value(),
  cleverbotKey: bs.get('settings[0].cleverbotKey').value(),
  imgFlipUsername: bs.get('settings[0].imgFlipUsername').value(),
  imgFlipPassword: bs.get('settings[0].imgFlipPassword').value(),
  trelloKey: bs.get('settings[0].trelloKey').value(),
  trelloToken: bs.get('settings[0].trelloToken').value(),
  roomName: bs.get('settings[0].roomName').value(),
  eventString: bs.get('settings[0].eventString').value(),
  updateAutoskip: function () {
    bs.get('settings')
      .find({ userID: 3609549 })
      .assign({ toggleAutoskip: this.toggleAutoskip })
      .write()
  },
  updateAutowoot: function () {
    bs.get('settings')
      .find({ userID: 3609549 })
      .assign({ toggleAutowoot: this.toggleAutowoot })
      .write()
  },
  updateAds: function () {
    bs.get('settings')
      .find({ userID: 3609549 })
      .assign({ toggleAds: this.toggleAds })
      .write()
  },
  updateTimeguard: function () {
    bs.get('settings')
      .find({ userID: 3609549 })
      .assign({ toggleTimeguard: this.toggleTimeguard })
      .write()
  },
  updateLottery: function () {
    bs.get('settings')
      .find({ userID: 3609549 })
      .assign({ toggleLottery: this.toggleLottery })
      .write()
  },
  updateWelcomes: function () {
    bs.get('settings')
      .find({ userID: 3609549 })
      .assign({ toggleWelcomes: this.toggleWelcomes })
      .write()
  },
  updateEvent: function () {
    bs.get('settings')
      .find({ userID: 3609549 })
      .assign({ toggleEvent: this.toggleEvent })
      .write()
  },
  updateGenreGuard: function () {
    bs.get('settings')
      .find({ userID: 3609549 })
      .assign({ toggleGenreGuard: this.toggleGenreGuard })
      .write()
  },
  updateUrban: function () {
    bs.get('settings')
      .find({ userID: 3609549 })
      .assign({ toggleUrban: this.toggleUrban })
      .write()
  },
  updateVoteSystem: function () {
    bs.get('settings')
      .find({ userID: 3609549 })
      .assign({ toggleVoteSystem: toggleVoteSystem })
      .write()
  },
  updateCooldownCmd: function () {
    bs.get('settings')
      .find({ userID: 3609549 })
      .assign({ cooldownCmd: this.cooldownCmd })
      .write()
  },
  updateCooldownDC: function () {
    bs.get('settings')
      .find({ userID: 3609549 })
      .assign({ cooldownDC: this.cooldownDC })
      .write()
  },
  updateVersion: function () {
    bs.get('settings')
      .find({ userID: 3609549 })
      .assign({ version: this.version })
      .write()
  },
  updateMOTDs: function () {
    bs.get('settings')
      .find({ userID: 3609549 })
      .assign({ toggleMotds: this.toggleMotds })
      .write()
  },
  updateCleverBot: function () {
    bs.get('settings')
      .find({ userID: 3609549 })
      .assign({ toggleCleverBot: this.toggleCleverBot })
      .write()
  },
  updateHistory: function () {
    bs.get('settings')
      .find({ userID: 3609549 })
      .assign({ toggleHistory: this.toggleHistory })
      .write()
  },
  updateEvent: function () {
    bs.get('settings')
      .find({ userID: 3609549 })
      .assign({ eventString: this.eventString })
      .write()
  }
}