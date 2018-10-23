/*
A P I
C O N S T A N T S
*/
const PlugAPI = require("plugapi");
const settings = require("./settings/settings.js");
const Client = require("ftp");
const serverFD = require('socket.io-client')('wss://foxdenedm.com:3000', { secure: true, reconnect: true, rejectUnauthorized: false });
const decode = require("unescape");
const cooldowns = require("./settings/cooldowns.json");
const giphy = require("giphy-api")();
const urban = require('urban-dictionary');
const SC = require("node-soundcloud");
SC.init({
  id: settings.scKey
});
const Cleverbot = require('cleverbot');
let cb = new Cleverbot({
  key: settings.cleverbotKey
});

/*
D A T A B A S E S
*/
const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const disconnect = lowdb(new FileSync("databases/users/disconnect.json"));
const bs = lowdb(new FileSync("settings/botsettings.json"));
const songLogs = lowdb(new FileSync("databases/songs/songlogs.json"));

/*
M O D U L E S
*/
const global = require("./modules/global.js");
const arrays = require("./modules/fun_modules/arrays.js");
const strings = require("./modules/strings.js");

//Database Modules
const dbUser = require("./modules/database_modules/userdatabase.js");
const dbBlacklist = require("./modules/database_modules/blacklistdatabase.js");
const db = require("./modules/database_modules/dbmanagement.js");
const dba = require("./modules/database_modules/dbaccess.js");

//Plug Modules
const wm = require("./modules/plug_modules/waitlistManagement.js");
const um = require("./modules/plug_modules/userManagement.js");
const translate = require("./modules/plug_modules/translator.js");
const trello = require("./modules/plug_modules/trello.js");

//Fun modules
const gw = require("./modules/fun_modules/giveaway.js");
const lot = require("./modules/fun_modules/lottery.js");
const motd = require("./modules/fun_modules/motd.js");
const vote = require("./modules/fun_modules/votesystem.js");
const food = require("./modules/fun_modules/foods.js");

/*
G L O B A L
V A R I A B L E S
*/
let startupTime = Date.now(); //used in !uptime
let currentBans = [];
let currentMutes = [];
let oldFashionedMute = [];
let shotArray = [];
let kongArray = [];
let userCount = 0;

const imgflip = require("imgflipper");
const imgflipper = new imgflip(settings.imgFlipUsername, settings.imgFlipPassword);



