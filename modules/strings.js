const global = require("./global.js");
const settings = require("../settings/settings.js");

module.exports = {
  noBlacklist: "Could not add ID/CID to the blacklist. Make sure it has been played in Fox Den.",
  alreadyBlacklist: "That song has already been blacklisted",
  userIDError: "Error fetching userID. User must be present. !userid @user",
  dbError: "Could not write to the database. Check your syntax",
  settingString: "",
  voteEnabled: "We have the vote system enabled. Vote for your favorite track for a chance to win!",
  rcsEmotes: "Our RCS Emotes: https://foxdenedm.com/emotes",
  commandsLink: "Commands List: https://foxdenedm.com/commands",
  facebook: "Like us! https://www.facebook.com/FoxDenEDM/",
  twitter: "Follow us! https://twitter.com/FoxDenEDM/",
  contact: "Contact us: https://foxdenedm.com/contact",
  blacklist: "Blacklist: https://foxdenedm.com/blacklist",
  discord: "Discord: https://discord.gg/9abAC7N",
  donate: "Donate: https://discord.gg/9abAC7N",
  website: "Our Website: https://foxdenedm.com/donate",
  staffapp: "Staff App: https://foxdenedm.com/staffapp",
  producerapp: "Producer App: https://foxdenedm.com/producerapp",
  rope: "https://foxdenedm.com/images/rope.jpg",
  rules: "Rules: https://foxdenedm.com/rules",
  promoter: " Promoters are assigned a URL specific to their username that is used to bring new users onto plug.dj. You can learn more and apply here: https://goo.gl/68G9QT",
  plot: "pLoT (plug League of Translators) Members provide translations where needed for the website and mobile applications. You can learn more and apply here: https://goo.gl/6awD76",
  ba: "Brand Ambassadors provide full support and assistance by helping answering questions & concerns from users, as well as moderating and upholding the ToS for the site. Learn more: https://goo.gl/jBQo2i",
  sm: "Site Moderators focus on upholding the ToS in many communities. They help many rooms and are closely connected with their Brand Ambassador lead. You can learn more and apply here: https://goo.gl/bcVGC4",
  source: `Version: ${settings.version} | Author: Foxifly | Language: Node.js | Not open source | https://foxdenedm.com/foxbot`,
  shotUnmute: "Fox Bot figured out how to unmute",
  shotMute: "Fox Bot accidentally muted",
  dropZone: ":rotating_light: :construction: :warning: :rotating_light: WARNING: :rotating_light: DROP ZONE INCOMING :rotating_light: :construction: :warning: :rotating_light:",
  botCookie: "I cannot find that user in the room. Guess it's mine! Omnom...",
  stealCookie: "Quit stealing all the cookies for yourself!",
  noCookie: "No thank you. Too many calories.",
  heart1: ":yellow_heart: :green_heart: :blue_heart: :purple_heart: :heart: :heart:  :purple_heart:   :blue_heart:  :green_heart:  :yellow_heart: ",
  heart2: ":heart:  :purple_heart:   :blue_heart:  :green_heart:  :yellow_heart: :yellow_heart: :green_heart: :blue_heart: :purple_heart: :heart: ",
  heart3: ":yellow_heart: :green_heart: :blue_heart: :purple_heart: :heart: :heart:  :purple_heart:   :blue_heart:  :green_heart:  :yellow_heart: ",


  updateString: function () {
    this.settingString = `/me [SETTINGS] Ads: ${global.ads} | AutoSkip: ${global.autoSkip} | AutoWoot: ${global.autoWoot} | Cooldown: ${settings.cooldownCmd}s | DC Time ${settings.cooldownDC} | Lottery: ${global.lottery} | Timeguard: ${global.timeGuard} | Urban: ${global.urbanDictionary} | Voting: ${global.voteSystem} | Welcome: ${global.welcomes}`
  }
}