const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const seenUsers = lowdb(new FileSync("databases/users/seenusers.json"));
const stafftrack = lowdb(new FileSync("databases/users/stafftrack.json"));
module.exports = {
  userCount: 0,
  usersToIgnore: [29877667, 28463273, 3609549, 27592968, 5141948, 29134529],
  getUserCount: function () {
    this.userCount = seenUsers
      .get("seenusers")
      .size()
      .value();
  },
  isNew: false,
  registerNewUser: function (usernameJoin, userIDJoin, date, slug, level, language, gRole, sub, joined) {
    seenUsers.get('seenusers').push({
      username: usernameJoin,
      userid: userIDJoin,
      roomjoindate: date,
      slug: slug,
      level: level,
      language: language,
      gRole: gRole,
      sub: sub,
      joined: joined
    }).write();
  },
  findUser: function (usernameJoin, userIDJoin, date, slug, level, language, gRole, sub, joined) {
    const dbFindUser = seenUsers.get('seenusers').find({ userid: userIDJoin }).value()
    const staffFindUser = stafftrack.get('staff').find({ userID: userIDJoin }).value();
    let staffSeen = new Date(new Date().getTime()).toLocaleString();
    if (staffFindUser) {
      stafftrack
        .get("staff")
        .find({ userID: userIDJoin })
        .assign({ lastSeen: staffSeen })
        .write();
    }

    if (dbFindUser == undefined) {
      this.isNew = true;
      this.registerNewUser(usernameJoin, userIDJoin, date, slug, level, language, gRole, sub, joined)
    } else {
      this.isNew = false;
      this.databaseCheck(usernameJoin, userIDJoin, slug, level, gRole);
    }
  },
  databaseCheck: function (usernameJoin, userID, slug, level, gRole) {
    const userList = lowdb(new FileSync("databases/users/seenusers.json"));
    let seen = new Date(new Date().getTime()).toLocaleString();
    const databaseCheck = userList
      .get("seenusers")
      .find({ userid: userID })
      .map()
      .value();
    if (usernameJoin != databaseCheck[0]) {
      let findUsername = userList
        .get("seenusers")
        .find({ userid: userID })
        .map()
        .value();
      let currentName = findUsername[0],
        otherNames = findUsername[12]; //A DD A LAST SEEN DO IT FAM
      if (otherNames) {
        nameString = currentName + ", " + otherNames;
      } else {
        nameString = currentName;
      }
      userList
        .get("seenusers")
        .find({ userid: userID })
        .assign({ username: usernameJoin, slug: slug, level: level, gRole: gRole, lastSeen: seen, previousNames: nameString })
        .write();
    } else {
      let lastSeen = userList
        .get("seenusers")
        .find({ userid: userID })
        .map()
        .value();
      userList
        .get("seenusers")
        .find({ userid: userID })
        .assign({ lastSeen: seen, level: level, gRole: gRole, })
        .write();
    }
  },
  staffString: "",
  getStaffData: function (userID) {
    let numUserID = Number(userID);
    let staffTrackFind = stafftrack.get('staff').find({
      userID: numUserID
    }).value();
    if (staffTrackFind == undefined) {
      this.staffString = "Cound not find that user. Please verify the User ID and try again."
    } else {
      const staffInfo = stafftrack
        .get("staff")
        .find({ userID: numUserID })
        .map()
        .value();
      if (staffInfo[2]) {
        this.staffString = `${staffInfo[0]} (${userID}) was last seen ${staffInfo[2]}.`
      } else {
        this.staffString = `I haven't seen ${staffInfo[0]} (${userID}) since my 2.0 update. Unable to retrieve their last seen information.`
      }
    }
  }
};