/*
F O X B O T
L O G I N
*/
new PlugAPI({
    email: settings.plugEmail,
    password: settings.plugPassword
  },
  (err, bot) => {
    if (err) throw new Error(err);
    bot.connect(settings.roomName); // 2143723748321020158
    bot.on("roomJoin", room => {
      bot.sendChat(`[BOOT] Fox Bot version ${settings.version}`);

    });

    bot.deleteAllChat = true;
    bot.deleteCommands = true;
    bot.processOwnMessages = true;
    bot.multiLine = true;
    bot.multiLineLimit = 2;

    serverFD.on('getSiteUpdate', function () {
      if (bot.getMedia() && bot.getDJ()) {
        let title = decode(bot.getMedia().title),
          author = decode(bot.getMedia().author),
          currDJ = bot.getDJ().username;
        dbUser.getUserCount();
        dba.getSongTotals();
        userCount = dbUser.userCount;
        let currUsers = bot.getUsers().length,
          waitlistLength = bot.getWaitList().length + 1,
          songCount = dba.songCount;
        if (serverFD) {
          serverFD.emit('pushSiteUpdate', userCount, currUsers, songCount, waitlistLength, title, author, currDJ);
        }
      }
    });




    function move(userID, pos, toAdd) {
      if (toAdd) {
        bot.moderateAddDJ(userID);
        setTimeout(() => bot.moderateMoveDJ(userID, pos), 2000);
      } else {
        setTimeout(() => bot.moderateMoveDJ(userID, pos), 2000);
      }
    }

    const getCurrentBans = (callback) => {
      currentBans = []
      bot.getBanList(function (d) {
        for (let i = 0; i < d.length; i++) {
          currentBans.push(d[i].id);
        }
        return callback(currentBans);
      })
    }

    const getCurrentBanUsernames = (callback) => {
      currentBans = []
      bot.getBanList(function (d) {
        for (let i = 0; i < d.length; i++) {
          currentBans.push({ id: d[i].id, username: d[i].username });
        }
        return callback(currentBans);
      })
    }

    const getCurrentMutes = (callback) => {
      currentMutes = [];
      bot.getMuteList(function (d) {
        for (let i = 0; i < d.length; i++) {
          currentMutes.push(d[i].id)
        }
        return callback(currentBans);
      })
    }

    let stdin = process.openStdin();
    stdin.addListener("data", (d) => {
      let msg = d.toString().trim();
      if (msg.indexOf('$!') === 0) {
        eval(msg.substr(2));
      } else {
        bot.sendChat(msg);
      }
    });

    setInterval(messageOfTheDay, 60 * 1000);
    /**
     * @name motd
     * @description Display MOTD every ~10 mins.
     */
    bot.on('chat', messageOfTheDay)

    function messageOfTheDay() {
      if (settings.toggleMotds && !cooldowns.motd) {
        let time = new Date().getMinutes()
        if (time == 10 || time == 20 || time == 40 || time == 50) {
          bot.sendChat(`[ALERT] ${motd.motdMessage}`)
          global.motdCooldown();
        }
      }
    };

    /*
    C O H O S T
    H O S T
    C O M M A N D S
    */

    bot.on('command:eval', (data, args, err) => {
      db.checkIfHost(data.from.id);
      if (data.from && !cooldowns.cmd && db.isHost && data.args.length >= 1) {
        let msg = data.message.substr(5).trim();
        try {
          eval(msg);
        } catch (err) {
          bot.sendChat(`/me (${data.from.username}) Error: "${err.message}"`)
        }
        global.commandCooldown();
      }
    });

    bot.on('command:statusreport', (data, args, err) => {
      db.checkIfHost(data.from.id);
      if (data.from && !cooldowns.cmd && db.isHost) {
        if (wm.gotBanned.length > 1) {
          bot.sendChat(`/me [STATUSREPORT] (${data.from.username}) ${wm.gotBanned.length} user(s) got banned for playing severely offensive songs. ${wm.gotBanned}`);
          wm.gotBanned = [];
        } else {
          bot.sendChat(`/me [STATUSREPORT] (${data.from.username}) Everyone has been behaved. No users were banned for playing severly offensive songs.`)
        }

        global.commandCooldown();
      }
    });

    bot.on('command:setevent', (data, ) => {
      db.checkIfHost(data.from.id);
      if (data.from && !cooldowns.cmd && db.isHost) {
        let msg = data.message.substr(10).trim();
        if (msg) {
          settings.eventString = msg;
          settings.updateEvent();
          bot.sendChat(`/me (${data.from.username}) Updated event string successfully. !event's message has been changed.`)
        } else {
          bot.sendChat(`/me (${data.from.username})  Please specify a message to set for the !event command.`)
        }
        global.commandCooldown();
      }
    });

    bot.on('command:version', (data) => {
      db.checkIfHost(data.from.id);
      if (data.from && !cooldowns.cmd && db.isHost) {
        global.updateVersion(settings.version);
        let notes = data.message.substring(9).trim()
        if (notes) {
          global.updateVersionInformation(notes);
          bot.sendChat(`/me [VERSION] Updated to ${settings.version} with notes: ${notes}`)
        } else {
          bot.sendChat(`/me [VERSION] Please enter some notes to describe the version update.`)
        }

        global.commandCooldown();
      }
    });

    bot.on('command:reload', (data, args) => {
      db.checkIfHost(data.from.id);
      if (data.from && !cooldowns.cmd && db.isHost && data.from.id != 4105708) {
        bot.sendChat(`/me [RELOAD] ${data.from.username} Reloading...`)
        process.exit(1);
      }
    });

    bot.on('command:shutdown', (data, args) => {
      db.checkIfHost(data.from.id);
      if (data.from && !cooldowns.cmd && db.isHost && data.from.id != 4105708) {
        bot.sendChat(`/me [SHUTDOWN] (${decode(data.from.username)}) Shutting down...`)
        setTimeout(() => {
          bot.close();
          process.exit(0);
        }, 5000);
      }
    });

    bot.on("command:db", (data, args) => {
      if (data.from.id === 3439856 && data.args.length > 2) {
        let type = data.args[0].trim();
        switch (type) {
        case "add":
          if (data.args.length === 5) {
            db.add(data.args[0], data.args[1], data.args[2], data.args[3], data.args[4]);
          }
          break;
        case "remove":
          if (data.args.length === 3) {
            db.remove(data.args[0], data.args[1], data.args[2]);
            break;
          }
        }
        if (db.success) {
          bot.sendChat(`[DB] (${decode(data.from.username)}) Database edit successful`);
        } else {
          bot.sendChat(`[DB] (${decode(data.from.username)}) ${strings.dbError}`);
        }
      }
    });

    bot.on('command:stafflookup', (data, args) => {
      db.checkIfHost(data.from.id);
      if (data.from && !cooldowns.cmd && db.isHost && data.args.length == 1) {
        dbUser.getStaffData(data.args[0]);
        bot.sendChat(`/me [STAFFLOOKUP] (${decode(data.from.username)}) ${dbUser.staffString}`);
        global.commandCooldown();
      }
    });

    /*
    		M A N A G E R
    		C O M M A N D S
            */

    bot.on('command:cooldown', (data, args) => {
      db.checkIfManagerHost(data.from.id);
      if (data.from && !cooldowns.cmd && db.isManagerHost && data.args.length == 2) {
        const toCooldown = data.args[0].trim(),
          timeCooldown = data.args[1];
        global.getCooldown(toCooldown, timeCooldown);
        if (global.cooldownChanged) {
          bot.sendChat(`/me [COOLDOWN] Success. ${global.cooldownSuccess}`);
        } else {
          bot.sendChat(`/me [COOLDOWN] Failure. ${global.cooldownError}`)
        }
        global.commandCooldown();
      }
    });

    bot.on('command:swap', (data, args) => {
      db.checkIfManagerHost(data.from.id);
      if (data.from && !cooldowns.cmd && db.isManagerHost && data.args.length == 2 && bot.getDJ()) {
        const usernameOne = data.args[0].username,
          usernameTwo = data.args[1].username,
          userIDOne = data.args[0].id,
          userIDTwo = data.args[1].id,
          userOnePosition = bot.getWaitListPosition(userIDOne),
          userTwoPosition = bot.getWaitListPosition(userIDTwo),
          dj = bot.getDJ().id;
        if ('@' + data.args[0].username === data.args[1]) {
          bot.sendChat(`[SWAP] (${data.from.username}) Cannot swap the same user.`);
        } else {
          if (userIDOne && userIDTwo) {
            if (userIDOne == dj || userIDTwo == dj) {
              bot.sendChat(`/me [SWAP] (${data.from.username}) Cannot swap these users. One of them is the DJ.`);
            } else if (userIDOne == userIDTwo) {
              bot.sendChat(`/me [SWAP] (${data.from.username}) Cannot swap the same user.`);
            } else if (userOnePosition == -1 && userTwoPosition > -1) {
              bot.sendChat(`/me [SWAP] (${data.from.username}) Giving ${usernameTwo}'s waitlist position to ${usernameOne} (${userTwoPosition}).`);
              move(userIDOne, userTwoPosition, true);
              setTimeout(() => bot.moderateRemoveDJ(userIDTwo), 3000);
            } else if (userOnePosition > -1 && userTwoPosition == -1) {
              bot.sendChat(`/me [SWAP] (${data.from.username}) Giving ${usernameOne}'s waitlist position to ${usernameTwo} (${userOnePosition}).`);
              move(userIDTwo, userOnePosition, true);
              setTimeout(() => bot.moderateRemoveDJ(userIDOne), 3000);
            } else if (userOnePosition == -1 && userTwoPosition == -1) {
              bot.sendChat(`/me [SWAP] (${data.from}) Neither ${usernameOne} nor ${usernameTwo} are on the waitlist.`);
            } else {
              bot.sendChat(`/me [SWAP] (${data.from}) Swapping waitlist positions for ${usernameOne} (${userOnePosition}) and ${usernameTwo} (${userTwoPosition})`);
              move(userIDOne, userTwoPosition, false)
              setTimeout(() => move(userIDTwo, userOnePosition), false, 2000);
            }
          } else {
            bot.sendChat(`/me [SWAP] (${data.from.username}) Invalid usage. !swap @user1 @user2`)
          }
        }
        global.commandCooldown();
      }
    });

    bot.on('command:clearwl', (data, args) => {
      db.checkIfManagerHost(data.from.id);
      if (data.from && !cooldowns.cmd && db.isManagerHost) {
        bot.moderateLockWaitList(true, true);
        bot.sendChat(`/me [CLEARWL] (${decode(data.from.username)}) Locked and cleared waitlist.`)
        global.commandCooldown();
      }
    });

    bot.on('command:troll', (data, args) => {
      db.checkIfManagerHost(data.from.id);
      if (data.from && !cooldowns.cmd && db.isManagerHost && data.args[0]) {
        const userID = data.args[0].id,
          user = data.args[0].username,
          role = bot.getUser(userID).role;
        if (data.args.length == 1) {
          if (role >= 4000) {
            bot.sendChat(`/me [TROLL] (${decode(data.from.username)}) Can't troll this user.`)
          } else if ((role === 2000 || role === 3000) && data.from.gRole < 1000) {
            bot.sendChat(`/me ${user} Sorry, we don't need your service anymore. Thanks though.`)
            bot.moderateSetRole(userID, 0);
            setTimeout(() => {
              bot.moderateSetRole(userID, role);
              bot.sendChat(`/me [TROLL] ${user} HUEHUEHUE, jk m8. <3`)
            }, 10000);
          } else {
            bot.sendChat(`/me ${user}, Congratulations!`)
            bot.moderateSetRole(userID, 2000);
            setTimeout(() => {
              bot.moderateSetRole(userID, role);
              bot.sendChat(`/me [TROLL] ${user} HUEHUEHUE, jk m8. <3`)
            }, 3000);
          }
        } else {
          bot.sendChat(`/me [TROLL] (${decode(data.from.username)}) Invalid usage. !troll @user`)
        }
        global.commandCooldown();
      }
    });

    bot.on('command:oldmute', (data, args) => {
      db.checkIfManagerHost(data.from.id);
      if (data.from && !cooldowns.cmd && db.isManagerHost && data.args[0]) {
        const userID = data.args[0].id,
          fromUserID = data.from.id,
          username = data.args[0],
          role = bot.getUser(userID).role;
        if (oldFashionedMute.indexOf(userID) > -1) {
          bot.sendChat(`/me [MUTE] (${decode(data.from.username)}) That user is already muted.`)
        } else if (userID === 3609549 || userID === 3439856) {
          bot.sendChat(`/me [MUTE] @${decode(data.from.username)} How about you get muted instead, fam.`)
          oldFashionedMute.push(fromUserID);
          setTimeout(() => {
            let muteIndex = oldFashionedMute.indexOf(fromUserID);
            oldFashionedMute.splice(muteIndex, 1);
            bot.sendChat(`/me [MUTE] Unmuted ${decode(data.from.username)}.`)
          }, 20000)
        } else if (userID === fromUserID) {
          bot.sendChat(`/me [MUTE] (${decode(data.from.username)}) You cannot mute yourself.`)
        } else if (userID) {
          bot.sendChat(`/me [MUTE] (${decode(data.from.username)}) Legacy muted ${username}`)
          oldFashionedMute.push(userID);
        }
        global.commandCooldown();
      }
    });

    bot.on('command:oldunmute', (data, args) => {
      db.checkIfManagerHost(data.from.id);
      if (data.from && !cooldowns.cmd && db.isManagerHost && data.args[0]) {
        const userID = data.args[0].id,
          username = data.args[0].username,
          role = bot.getUser(userID).role;
        if (oldFashionedMute.indexOf(userID) == -1) {
          bot.sendChat(`/me [UNMUTE] (${decode(data.from.username)}) That user is not muted.`)
        } else if (userID === data.from.id) {
          bot.sendChat(`/me [UNMUTE] (${decode(data.from.username)}) You cannot unmute yourself.`)
        } else if (!cooldowns.cmd && userID != undefined) {
          bot.sendChat(`/me [UNMUTE] (${decode(data.from.username)}) Legacy unmuted ${username}.`)
          let muteIndex = oldFashionedMute.indexOf(userID);
          oldFashionedMute.splice(muteIndex, 1);
        }
      }
    });

    bot.on('command:motd', (data) => {
      db.checkIfManagerHost(data.from.id);
      if (data.from && !cooldowns.cmd && db.isManagerHost) {
        let msg = data.message.substr(6).trim();
        motd.getMOTDStatus(msg);
        bot.sendChat(`/me [MOTD] (${decode(data.from.username)}) ${motd.motdResponse}`)
      }
    });

    bot.on('command:gstatus', (data) => {
      db.checkIfManagerHost(data.from.id);
      if (data.from && !cooldowns.cmd && db.isManagerHost) {
        if (gw.giveawayUnderway) {
          bot.sendChat(`/me [GSTATUS] (${decode(data.from.username)}) right now ${gw.starter} is hosting a ${gw.duration} minute ${gw.giveawayTheme} giveaway. User !enter to enter. Current entries: ${gw.giveawayEntries.length}`)
        } else {
          bot.sendChat(`/me [GSTATUS] (${decode(data.from.username)}) ${gw.noGiveaways}`)
        }
        global.commandCooldown();
      }
    });

    bot.on('command:entry', (data, args) => {
      db.checkIfManagerHost(data.from.id);
      if (data.from && !cooldowns.cmd && db.isManagerHost) {
        if (new Date().getMinutes() >= 0 && new Date().getMinutes() <= 2) {
          bot.sendChat(`/me [LOTTERY] (${decode(data.from.username)}) Lottery entries: ${lot.lotteryEntries.length}`)
        } else {
          bot.sendChat(`/me [LOTTERY] (${decode(data.from.username)}) Lottery not in progress.`)
        }
        global.commandCooldown();
      }
    });

    bot.on('command:clearchat', (data, args) => {
      db.checkIfManagerHost(data.from.id);
      if (data.from && !cooldowns.cmd && db.isManagerHost) {
        let chatMsg = bot.getChatHistory();
        chatMsg.map(chat => {
          bot.moderateDeleteChat(chat.raw.cid);
        })
      }
    });

    bot.on('command:check', (data, args) => {
      db.checkIfManagerHost(data.from.id);
      if (data.from && !cooldowns.cmd && db.isManagerHost) {
        if (data.args.length == 1) {
          dba.getSongData(data.message.substring(7).trim());
          bot.sendChat(`/me [CHECK] (${decode(data.from.username)}) ${dba.songString}`);
        } else if (bot.getMedia()) {
          dba.getSongData(bot.getMedia().cid)
          bot.sendChat(`/me [CHECK] (${decode(data.from.username)}) ${dba.songString}`);
        }
        global.commandCooldown();
      }
    });

    bot.on('command:userlookup', (data, args) => {
      db.checkIfManagerHost(data.from.id);
      if (data.from && !cooldowns.cmd && db.isManagerHost && data.args.length == 1) {
        dba.getUserData(data.args[0]);
        bot.sendChat(`/me [USERLOOKUP] (${decode(data.from.username)}) ${dba.userString}`);
        global.commandCooldown();
      }
    });

    /*
    		A L L
    		S T A F F
    		C O M M A N D S
            */

    //Song Management

    bot.on('command:skip', (data) => {
      db.checkIfStaff(data.from.id);
      if (data.from && !cooldowns.cmd && db.isStaff) {
        bot.moderateForceSkip();
        bot.sendChat(`/me [SKIP] (${decode(data.from.username)}) Skipped song.`);
        global.commandCooldown();
      }
    });

    bot.on('command:skiptro', (data) => {
      db.checkIfStaff(data.from.id);
      if (data.from && !cooldowns.cmd && db.isStaff) {
        bot.moderateForceSkip();
        bot.sendChat(`/me [SKIPTRO] (${decode(data.from.username)}) Skipped long or unrelated outro.`);
        global.commandCooldown();
      }
    });

    bot.on('command:lockskip', (data) => { //ADD CYCLE
      db.checkIfStaff(data.from.id);
      if (data.from && !cooldowns.cmd && db.isStaff) {
        let msg = data.message.substr(9).trim();
        let userID = bot.getDJ().id;
        wm.getLockskipReason(msg);
        bot.sendChat(`/me [LOCKSKIP] (${decode(data.from.username)}) Lockskipped song. ${wm.lockskipReason}`);
        bot.moderateForceSkip();
        move(userID, 1, false);
        global.commandCooldown();
      }
    });

    bot.on("command:blacklist", (data, args) => {
      db.checkIfStaff(data.from.id);
      if (data.from && !cooldowns.cmd && db.isStaff === true) {
        if (bot.getMedia() && bot.getDJ()) {
          dbBlacklist.getReason(data.message, data.from.username);
          if (dbBlacklist.currentSong) {
            const userID = bot.getDJ().id;
            const songTitle = bot.getMedia().title;
            const dateTime = new Date(new Date().getTime()).toLocaleString();
            dbBlacklist.check(songTitle, bot.getMedia().author, bot.getMedia().cid, bot.getMedia().id, bot.getDJ().username, userID, dateTime, data.from.username);
            if (dbBlacklist.alreadyBlacklisted) {
              bot.sendChat(`/me [BLACKLIST] (${decode(data.from.username)}) ${strings.alreadyBlacklist}`);
              bot.moderateForceSkip();
              global.commandCooldown();
            } else {
              bot.sendChat(`/me [BLACKLIST] (${decode(data.from.username)}) Added ${songTitle} to the blacklist. Reason: ${dbBlacklist.reason}`);
              bot.moderateForceSkip();
              setTimeout(() => move(userID, 1, false), 2000);
              dbBlacklist.blacklistFileUpdate();
              global.commandCooldown();
            }
          } else {
            if (dbBlacklist.isFound) {
              if (dbBlacklist.alreadyBlacklisted) {
                bot.sendChat(`/me [BLACKLIST] (${decode(data.from.username)}) ${strings.alreadyBlacklist}`);
                global.commandCooldown();
              } else {
                bot.sendChat(`/me [BLACKLIST] (${decode(data.from.username)}) Added that song to the blacklist.`);
                global.commandCooldown();
              }
            } else {
              bot.sendChat(`/me [BLACKLIST] (${decode(data.from.username)}) ${strings.noBlacklist}`);
              global.commandCooldown();
            }
          }

        }
      }
    });

    //User Management

    bot.on("command:users", data => {
      db.checkIfStaff(data.from.id);
      if (data.from && !cooldowns.cmd && db.isStaff === true) {
        dbUser.getUserCount();
        bot.sendChat(`/me [USERS] (${decode(data.from.username)}) Unique user count: ${dbUser.userCount}`);
        global.commandCooldown();
      }
    });

    bot.on('command:userid', (data, args) => {
      db.checkIfStaff(data.from.id);
      if (data.from && !cooldowns.cmd && db.isStaff && data.args[0]) {
        const username = data.args[0].username,
          userID = data.args[0].id;
        if (username && userID) {
          bot.sendChat(`/me [USERID] (${decode(data.from.username)}) ${username} | ${userID}`);
        } else {
          bot.sendChat(`/me [USERID] (${decode(data.from.username)}) ${strings.userIDError}`);
        }
        global.commandCooldown();
      }
    });

    bot.on('command:mute', (data, args) => {
      db.checkIfStaff(data.from.id);
      if (data.from && !cooldowns.cmd && db.isStaff && data.args[0]) {
        const userID = data.args[0].id,
          username = data.args[0].username,
          length = data.args[1],
          role = bot.getUser(userID).role;
        if (userID && role === 0 && data.args.length >= 1) {
          getCurrentMutes(function (mutes) {
            if (currentMutes.indexOf(userID) != -1) {
              bot.sendChat(`/me [MUTE] (${decode(data.from.username)}) That user is already muted.`);
            } else {
              um.getMuteLength(length);
              bot.moderateMuteUser(userID, 1, um.muteLength)
              bot.sendChat(`/me [MUTE] (${decode(data.from.username)}) Muted ${username} ${um.muteKeyword}.`)
            }
          })
        } else if (userID && role > 0) {
          bot.sendChat(`/me [MUTE] (${decode(data.from.username)}) Sorry, I cannot mute staff.`)
        } else {
          bot.sendChat(`/me [MUTE] (${decode(data.from.username)}) Invalid usage. !mute @user [length].`)
        }
        global.commandCooldown();
      }
    });

    bot.on('command:unmute', (data) => {
      db.checkIfStaff(data.from.id);
      if (data.from && !cooldowns.cmd && db.isStaff && data.args.length >= 1) {
        const userID = data.args[0];
        if (data.args.length >= 1 && !isNaN(userID)) {
          getCurrentMutes(function (mutes) {
            if (currentMutes.indexOf(userID) == -1) {
              bot.sendChat(`/me [UNMUTE] (${decode(data.from.username)}) That user is not muted.`);
            } else {
              bot.moderateUnmuteUser(userID);
              bot.sendChat(`/me [UNMUTE] (${decode(data.from.username)}) Unmuted UserID ${userID}.`)
            }
          })
        } else if (data.args.length >= 1 && isNaN(userID)) {
          let mentionedUser = data.args[0].id;
          if (mentionedUser) {
            getCurrentMutes(function (mutes) {
              if (currentMutes.indexOf(mentionedUser) == -1) {
                bot.sendChat(`/me [UNMUTE] (${decode(data.from.username)}) That user is not muted.`);
              } else {
                bot.moderateUnmuteUser(mentionedUser);
                bot.sendChat(`/me [UNMUTE] (${decode(data.from.username)}) Unmuted ${decode(data.args[0].username)}`)
              }
            })
          }
        }
        global.commandCooldown();
      }
    });

    bot.on('command:ban', (data) => {
      db.checkIfStaff(data.from.id);
      db.checkIfManagerHost(data.from.id)
      if (data.from && !cooldowns.cmd && db.isStaff && data.args.length >= 1) {
        let isID = data.args[0],
          userID = data.args[0].id,
          username = data.args[0].username,
          length = data.args[1],
          role = bot.getUser(userID).role,
          forceUserID = data.args[1],
          forceLength = data.args[2],
          forceUserName = "",
          staffName = data.from.username;
        if (isID == "userid" || isID == "id" && data.args.length >= 2 && !isNaN(forceUserID) && db.isManagerHost) {
          bot.forceGetUser(forceUserID, function (user) {
            forceUserName = user.username;
          });
          getCurrentBans(function (bans) {
            if (bans.indexOf(userID) > -1 || bans.indexOf(forceUserID) > -1) {
              bot.sendChat(`/me [BAN] (${decode(data.from.username)}) That user is has already been banned.`);
            } else {
              um.getBanLength(forceLength);
              if (forceUserName) {
                bot.forceBanUser(forceUserID, um.forceBanLength, function (d) {
                  trello.addCard(forceUserName, forceUserID, staffName, "permanently");
                  bot.sendChat(`/me [BAN] (${decode(data.from.username)}) Forcefully banned ${forceUserName} (${forceUserID})`);
                })
              } else {
                bot.sendChat(`/me [BAN] (${decode(data.from.username)}) Invalid User ID. Could not forcefully ban.`);
              }
            }
          })
        } else if (role === 0 && userID) {
          um.getBanLength(length);
          bot.moderateBanUser(userID, 1, um.banLength);
          trello.addCard(username, userID, staffName, um.banKeyword);
          bot.sendChat(`/me [BAN] (${decode(data.from.username)}) Banned ${username} ${um.banKeyword}.`)
        } else if (role > 0 && userID) {
          bot.sendChat(`/me [BAN] (${decode(data.from.username)}) I was told not to ban staff members :c`)
        } else {
          bot.sendChat(`/me [BAN] (${decode(data.from.username)}) Invalid usage. !ban @user [length]`)
        }
      }
      global.commandCooldown();
    });

    bot.on('command:unban', (data) => {
      db.checkIfStaff(data.from.id);
      if (data.from && !cooldowns.cmd && db.isStaff && data.args.length >= 1) {
        const userID = data.args[0];
        if (data.args.length >= 1 && !isNaN(userID)) {
          getCurrentBans(function (bans) {
            if (bans.indexOf(userID) == -1) {
              bot.sendChat(`/me [UNBAN] (${decode(data.from.username)}) That user is not banned.`);
            } else {
              bot.moderateUnbanUser(userID);
              bot.sendChat(`/me [UNBAN] (${decode(data.from.username)}) Unbanned UserID ${userID}.`)
            }
          })
        }
        global.commandCooldown();
      }
    });

    bot.on('command:kick', (data) => {
      db.checkIfStaff(data.from.id);
      if (data.from && !cooldowns.cmd && db.isStaff && data.args.length >= 1) {
        const userID = data.args[0].id,
          username = data.args[0],
          role = bot.getUser(userID).role;
        if (role === 0 && userID) {
          bot.moderateBanUser(userID, 1, PlugAPI.BAN.HOUR)
          bot.sendChat(`/me [KICK] (${decode(data.from.username)}) Kicked ${username}. Unbanning after 30s.`)
          setTimeout(() => bot.moderateUnbanUser(userID), 30000);
        } else if (role < 4000) {
          bot.sendChat(`/me [KICK] (${decode(data.from.username)}) I was told not to kick staff, but ${username} deserves it.`);
          bot.moderateBanUser(userID, 1, PlugAPI.BAN.HOUR);
          setTimeout(() => {
            bot.moderateUnbanUser(userID);
            bot.forcePromote(userID, role, function (d) {});
          }, 30000);
        } else if (role > 4000) {
          bot.sendChat(`/me [KICK] (${decode(data.from.username)}) As much as I want to ban ${username}, I just can't.`);
        } else {
          bot.sendChat(`/me [KICK] (${decode(data.from.username)}) Invalid usage. !kick @user`)
        }
        global.commandCooldown();
      }
    });

    //Waitlist Management

    bot.on('command:lock', (data) => {
      db.checkIfStaff(data.from.id);
      if (data.from && !cooldowns.cmd && db.isStaff) {
        bot.moderateLockWaitList(true, false);
        bot.sendChat(`/me [LOCK] (${decode(data.from.username)}) Locked waitlist.`)
        global.commandCooldown();
      }
    });

    bot.on('command:unlock', (data) => {
      db.checkIfStaff(data.from.id);
      if (data.from && !cooldowns.cmd && db.isStaff) {
        bot.moderateLockWaitList(false, false);
        bot.sendChat(`/me [UNLOCK] (${decode(data.from.username)}) Unlocked waitlist.`)
        global.commandCooldown();
      }
    });

    bot.on('command:move', (data) => {
      db.checkIfStaff(data.from.id);
      if (data.from && !cooldowns.cmd && db.isStaff && data.args[0] && data.args[1]) {
        const userID = data.args[0].id;
        const username = data.args[0].username;
        const position = Math.floor(data.args[1])
        const waitlist = bot.getWaitList().length + 1;
        if (data.args.length === 2 && userID && !isNaN(position) && position > 0 && position <= waitlist && bot.getDJ().id != userID) {
          bot.sendChat(`/me [MOVE] (${decode(data.from.username)}) Moving ${username} to position ${position}`);
          move(userID, position, true);
        } else if (bot.getDJ().id == userID) {
          bot.sendChat(`/me [MOVE] (${decode(data.from.username)}) Cannot move. That user is the DJ.`);
        } else {
          bot.sendChat(`/me [MOVE] (${decode(data.from.username)}) invalid usage. !move @user position`);
        }
        global.commandCooldown();
      }
    });

    bot.on('command:remove', (data) => {
      db.checkIfStaff(data.from.id);
      if (data.from && !cooldowns.cmd && db.isStaff && data.args.length == 1) {
        const userID = data.args[0].id,
          username = data.args[0],
          position = bot.getWaitListPosition(userID);
        if (userID && position != -1) {
          bot.moderateRemoveDJ(userID);
          bot.sendChat(`/me [REMOVE] (${decode(data.from.username)}) Removed ${username}.`);
        } else if (userID && position === -1) {
          bot.sendChat(`/me [REMOVE] (${decode(data.from.username)}) ${username} is not on the waitlist.`);
        } else {
          bot.sendChat(`/me [ADD] (${decode(data.from.username)}) Invalid usage. !remove @user`);
        }
        global.commandCooldown();
      }
    });

    bot.on('command:add', (data) => {
      db.checkIfStaff(data.from.id);
      if (data.from && !cooldowns.cmd && db.isStaff && data.args[0]) {
        const userID = data.args[0].id,
          username = data.args[0],
          position = bot.getWaitListPosition(userID);
        if (userID && position === -1) {
          bot.moderateAddDJ(userID);
          bot.sendChat(`/me [ADD] (${decode(data.from.username)}) Added ${username}.`);
        } else if (userID && position != -1) {
          bot.sendChat(`/me [ADD] (${decode(data.from.username)}) ${username} is already on the waitlist.`);
        } else {
          bot.sendChat(`/me [ADD] (${decode(data.from.username)}) Invalid usage. !add @user`);
        }
        global.commandCooldown();
      }
    });

    //Bot Management
    bot.on("command:uptime", data => {
      db.checkIfStaff(data.from.id);
      if (data.from && !cooldowns.cmd && db.isStaff === true) {
        bot.sendChat(`/me [UPTIME] (${decode(data.from.username)}) Uptime: ${global.getTime((Date.now() - startupTime) / 1e3)}`);
        global.commandCooldown();
      }
    });

    bot.on('command:say', (data) => {
      db.checkIfStaff(data.from.id);
      db.checkIfManagerHost(data.from.id)
      let msg = data.message.substr(4).trim();
      if (data.from && !cooldowns.cmd) {
        if (db.isStaff) {
          if (!msg) {
            bot.sendChat(`[MSG] (${decode(data.from.username)}) Invalid Usage. !say [message]`);
          } else {
            if (db.isManagerHost) {
              bot.sendChat(`[MSG] ${msg}`);
            } else {
              bot.sendChat(`[MSG] Message from ${decode(data.from.username)}: ${data.message.substr(4)}`);
            }
          }
          global.commandCooldown();
        }
      }
    });

    bot.on('command:wlban', (data, args) => {
      db.checkIfStaff(data.from.id);
      if (data.from && !cooldowns.cmd && db.isStaff && data.args[0]) {
        const userID = data.args[0].id,
          username = data.args[0],
          length = data.args[1],
          role = bot.getUser(userID).role;
        if (userID && role === 0 && data.args.length >= 1) {
          um.getWaitlistBanLength(length);
          bot.moderateWaitListBan(userID, 1, um.waitlistBanLength)
          bot.sendChat(`/me [WLBAN] (${decode(data.from.username)}) Waitlist Banned ${username} ${um.waitlistBanKeyword}.`)
        } else if (userID && role > 0) {
          bot.sendChat(`/me [WLBAN] (${decode(data.from.username)}) Sorry, I cannot waitlist ban staff.`)
        } else {
          bot.sendChat(`/me [WLBAN] (${decode(data.from.username)}) Invalid usage. !wlban @user [length].`)
        }
        global.commandCooldown();
      }
    });

    bot.on('command:settings', (data) => {
      db.checkIfStaff(data.from.id);
      if (data.from && !cooldowns.cmd && db.isStaff) {
        global.getSettings();
        strings.updateString();
        bot.sendChat(strings.settingString);
        global.commandCooldown();
      }
    });

    bot.on('command:toggle', (data) => {
      db.checkIfStaff(data.from.id);
      if (data.from && !cooldowns.cmd && db.isStaff) {
        let toToggle = data.args[0];
        global.toggleSettings(toToggle);
        bot.sendChat(`/me [TOGGLE] (${decode(data.from.username)}) ${global.toggleTitle} ${global.toggleKeyword}`)
        global.commandCooldown();
      }
    });

    bot.on('command:translate', (data) => {
      db.checkIfStaff(data.from.id);
      if (data.from && !cooldowns.cmd && db.isStaff && data.args.length >= 1) {
        let msg = data.message.substring(10).trim();
        translate.getLanguage(msg).then((translated) => {
          bot.sendChat(`/me [${translated.targetLanguage}] (${decode(data.from.username)}) ${msg} | ${translated.translatedString}`)
        });
        global.commandCooldown();
      }
    });

    bot.on('command:giveaway', (data) => {
      db.checkIfStaff(data.from.id);
      if (data.from && !cooldowns.cmd && db.isStaff && data.args.length >= 1) {
        const duration = data.args[0],
          starter = data.from.username,
          starterID = data.from.id,
          message = data.message;
        gw.getDuration(duration, message, starter, starterID);
        if (gw.isError) {
          bot.sendChat(`/me [GIVEAWAY] (${decode(data.from.username)}) ${gw.giveawayError}`)
        } else {
          if (gw.giveawayUnderway) {
            bot.sendChat(`/me ${gw.giveawayString}`);
            setTimeout(() => {
              gw.giveawayUnderway = false;
              gw.selectWinner();
              if (gw.isWinner) {
                bot.sendChat(`/me [GIVEAWAY] ${bot.getUser(gw.winner).username} is the winner of the ${gw.giveawayTheme} giveaway.`)
                gw.pushWinnerDB(bot.getUser(gw.winner).username)
                gw.resetGiveaway();
              } else {
                bot.sendChat(`/me [GIVEAWAY] ${gw.winner} for the ${gw.giveawayTheme} giveaway.`)
              }
            }, gw.duration * 60000);
          }
        }
      }
    });

    bot.on('command:voteinfo', (data) => {
      db.checkIfStaff(data.from.id);
      if (data.from && !cooldowns.cmd && db.isStaff && settings.toggleVoteSystem) {
        bot.sendChat(`/me [VOTE] (${decode(data.from.username)}) ${strings.voteEnabled}`);
        global.commandCooldown();
      }
    });

    /*
    		U S E R
    		C O M M A N D S
    */

    bot.on('command:suggest', (data) => {
      if (data.from && !cooldowns.cmd && data.args.length >= 2) {
        let toSuggest = data.args[0],
          suggestion = data.message.substring(9).trim();
        trello.handleSuggest(toSuggest, suggestion, data.from.username);
        bot.sendChat(`/me [SUGGEST] (${data.from.username}) ${trello.suggestString}`)
        global.commandCooldown();
      }
    });

    bot.on('command:eta', (data) => {
      if (data.from && !cooldowns.cmd && bot.getDJ()) {
        const userID = data.from.id,
          position = bot.getWaitListPosition(userID),
          dj = bot.getDJ().id;
        if (position == -1) {
          bot.sendChat(`/me [ETA] (${decode(data.from.username)}) You are not on the waitlist.`)
        } else if (userID == dj) {
          bot.sendChat(`/me [ETA] (${decode(data.from.username)}) You are already DJing!`);
        } else if (position == 1) {
          let eta = global.getTime(bot.getTimeRemaining());
          bot.sendChat(`/me [ETA] (${decode(data.from.username)}) ${eta} `)
        } else {
          let eta = global.getTime((position * 20 * (25 / 5)) + bot.getTimeRemaining());
          bot.sendChat(`/me [ETA] (${decode(data.from.username)}) ${eta} `)
        }
        global.commandCooldown();
      }
    });

    bot.on('command:enter', (data) => {
      if (data.from && gw.giveawayUnderway) {
        gw.addEntry(data.from.id);
        if (gw.entryStatus) {
          bot.sendChat(`/me [GIVEAWAY] @${decode(data.from.username)} Entered.`);
        } else {
          if (!cooldowns.cmd) {
            bot.sendChat(`/me [GIVEAWAY] @${decode(data.from.username)} You're already entered.`);
          }
        }
        global.commandCooldown();
      }
    });

    bot.on('command:lottery', (data) => {
      if (data.from && !cooldowns.cmd && cooldowns.lottery3 && settings.toggleLottery) {
        if (new Date().getMinutes() >= 0 && new Date().getMinutes() < 03) {
          lot.enterLottery(data.from.id);
          bot.sendChat(`/me [LOTTERY] @${decode(data.from.username)} ${lot.entryMessage}`);
        }
        global.commandCooldown();
      }
    });

    bot.on('command:vote', (data) => {
      if (!cooldowns.cmd && settings.toggleVoteSystem && bot.getMedia() && bot.getDJ()) {
        var userID = data.from.id;
        if (vote.currentVoters.indexOf(userID) > -1) {
          bot.sendChat(`[VOTE] @${decode(data.from.username)} You have already voted for this song.`);
          global.commandCooldown();
        } else {
          vote.addVoter(bot.getMedia().id, userID);
        }
      }
    });

    bot.on('command:8ball', (data, args) => {
      if (data.from && !cooldowns.cmd) {
        const message = data.message.substr(6).trim();
        if (!message) {
          bot.sendChat(`/me [8BALL] (${decode(data.from.username)}) Invalid usage. !8ball [yes/no question]`)
        } else {
          bot.sendChat(`/me [8BALL] (${decode(data.from.username)}) Question: ${message} :star2: My answer: ${arrays.ball[Math.floor(Math.random() * arrays.ball.length)]}`)
        }
        global.commandCooldown();
      }
    });

    bot.on('command:trump', (data) => {
      if (data.from && !cooldowns.cmd) {
        bot.sendChat(`/me [TRUMP] (${decode(data.from.username)}) Make America great again! ${arrays.trumptastic[Math.floor(Math.random() * arrays.trumptastic.length)]}`)
        global.commandCooldown();
      }
    });

    bot.on('command:fox', (data) => {
      if (data.from && !cooldowns.cmd) {
        bot.sendChat(`/me [FOX] (${decode(data.from.username)}) For fox sake! ${arrays.fox[Math.floor(Math.random() * arrays.fox.length)]}`)
        global.commandCooldown();

      }
    });

    bot.on('command:cat', (data) => {
      if (data.from && !cooldowns.cmd) {
        bot.sendChat(`/me [CAT] (${decode(data.from.username)}) Meowww... ${arrays.cat[Math.floor(Math.random() * arrays.cat.length)]}`)
        global.commandCooldown();
      }
    });

    bot.on('command:hue', (data) => {
      if (data.from && !cooldowns.cmd) {
        bot.sendChat(`/me [HUE] (${decode(data.from.username)}) HUEHUEHUE ${arrays.hue[Math.floor(Math.random() * arrays.hue.length)]}`)
        global.commandCooldown();
      }
    });

    bot.on('command:thonk', (data) => {
      if (data.from && !cooldowns.cmd) {
        bot.sendChat(`/me [THONK] (${decode(data.from.username)}) ${arrays.thonk[Math.floor(Math.random() * arrays.thonk.length)]}`)
        global.commandCooldown();
      }
    });

    bot.on('command:ping', (data) => {
      if (data.from && !cooldowns.cmd) {
        bot.sendChat(`/me [PING] (${decode(data.from.username)}) Pong!`);
        global.commandCooldown();
      }
    });

    bot.on('command:pinggif', (data) => {
      if (data.from && !cooldowns.cmd) {
        bot.sendChat(`/me [PINGGIF] (${decode(data.from.username)}) Pong! ${arrays.pingpong[Math.floor(Math.random() * arrays.pingpong.length)]}`)
        global.commandCooldown();
      }
    });

    bot.on('command:emotes', (data) => {
      if (data.from && !cooldowns.cmd) {
        bot.sendChat(`/me [EMOTES] (${decode(data.from.username)}) ${strings.rcsEmotes}`)
        global.commandCooldown();
      }
    });

    bot.on('command:commands', (data) => {
      if (data.from && !cooldowns.cmd) {
        bot.sendChat(`/me [COMMANDS] (${decode(data.from.username)}) ${strings.commandsLink}`)
        global.commandCooldown();
      }

    });

    bot.on('command:facebook', (data) => {
      if (data.from && !cooldowns.cmd) {
        bot.sendChat(`/me [FACEBOOK] (${decode(data.from.username)}) ${strings.facebook}`)
        global.commandCooldown();
      }
    });

    bot.on('command:twitter', (data) => {
      if (data.from && !cooldowns.cmd) {
        bot.sendChat(`/me [TWITTER] (${decode(data.from.username)}) ${strings.twitter}`);
        global.commandCooldown();
      }
    });

    bot.on('command:contact', (data) => {
      if (data.from && !cooldowns.cmd) {
        bot.sendChat(`/me [CONTACT] (${decode(data.from.username)}) ${strings.contact}`)
        global.commandCooldown();
      }
    });

    bot.on('command:source', (data) => {
      if (data.from && !cooldowns.cmd) {
        bot.sendChat(`/me [SOURCE] (${decode(data.from.username)}) ${strings.source}`)
        global.commandCooldown();
      }
    });

    bot.on('command:bl', (data) => {
      if (data.from && !cooldowns.cmd) {
        bot.sendChat(`/me [BLACKLIST] (${decode(data.from.username)}) ${strings.blacklist}`)
        global.commandCooldown();
      }
    });

    bot.on('command:discord', (data) => { //discord
      if (data.from && !cooldowns.cmd) {
        bot.sendChat(`/me [DISCORD] (${decode(data.from.username)}) ${strings.discord}`)
        global.commandCooldown();
      }
    });

    bot.on('command:website', (data) => {
      if (data.from && !cooldowns.cmd) {
        bot.sendChat(`/me [WEBSITE] (${decode(data.from.username)}) ${strings.website}`)
        global.commandCooldown();
      }
    });

    bot.on('command:staffapp', (data) => {
      if (data.from && !cooldowns.cmd) {
        bot.sendChat(`/me [APP] (${decode(data.from.username)}) ${strings.staffapp}`)
        global.commandCooldown();
      }
    });


    bot.on('command:donate', (data) => {
      if (data.from && !cooldowns.cmd) {
        bot.sendChat(`/me [APP] (${decode(data.from.username)}) ${strings.donate}`)
        global.commandCooldown();
      }
    });

    bot.on('command:producer', (data) => {
      if (data.from && !cooldowns.cmd) {
        bot.sendChat(`/me [APP] (${decode(data.from.username)}) ${strings.producerapp}`)
        global.commandCooldown();
      }
    });

    bot.on('command:rope', (data) => {
      if (data.from && !cooldowns.cmd) {
        bot.sendChat(`/me [ROPE] (${decode(data.from.username)}) ${strings.rope}`)
        global.commandCooldown();
      }
    });

    bot.on('command:rules', (data) => {
      if (data.from && !cooldowns.cmd) {
        bot.sendChat(`/me [RULES] (${decode(data.from.username)}) ${strings.rules}`)
        global.commandCooldown();

      }
    });

    bot.on('command:promoter', (data) => {
      if (data.from && !cooldowns.cmd) {
        bot.sendChat(`/me [PROMOTER] (${decode(data.from.username)}) ${strings.promoter}`)
        global.commandCooldown();
      }
    });

    bot.on('command:sm', (data) => {
      if (data.from && !cooldowns.cmd) {
        bot.sendChat(`/me [SM] (${decode(data.from.username)}) ${strings.sm}`)
        global.commandCooldown();
      }
    });

    bot.on('command:ba', (data) => {
      if (data.from && !cooldowns.cmd) {
        bot.sendChat(`/me [BA] (${decode(data.from.username)}) ${strings.ba}`)
        global.commandCooldown();
      }
    });

    bot.on('command:plot', (data) => {
      if (data.from && !cooldowns.cmd) {
        bot.sendChat(`/me [pLoT] (${decode(data.from.username)}) ${strings.plot}`)
        global.commandCooldown();
      }
    });

    bot.on('command:event', (data) => {
      if (data.from && !cooldowns.cmd) {
        bot.sendChat(`/me [EVENT] (${decode(data.from.username)}) ${settings.eventString}`);
        global.commandCooldown();
      }
    });

    bot.on('command:lothelp', (data, args) => {
      if (data.from && !cooldowns.cmd) {
        bot.sendChat(`/me ![LOTTERY] (${decode(data.from.username)}) ${lot.lotteryHelp}`)
        global.commandCooldown();
      }
    });

    bot.on('command:sandwich', (data, args) => {
      if (data.from && !cooldowns.cmd) {
        food.sandwichBuilder();
        bot.sendChat(`/me [SANDWICH] Hope you're hungry, ${decode(data.from.username)}! ${food.sandwichString}`);
        global.commandCooldown();
      }
    });

    bot.on('command:pasta', (data, args) => {
      if (data.from && !cooldowns.cmd) {
        food.pastaBuilder();
        bot.sendChat(`/me [PASTA] Guess what, ${decode(data.from.username)}! ${food.pastaString}`);
        global.commandCooldown();
      }
    });

    bot.on('command:fastfood', (data, args) => {
      if (data.from && !cooldowns.cmd && data.args[0]) {
        const arg = data.args[0],
          ID = data.args[0].id;
        if (!arg || !ID) {
          bot.sendChat(`/me [FASTFOOD] (${decode(data.from.username)}) Invalid usage. !fastfood @user`)
        } else if (ID === 3609549) {
          bot.sendChat(`/me [FASTFOOD] (${decode(data.from.username)}) Are you trying to make me fat?`)
        } else if (ID === data.from.id) {
          bot.sendChat(`/me [FASTFOOD] (${decode(data.from.username)}) ${arrays.foodhog[Math.floor(Math.random() * arrays.foodhog.length)]}`)
        } else {
          bot.sendChat(`/me [FASTFOOD] (${decode(data.from.username)}) bought @${arg.username} some fastfood. Here's ${arrays.fastfoods[Math.floor(Math.random() * arrays.fastfoods.length)]}!`)
        }
        global.commandCooldown();
      }
    });

    bot.on('command:hug', (data, args) => { //hug
      if (data.from && !cooldowns.cmd && data.args[0]) {
        const arg = data.args[0],
          ID = data.args[0].id;
        if (!arg || !ID) {
          bot.sendChat(`/me [HUG] (${decode(data.from.username)}) Invalid usage. !hug @user`)
        } else if (ID === 3609549 || ID === data.from.id) {
          bot.sendChat(`/me [HUG] FoxBot gave @${decode(data.from.username)} a big snuggly hug. :blue_heart: :yellow_heart:`);
        } else {
          bot.sendChat(`/me [HUG] @${decode(data.from.username)} gave @${arg.username} a big snuggly hug. :blue_heart: :yellow_heart:`);
        }
        global.commandCooldown();
      }
    });

    bot.on('command:candy', (data, args) => {
      if (data.from && !cooldowns.cmd && data.args[0]) {
        const arg = data.args[0],
          ID = data.args[0].id;
        if (!arg || !ID) {
          bot.sendChat(`/me [CANDY] (${decode(data.from.username)}) Invalid usage. !candy @user`)
        } else if (ID === 3609549) {
          bot.sendChat(`/me [CANDY] @${decode(data.from.username)} Bots can't eat candy. It's bad for our teeth.`)
        } else if (ID === data.from.id) {
          bot.sendChat(`/me [CANDY] @${decode(data.from.username)} ${arrays.candyhog[Math.floor(Math.random() * arrays.candyhog.length)]}`)
        } else {
          bot.sendChat(`/me [CANDY] (${decode(data.from.username)}) reached into the bag of candy and gave ${arrays.candy[Math.floor(Math.random() * arrays.candy.length)]} to ${arg.username}`);
        }
        global.commandCooldown();
      }
    });

    bot.on('command:shot', (data) => {
      if (data.from && !cooldowns.shot) {
        const userID = data.from.id,
          role = bot.getUser(userID).role,
          shot = arrays.shots[Math.floor(Math.random() * arrays.shots.length)],
          drunk = arrays.drunkNum[Math.floor(Math.random() * arrays.drunkNum.length)]
        shotArray.push(drunk);
        let total = 0;
        for (let i = 0; i < shotArray.length; i++) {
          total += shotArray[i];
        }
        bot.sendChat(`/me [SHOT] ${decode(data.from.username)} Gave Fox Bot a shot of ${shot} | Added: ${drunk}% | Alcohol Level: ${total}% `)
        if (total > 100) {
          bot.sendChat('/me [SHOT] I fEeL sOOoOoOo dRunKkKkk...')
          shotArray.splice(0, shotArray.length);
          if (role > 1000 && role < 4000) {
            setTimeout(() => bot.sendChat(`/me [SHOT] ${strings.shotMute} ${decode(data.from.username)}`), 2000);
            bot.moderateSetRole(userID, 0);
            setTimeout(() => bot.moderateMuteUser(userID), 2000);
            setTimeout(() => {
              bot.moderateUnmuteUser(userID);
              bot.moderateSetRole(userID, role)
              bot.sendChat(`[SHOT] ${strings.shotUnmute} ${decode(data.from.username)}`)
            }, 20000)
          } else if (role >= 4000) {
            oldFashionedMute.push(data.from.id);
            setTimeout(() => bot.sendChat(`/me [SHOT] ${strings.shotMute} ${decode(data.from.username)}`), 2000);
            setTimeout(() => {
              let muteIndex = oldFashionedMute.indexOf(userID);
              oldFashionedMute.splice(muteIndex, 1);
              bot.sendChat(`[SHOT] ${strings.shotUnmute} ${decode(data.from.username)}`)
            }, 20000)
          } else {
            setTimeout(() => bot.sendChat(`/me [SHOT] ${strings.shotMute} ${decode(data.from.username)}`), 2000);
            setTimeout(() => bot.moderateMuteUser(userID), 1000);
            setTimeout(() => {
              bot.moderateUnmuteUser(userID);
              bot.sendChat(`[SHOT] ${strings.shotUnmute} ${decode(data.from.username)}`)
            }, 20000)
          }
        } else if (total === 100) {
          bot.sendChat(`/me [SHOT] I'm feeling great! You got exactly 100%, ${decode(data.from.username)}!`)
          cooldowns.shot = true;
          move(userID, 1, true);
          shotArray.splice(0, shotArray.length);
        }
        global.shotCooldown();
      }
    });

    bot.on('command:urban', (data, args) => {
      if (!cooldowns.cmd && settings.toggleUrban) {
        let message = data.message.substr(7).trim();
        if (message) {
          urban.term(message, (error, entries, tags, sounds) => {
            if (error) {
              bot.sendChat(`/me [URBAN] (${data.from.username}) Could not locate ${message}.`);
            } else {
              bot.sendChat(`/me [URBAN] (${data.from.username}) ${message} - ${entries[0].definition}`)
            }
          })
        } else if (!message) {
          urban.random((error, entry) => {
            if (error) {
              bot.sendChat(`/me [URBAN] (${data.from.username}) Error getting a random urban definition.`);
            } else {
              bot.sendChat(`/me [URBAN] (${data.from.username}) ${entry.word} - ${entry.definition}`)
            }
          })
        }
        global.commandCooldown();
      }
    });

    bot.on('command:gif', (data, args) => {
      if (data.from && !cooldowns.cmd) {
        const gif = data.message.substr(5).trim(),
          lowercaseGif = gif.toLowerCase();
        if (gif) {
          if (arrays.inappropriate.indexOf(lowercaseGif) != -1) {
            bot.sendChat(`/me [GIF] (${decode(data.from.username)}) Please do not search for inappropriate gifs.`)
          } else {
            giphy.random({
              tag: gif
            }, (err, res) => {
              if (!res.data || !res.data.image_url) {
                bot.sendChat(`/me [GIF] (${decode(data.from.username)}) Search results not found for ${gif}.`)
              } else if (res.data != undefined) {
                bot.sendChat(`/me [${gif} GIF] (${decode(data.from.username)}) ${res.data.image_url}`);
              }
            });
          }
        }
        global.commandCooldown();
      }
    });

    bot.on('command:link', (data, args) => {
      if (data.from && !cooldowns.cmd && bot.getMedia()) {
        var media = bot.getMedia();
        if (media.format == '1') {
          bot.sendChat(`/me [LINK] (${decode(data.from.username)}) Current song https://youtu.be/${bot.getMedia().cid}`);
        } else {
          SC.get('/tracks/' + bot.getMedia().cid, function (err, track) {
            if (err) {
              console.log(err);
            } else {
              bot.sendChat(`/me [LINK] (${decode(data.from.username)}) Current song: ${track.permalink_url}`);
            }
          })
        }
        global.commandCooldown();
      }
    });

    bot.on('command:successkid', (data, args) => {
      if (data.from && !cooldowns.cmd) {
        const message = data.message.substring(12).trim();
        if (message) {
          imgflipper.generateMeme(61544, "", message, function (err, url) {
            if (err) {
              console.log(err);
            } else {
              bot.sendChat(`[SUCCESSKID] Yesss... ${url}`)
            }
          });
        }
      }
    });


    /*
    D O N O R
    C O M M A N D S
    */

    //All Donor Levels
    bot.on('command:dropzone', (data, args) => {
      db.checkIfDonor(data.from.id);
      if (data.from && !cooldowns.cmd && db.isDonor) {
        bot.sendChat(`/me [DROPZONE] (${decode(data.from.username)}) ${strings.dropZone}`)
        global.commandCooldown();
      }
    });

    bot.on('command:yuno', (data, args) => {
      db.checkIfDonor(data.from.id);
      if (data.from && !cooldowns.cmd && db.isDonor) {
        const message = data.message.substring(6).trim();
        if (message) {
          imgflipper.generateMeme(61527, "Y U NO", message, function (err, url) {
            if (err) {
              console.log(err);
            } else {
              bot.sendChat(`[YUNO] ${url}`)
            }
          });
        }
      }
    });

    bot.on('command:facepalm', (data, args) => {
      db.checkIfDonor(data.from.id);
      if (data.from && !cooldowns.cmd && db.isDonor) {
        const message = data.message.substring(9).trim();
        if (message) {
          imgflipper.generateMeme(1509839, "", message, function (err, url) {
            if (err) {
              console.log(err);
            } else {
              bot.sendChat(`[FACEPALM] Y U do dis... ${url}`)
            }
          });
        }
      }
    });

    bot.on('command:aww', (data, args) => {
      db.checkIfDonor(data.from.id);
      if (data.from && !cooldowns.cmd && db.isDonor) {
        bot.sendChat(`/me [AWW] (${decode(data.from.username)}) 3cute5me ${arrays.aww[Math.floor(Math.random() * arrays.aww.length)]}`)
        global.commandCooldown();
      }
    });

    bot.on('command:dealwithit', (data, args) => {
      db.checkIfDonor(data.from.id);
      if (data.from && !cooldowns.cmd && db.isDonor) {
        bot.sendChat(`/me [DWI] (${decode(data.from.username)}) #DealWithIt ${arrays.dwi[Math.floor(Math.random() * arrays.dwi.length)]}`)
        global.commandCooldown();
      }
    });

    bot.on('command:nope', (data, args) => {
      db.checkIfDonor(data.from.id);
      if (data.from && !cooldowns.cmd && db.isDonor) {
        bot.sendChat(`/me [NOPE] (${decode(data.from.username)}) FoxBot.abort(); ${arrays.no[Math.floor(Math.random() * arrays.no.length)]}`)
        global.commandCooldown();
      }
    });

    bot.on('command:cookie', (data, args) => {
      db.checkIfDonor(data.from.id)
      if (data.from && !cooldowns.cmd && db.isDonor && data.args[0]) {
        const userID = data.from.id,
          givingTo = data.args[0].id,
          givingToUN = data.args[0];
        if (!givingTo) {
          bot.sendChat(`/me [COOKIE] (${decode(data.from.username)}) ${strings.botCookie}`)
        } else if (userID == givingTo) {
          bot.sendChat(`/me [COOKIE] @${decode(data.from.username)} ${strings.stealCookie}`)
        } else if (givingTo == 3609549) {
          bot.sendChat(`/me [COOKIE] @${decode(data.from.username)} ${strings.noCookie}`)
        } else {
          bot.sendChat(`/me [COOKIE] @${decode(data.from.username)} reached into the jar and gave @${givingToUN} ${arrays.cookies[Math.floor(Math.random() * arrays.cookies.length)]}`)
        }
        global.commandCooldown();
      }
    });

    bot.on('command:newspaper', (data, args) => {
      db.checkIfDonor(data.from.id)
      if (data.from && !cooldowns.cmd && db.isDonor && data.args[0]) {
        const gettingHit = data.args[0].username,
          gettingHitID = data.args[0].id;
        if (!gettingHitID) {
          bot.sendChat(`/me [NEWSPAPER] (${decode(data.from.username)}) Invalid username. !newspaper @user :newspaper:`)
        } else if (gettingHitID === data.from.id) {
          bot.sendChat(`/me [NEWSPAPER] @Fox Bot hit ${gettingHit} with a newspaper!  :newspaper: :newspaper: :newspaper:`)
        } else if (gettingHitID == 3609549) {
          bot.sendChat(`/me [NEWSPAPER] @${decode(data.from.username)} Wow, you just tried to hit me with a newspaper? Get muted, fam.`);
          oldFashionedMute.push(data.from.id);
          setTimeout(function () {
            var muteIndex = oldFashionedMute.indexOf(userID);
            oldFashionedMute.splice(muteIndex, 1);
            bot.sendChat(`/me [NEWSPAPER] I decided to unmute you @${decode(data.from.username)} but you best not try that again.`)
          }, 20000);
        } else {
          bot.sendChat(`/me [NEWSPAPER] @${decode(data.from.username)} hit @${gettingHit} with a newspaper!  :newspaper: :newspaper: :newspaper:`)
        }
      }
    });

    // Red, Arctic, Silver, Donor level

    bot.on('command:everywhere', (data, args) => {
      db.checkIfRedArcticSilver(data.from.id)
      if (data.from && !cooldowns.cmd && db.isRedArcticSilver) {
        const message = data.message.substring(12).trim();
        if (message) {
          imgflipper.generateMeme(347390, `${message}`, `${message} Everywhere`, function (err, url) {
            if (err) {
              console.log(err);
            } else {
              bot.sendChat(`/me [EVERYWHERE] Wtf tho. ${url}`)
            }
          });
        }
      }
    });

    bot.on('command:braceyourself', (data, args) => {
      db.checkIfArcticSilver(data.from.id)
      if (data.from && !cooldowns.cmd && db.isArcticSilver) {
        const message = data.message.substring(15).trim();
        if (message) {
          imgflipper.generateMeme(61546, "Brace yourselves", message, function (err, url) {
            if (err) {
              console.log(err);
            } else {
              bot.sendChat(`/me [BRACEYOURSELF] Uh oh... ${url}`)
            }
          });
        }
      }
    });

    bot.on('command:love', (data, args) => {
      db.checkIfRedArcticSilver(data.from.id)
      if (data.from && !cooldowns.cmd && db.isRedArcticSilver) {
        bot.sendChat(strings.heart1);
        bot.sendChat(strings.heart2);
        bot.sendChat(strings.heart3);
        global.commandCooldown();
      }
    });

    bot.on('command:taco', (data, args) => {
      db.checkIfRedArcticSilver(data.from.id)
      if (data.from && !cooldowns.cmd && db.isRedArcticSilver) {
        food.tacoBuilder();
        bot.sendChat(`/me [TACO] Order up, ${decode(data.from.username)} - ${food.tacoString}`);
        global.commandCooldown();
      }
    });

    bot.on('command:burger', (data, args) => {
      db.checkIfRedArcticSilver(data.from.id)
      if (data.from && !cooldowns.cmd && db.isRedArcticSilver) {
        food.burgerBuilder();
        bot.sendChat(`/me [BURGER] YeeHaw, ${decode(data.from.username)}! ${food.burgerString}`);
        global.commandCooldown();
      }
    });

    bot.on('command:burritobowl', (data, args) => {
      db.checkIfRedArcticSilver(data.from.id)
      if (data.from && !cooldowns.cmd && db.isRedArcticSilver) {
        food.bowlBuilder();
        bot.sendChat(`/me [BURRITOBOWL] Hope you'll share, ${decode(data.from.username)}! ${food.bowlString}`);
        global.commandCooldown();
      }
    });

    //Arctic and Silver Donor Levels

    bot.on('command:spongemock', (data, args) => {
      db.checkIfArcticSilver(data.from.id)
      if (data.from && !cooldowns.cmd && db.isArcticSilver) {
        const message = data.message.substring(12).trim();
        if (message) {
          imgflipper.generateMeme(102156234, "", message, function (err, url) {
            if (err) {
              console.log(err);
            } else {
              bot.sendChat(`/me [SPONGEMOCK] ${url}`)
            }
          });
        }
      }
    });

    bot.on('command:wesmart', (data, args) => {
      db.checkIfArcticSilver(data.from.id)
      if (data.from && !cooldowns.cmd && db.isArcticSilver) {
        const message = data.message.substring(9).trim();
        if (message) {
          imgflipper.generateMeme(89370399, "", message, function (err, url) {
            if (err) {
              console.log(err);
            } else {
              bot.sendChat(`/me [WESMART] :wesmart: ${url}`)
            }
          });
        }
      }
    });

    bot.on('command:oprah', (data, args) => {
      db.checkIfArcticSilver(data.from.id)
      if (data.from && !cooldowns.cmd && db.isArcticSilver) {
        const message = data.message.substring(7).trim();
        if (message) {
          imgflipper.generateMeme(28251713, `You get ${message}`, `and you get ${message}`, function (err, url) {
            if (err) {
              console.log(err);
            } else {
              bot.sendChat(`/me [OPRAH] ${url}`)
            }
          });
        }
      }
    });

    bot.on('command:notsimply', (data, args) => {
      db.checkIfArcticSilver(data.from.id)
      if (data.from && !cooldowns.cmd && db.isArcticSilver) {
        const message = data.message.substring(11).trim();
        if (message) {
          imgflipper.generateMeme(61579, "One does not simply", message, function (err, url) {
            if (err) {
              console.log(err);
            } else {
              bot.sendChat(`/me [NOTSIMPLY] ${url}`)
            }
          });
        }
      }
    });

    bot.on('command:satisfy', (data, args) => {
      db.checkIfArcticSilver(data.from.id)
      if (data.from && !cooldowns.cmd && db.isArcticSilver) {
        bot.sendChat(`/me [SATISFY] (${decode(data.from.username)}) mmmm... ${arrays.satisfy[Math.floor(Math.random() * arrays.satisfy.length)]}`)
        global.commandCooldown();
      }
    });

    bot.on('command:pizza', (data, args) => {
      db.checkIfArcticSilver(data.from.id)
      if (data.from && !cooldowns.cmd && db.isArcticSilver) {
        food.pizzaBuilder();
        bot.sendChat(`/me [PIZZA] Mamma Mia I've got some pizza for ${decode(data.from.username)}! ${food.pizzaString}`);
        global.commandCooldown();
      }
    });

    bot.on('command:avatar', (data, args) => {
      db.checkIfArcticSilver(data.from.id)
      if (data.from && !cooldowns.cmd && db.isArcticSilver) {
        let avatar = arrays.avatar[Math.floor(Math.random() * arrays.avatar.length)]
        bot.setAvatar(avatar.toString())
        setTimeout(() => bot.setAvatar('robot07'), 60000);
        bot.sendChat(`/me [AVATAR] (${data.from.username}) :eyes:`)
        global.commandCooldown();
      }
    });

    bot.on('command:stupidfox', (data, args) => {
      db.checkIfArcticSilver(data.from.id)
      if (data.from && !cooldowns.cmd && db.isArcticSilver) {
        bot.sendChat(`/me [STUPIDFOX] :foxden: ${arrays.stupidfox[Math.floor(Math.random() * arrays.stupidfox.length)]}`);
        global.commandCooldown();
      }
    });


    //SILVER

    bot.on('command:inmyday', (data, args) => {
      db.checkIfSilver(data.from.id)
      if (data.from && !cooldowns.cmd && db.isSilver) {
        const message = data.message.substring(8).trim();
        if (message) {
          imgflipper.generateMeme(718432, "Back in my day...", message, function (err, url) {
            if (err) {
              console.log(err);
            } else {
              bot.sendChat(`[INMYDAY] ${url}`)
            }
          });
        }
      }
    });

    bot.on('command:wtf', (data, args) => {
      db.checkIfSilver(data.from.id)
      if (data.from && !cooldowns.cmd && db.isSilver) {
        const message = data.message.substring(5).trim();
        if (message) {
          imgflipper.generateMeme(14230520, "", message, function (err, url) {
            if (err) {
              console.log(err);
            } else {
              bot.sendChat(`[WTF] ${url}`)
            }
          });
        }
      }
    });

    /*
    		L O T T E R Y
        */
    setInterval(lotteryAnnouncement, 60 * 1000);
    setInterval(lotteryWinner, 60 * 1000);

    bot.on('chat', lotteryAnnouncement)

    function lotteryAnnouncement() {
      if (settings.toggleLottery && !cooldowns.lottery && new Date().getMinutes() == 00) {
        bot.sendChat(`${lot.lotteryAnnounce}`)
        lot.lotteryAnnounceCooldown();
      }
    }

    bot.on('chat', lotteryWinner)

    function lotteryWinner(data) {
      if (!cooldowns.lottery2 && new Date().getMinutes() == 03 && settings.toggleLottery && bot.getDJ()) {
        lot.getWinner(bot.getDJ().id)
        if (lot.isWinner) {
          let winnerName = bot.getUser(lot.winnerID).username;
          if (lot.isDJ) {
            bot.sendChat(`[LOTTERY] @${winnerName} ${lot.winnerMessage}`)
            lot.lotteryWinnerCooldown();

          } else {
            bot.sendChat(`[LOTTERY] @${winnerName} ${lot.winnerMessage}`)
            move(lot.winnerID, 1, true);
            lot.lotteryWinnerCooldown();
          }
        } else {
          bot.sendChat(`[LOTTERY] ${lot.winnerMessage}`);
          lot.lotteryWinnerCooldown();
        }
      }
    }

    /*
    C H A T
    E V E N T
    */
    bot.on('chat', (data) => { //MUTE CHK
      if (data.from) {
        if (oldFashionedMute.indexOf(data.from.id) > -1) {
          bot.moderateDeleteChat(data.raw.cid);
        }
        if (settings.toggleCleverBot && data.message.startsWith("@Fox Bot") && data.message) {
          if (data.message.indexOf("AFK") > -1) {} else {
            let msg = data.message.substr(9).trim();
            cb.query(msg)
              .then(function (response) {
                bot.sendChat(`@${data.from.username} ${response.output}`);
              });
          }
        }
        if ((data.from.id === 28463273 || data.from.id === 3609549) && (data.message.startsWith("Welcome back") || data.message.startsWith("Welcome to Fox Den") || data.message.startsWith("A Guest"))) {
          setTimeout(() => {
            bot.moderateDeleteChat(data.raw.cid)
          }, 30000);
        }
        if (data.message.startsWith("!")) {
          bot.moderateDeleteChat(data.raw.cid)
        }

        if (data.message.indexOf(":kong:") > -1) {
          kongArray.push(data.raw.cid);
        }

      }
    });

    setInterval(Adv, 60 * 1000);
    bot.on('chat', Adv)

    function Adv(data) { //Ad posting
      if (settings.toggleAds && !cooldowns.ad && new Date().getMinutes() == 30) {
        bot.sendChat(arrays.ads[Math.floor(Math.random() * arrays.ads.length)])
        global.adCooldown();
      }
    };


    /*
    U S E R
    J O I N
    E V E N T
    */

    bot.on('userJoin', (data) => {
      const usernameJoin = decode(data.username),
        userIDJoin = data.id,
        date = new Date;
      if (settings.toggleWelcomes && !userIDJoin && data.guest) {
        bot.sendChat("A Guest! :eyes:");
      } else if (userIDJoin && !data.guest) {
        dbUser.findUser(usernameJoin, userIDJoin, date.toString(), bot.getUser(userIDJoin).slug, bot.getUser(userIDJoin).level, bot.getUser(userIDJoin).language, bot.getUser(userIDJoin).gRole, bot.getUser(userIDJoin).sub, bot.getUser(userIDJoin).joined);
        dbUser.getUserCount();
        userCount = dbUser.userCount;
        let currUsers = bot.getUsers().length;
        if (serverFD) {
          serverFD.emit('updateUsers', userCount, currUsers);
        }
        if (settings.toggleWelcomes && dbUser.isNew) {
          setTimeout(() => bot.sendChat(`Welcome to Fox Den, @${usernameJoin}`), 3000);
        } else if (settings.toggleWelcomes && !dbUser.isNew) {
          setTimeout(() => bot.sendChat(`Welcome back, @${usernameJoin}`), 3000);
        }
      }
    });


    /*
    U S E R
    L E A V E
    E V E N T
    */
    bot.on('userLeave', (data) => { //USER LEAVE
      const usernameLeave = decode(data.username),
        userIDLeave = data.id;
      userCount = dbUser.userCount;
      let currUsers = bot.getUsers().length;
      if (serverFD) {
        serverFD.emit('updateUsers', userCount, currUsers);
      }

      if (gw.giveawayUnderway && userIDLeave && gw.isLeave) {
        gw.removeEntry(userIDLeave);
        bot.sendChat(`[GIVEAWAY] ${usernameLeave} left. Removed them from the giveaway.`);
      }

      if (settings.toggleLottery && userIDLeave) {
        lot.removeEntry(userIDLeave);
        if (lot.isLeave) {
          bot.sendChat(`${usernameLeave} left. Removed them from lottery`)
        }
      }

    });

    /* B A N
    E V E N T */

    bot.on(PlugAPI.events.MODERATE_BAN, (data) => {
      let username = data.user,
        staffID = data.moderator.id,
        staffName = data.moderator.username,
        duration = data.duration,
        banID;
      duration == "Forever" ? duration = "permanently" : duration == "Day" ? duration = "for a day" : duration = "for an hour";
      if (staffID !== 3609549 && staffID !== 28463273) {
        getCurrentBanUsernames(function (bans) {
          for (let i = 0; i < bans.length; i++) {
            if (bans[i].username == username) {
              banID = bans[i].id;
              break;
            }
          }
          if (banID) {
            trello.addCard(username, banID, staffName, duration);
          }
        })
      }
    });

    bot.on('djListUpdate', (data) => {
      if (serverFD) {
        let waitlistLength = bot.getWaitList().length + 1;
        serverFD.emit('updateWaitList', waitlistLength);
      }

    });

    /*
    A D V A N C E
    E V E N T
    */
    bot.on('advance', (data) => {
      if (bot.getMedia() && bot.getDJ()) {
        let autoskiptimer;
        clearTimeout(autoskiptimer);
        const dj = bot.getDJ().id,
          djUsername = bot.getDJ().username,
          title = decode(bot.getMedia().title),
          author = decode(bot.getMedia().author),
          lowercaseTitle = title.toLowerCase(),
          lowerCaseAuthor = author.toLowerCase(),
          nowPlayingCid = bot.getMedia().cid,
          nowPlayingID = bot.getMedia().id,
          duration = bot.getMedia().duration,
          dateTime = new Date(new Date().getTime()).toLocaleString();
        let waitlistLength = bot.getWaitList().length + 1,
          songCount = dba.songCount;
        if (serverFD) {
          serverFD.emit('nowplaying', title, author, djUsername, waitlistLength, songCount);
        }
        dbBlacklist.advanceCheck(bot.getMedia().id, bot.getMedia().cid);

        wm.genreCheck(lowercaseTitle, lowerCaseAuthor, dj);

        const findNowplaying = songLogs.get('songs').find({
          cid: nowPlayingCid
        }).value();
        if (findNowplaying === undefined) {
          wm.addNewSongLog(title, author, nowPlayingCid, nowPlayingID, dateTime, 1);
        } else {
          wm.updateSongLog(nowPlayingCid, dateTime);
        }

        if (dbBlacklist.isFound && !wm.banUser) {
          bot.sendChat(`/me [BLACKLIST] This version of ${bot.getMedia().title} is blacklisted.`);
          bot.moderateForceSkip();
        }

        if (wm.banUser) {
          const banDJ = bot.getDJ()
          bot.moderateForceSkip();
          bot.sendChat(`/me [BAN] Banning ${djUsername} for playing extremely innappropriate genres.`);
          bot.moderateBanUser(banDJ.id, 3, PlugAPI.BAN.PERMA);
          trello.addEarrapeCard(banDJ.username, banDJ.id, "Fox Bot", "permanently");
        }

        if (settings.toggleGenreGuard && wm.genreViolation) {
          if (wm.violationLimit) {
            bot.sendChat(`/me [GENREGUARD] ${djUsername} has been playing songs against our genre rules.`)
            bot.moderateWaitListBan(dj, PlugAPI.BAN_REASON.SPAMMING_TROLLING, PlugAPI.WLBAN.MEDIUM);
          } else {
            bot.sendChat(`/me [GENREGUARD] This song is against our genre policy.`);
            bot.moderateForceSkip();
          }
        }

        if (kongArray.length > 0) {
          kongArray.forEach(kong => {
            bot.moderateDeleteChat(kong);
          });
          kongArray = [];
        }
        if (settings.toggleHistory && !wm.banUser) {
          if (bot.getMedia()) {
            if (data.lastPlay.media) {
              bot.getHistory(function (history) {
                for (let i = 0; i < history.length; i++) {
                  if (history[i].media.cid === nowPlayingCid || nowPlayingCid === data.lastPlay.media.cid) {
                    handleHistory();
                    break;
                  }
                };
              })
            } else {
              bot.getHistory(function (history) {
                for (let i = 0; i < history.length; i++) {
                  if (history[i].media.cid === nowPlayingCid) {
                    handleHistory();
                    break;
                  }
                };
              })
            }
          }
        }

        function handleHistory() {
          wm.historyCheck(dj);
          bot.moderateForceSkip();
          if (wm.historySkip) {
            bot.sendChat(`/me [HISTORY] ${djUsername} has played too many songs in the history. Removing from waitlist.`);
            setTimeout(() => bot.moderateRemoveDJ(dj), 2000)
          } else {
            bot.sendChat(`/me [HISTORY] ${decode(title)} is on the DJ history.`);
          }
        }

        if (settings.toggleTimeguard && !wm.banUser && bot.getMedia().duration > 600) {
          bot.sendChat(`/me [TIMEGUARD] @${djUsername} Your song is too long. https://foxdenedm.com/rules`)
          bot.moderateForceSkip();
          move(dj, 1, false);
        } else if (!settings.toggleTimeguard && bot.getMedia().duration > 600) {
          bot.sendChat(`/me [TIMEGUARD] Disabled.`)
        }

        if (settings.toggleAutowoot === true) {
          bot.woot();
        }

        if (settings.toggleAutoskip) {
          autoskiptimer = setTimeout(() => {
            if (bot.getMedia()) {
              if (bot.getMedia().cid === nowPlayingCid) {
                bot.moderateForceSkip();
                bot.sendChat('/me [AUTOSKIP] Skipping stuck song.');
              }
            }
          }, duration * 1000 + 4000)
        }


        if (data.lastPlay.media && data.lastPlay.dj && settings.toggleVoteSystem) {
          let lastDJ = decode(data.lastPlay.dj.username);
          vote.getPrevious(data.lastPlay.media.id)
          setTimeout(() => {
            bot.sendChat(`[VOTE] The previous song played by ${lastDJ} received ${vote.voteString}`)
          }, 2000)
        }

        if (settings.toggleVoteSystem) {
          vote.writeToVoteLog(title, author, nowPlayingID, djUsername, dj, dateTime);
        }
      }
    });

    /*
    D I S C O N N E C T
    */

    let userLeaveTime,
      waitlistArrayA = [],
      waitlistArrayB = [];

    setInterval(waitlistLog, 30000);

    function waitlistLog() {
      let i,
        n = bot.getWaitList().length;
      waitlistArrayA = [];
      for (i = 0; i < n; ++i) {
        waitlistArrayA.push(bot.getWaitList()[i].id);
      }
      setTimeout(function () {
        let j,
          n = bot.getWaitList().length;
        waitlistArrayB = [];
        for (i = 0; j < n; ++j) {
          waitlistArrayB.push(bot.getWaitList()[j].id);
        }
      }, 15000)
    }


    bot.on('command:dc', (data, args) => {
      if (data.from && !cooldowns.cmd) {
        const userid = data.from.id,
          findDC = disconnect.get('users').find({
            userID: userid
          }).value(),
          dateLog = disconnect.get('users').find({
            userID: userid
          }).map().value(),
          dctime = dateLog[2],
          pos = dateLog[4];
        let elapsedTime = (Math.floor((Date.now() - dctime) / 60000))
        if (findDC === undefined) {
          bot.sendChat(`[DC] @${decode(data.from.username)} No recent disconnects found.`);
        } else if (elapsedTime > settings.cooldownDC) {
          bot.sendChat(`[DC] @${decode(data.from.username)} You disconnected too long ago: ${elapsedTime} min.`)
          disconnect.get('users').remove({
            userID: userid
          }).write()
        } else if (bot.getWaitList().length + 1 <= pos && elapsedTime <= settings.cooldownDC) {
          bot.sendChat(`[DC] @${decode(data.from.username)} You disconnected ${elapsedTime} min ago at position ${pos}.`);
          bot.moderateAddDJ(userid);
          disconnect.get('users').remove({
            userID: userid
          }).write()
        } else if (elapsedTime <= settings.cooldownDC) {
          bot.sendChat(`[DC] @${decode(data.from.username)} You disconnected ${elapsedTime} min ago at position ${pos}.`);
          move(userid, pos, true);
          disconnect.get('users').remove({
            userID: userid
          }).write()
        }
        global.commandCooldown();
      }
    });

    bot.on('command:dclookup', (data, args) => {
      db.checkIfStaff(data.from.id);
      if (data.from && !cooldowns.cmd && db.isStaff) {
        const userid = data.args[0].id,
          username = decode(data.args[0].username),
          findDC = disconnect.get('users').find({
            userID: userid
          }).value(),
          dateLog = disconnect.get('users').find({
            userID: userid
          }).map().value(),
          dctime = dateLog[2],
          pos = dateLog[4];
        let elapsedTime = (Math.floor((Date.now() - dctime) / 60000))
        if (findDC === undefined) {
          bot.sendChat(`[DCLOOKUP] @${decode(data.from.username)} No recent disconnects found for ${username}.`);
        } else if (elapsedTime > settings.cooldownDC) {
          bot.sendChat(`[DCLOOKUP] @${decode(data.from.username)} ${username} disconnected too long ago: ${elapsedTime} min.`)
          disconnect.get('users').remove({
            userID: userid
          }).write()
        } else if (bot.getWaitList().length + 1 <= pos && elapsedTime <= settings.cooldownDC) {
          bot.sendChat(`[DCLOOKUP] @${decode(data.from.username)} ${username} disconnected ${elapsedTime} min ago at position ${pos}.`);
          bot.moderateAddDJ(userid);
          disconnect.get('users').remove({
            userID: userid
          }).write()
        } else if (elapsedTime <= settings.cooldownDC) {
          bot.sendChat(`[DCLOOKUP] @${decode(data.from.username)} ${username} disconnected ${elapsedTime} min ago at position ${pos}.`);
          move(userid, pos, true);
          disconnect.get('users').remove({
            userID: userid
          }).write()
        }

      }
    });

    let timeoutTest = setTimeout(function () {
      console.log("hue");
    }, 30000)

    clearTimeout(timeoutTest);
    //3.6e+6 60 ms to  mins
    bot.on('userLeave', (data) => { //USER LEAVE
      userLeaveTime = Date.now();
      const usernameLeave = data.username,
        useridLeave = data.id,
        indexA = waitlistArrayA.indexOf(useridLeave),
        indexB = waitlistArrayB.indexOf(useridLeave);
      let pos;
      if (useridLeave) {
        if (indexA > -1 && indexB > -1) {
          if (indexA === indexB) {
            pos = indexA + 1;
          } else if (indexA > indexB) {
            pos = indexB + 1;
          } else if (indexA < indexB) {
            pos = indexA + 1
          }
        } else if (indexB > -1 && indexA === -1) {
          pos = indexB + 1;
        } else if (indexA > -1 && indexB === -1) {
          pos = indexA + 1;
        }
        let findTest = disconnect.get('users').find({
          userID: useridLeave
        }).value()
        if (!pos) {
          return;
        } else if (findTest === undefined) {
          disconnect.get('users').push({
            username: usernameLeave,
            userID: useridLeave,
            disconnectTime: Date.now(),
            readableTime: new Date(new Date().getTime()).toLocaleString(),
            disconnectPosition: pos
          }).write();
          timeoutTest = setTimeout(function () {
            disconnect.get('users').remove({
              userID: useridLeave
            }).write()
          }, 1000 * 60 * 2 * settings.cooldownDC)
        } else {
          disconnect.get('users').find({
            userID: useridLeave
          }).assign({
            disconnectTime: Date.now(),
            readableTime: new Date(new Date().getTime()).toLocaleString(),
            disconnectPosition: pos
          }).write()
          clearTimeout(timeoutTest);
          timeoutTest = setTimeout(function () {
            disconnect.get('users').remove({
              userID: useridLeave
            }).write()
          }, 1000 * 60 * 2 * settings.cooldownDC)
        }

      }
    });

  });