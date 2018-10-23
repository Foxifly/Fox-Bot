const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const hosts = lowdb(new FileSync("databases/roles/hosts.json"));
const managers = lowdb(new FileSync("databases/roles/managers.json"));
const bouncers = lowdb(new FileSync("databases/roles/bouncers.json"));
const greyfox = lowdb(new FileSync("databases/roles/greyfox.json"));
const arcticfox = lowdb(new FileSync("databases/roles/arcticfox.json"));
const silverfox = lowdb(new FileSync("databases/roles/silverfox.json"));
const redfox = lowdb(new FileSync("databases/roles/redfox.json"));
const stafftrack = lowdb(new FileSync("databases/users/stafftrack.json"))

module.exports = {
  host: [],
  manager: [],
  bouncer: [],
  greyfoxes: [],
  redfoxes: [],
  arcticfoxes: [],
  silverfoxes: [],
  success: false,
  isStaff: false,
  isManagerHost: false,
  isHost: false,
  isDonor: false,
  isRedArcticSilver: false,
  isArcticSilver: false,
  isSilver: false,
  add: function (type, dbSelect, username, userID, role) {
    switch (dbSelect) {
    case "hosts":
      hosts
        .get("users")
        .push({
          username: username,
          userID: userID,
          role: role
        })
        .write();
      stafftrack
        .get("staff")
        .push({
          username: username,
          userID: userID,
          lastSeen: null
        })
        .write();
      this.success = true;
      break;
    case "managers":
      managers
        .get("users")
        .push({
          username: username,
          userID: userID,
          role: role
        })
        .write();
      stafftrack
        .get("staff")
        .push({
          username: username,
          userID: userID,
          lastSeen: null
        })
        .write();
      this.success = true;
      break;
    case "bouncers":
      bouncers
        .get("users")
        .push({
          username: username,
          userID: userID,
          role: role
        })
        .write();
      stafftrack
        .get("staff")
        .push({
          username: username,
          userID: userID,
          lastSeen: null
        })
        .write();
      this.success = true;
      break;
    case "greyfox":
      greyfox
        .get("users")
        .push({
          username: username,
          userID: userID,
          role: role
        })
        .write();
      this.success = true;
      break;
    case "redfox":
      redfox
        .get("users")
        .push({
          username: username,
          userID: userID,
          role: role
        })
        .write();
      this.success = true;
      break;
    case "arcticfox":
      arcticfox
        .get("users")
        .push({
          username: username,
          userID: userID,
          role: role
        })
        .write();
      this.success = true;
      break;
    case "silverfox":
      silverfox
        .get("users")
        .push({
          username: username,
          userID: userID,
          role: role
        })
        .write();
      this.success = true;
      break;
    }
  },
  remove: function (type, dbSelect, userID) {
    switch (dbSelect) {
    case "hosts":
      const findHosts = hosts
        .get("users")
        .find({ userID: userID })
        .value();
      const findStaffHosts = stafftrack
        .get("staff")
        .find({ userID: userID })
        .value();
      if (findHosts != undefined) {
        hosts
          .get("users")
          .remove({ userID: userID })
          .write();
        this.success = true;
      } else {
        this.success = false;
      }
      if (findStaffHosts != undefined) {
        stafftrack
          .get("staff")
          .remove({ userID: userID })
          .write();
      }
      break;
    case "managers":
      const findManagers = managers
        .get("users")
        .find({ userID: userID })
        .value();
      const findStaffManagers = stafftrack
        .get("staff")
        .find({ userID: userID })
        .value();
      if (findManagers != undefined) {
        managers
          .get("users")
          .remove({ userID: userID })
          .write();
        this.success = true;
      } else {
        this.success = false;
      }
      if (findStaffManagers != undefined) {
        stafftrack
          .get("staff")
          .remove({ userID: userID })
          .write();
      }
      break;
    case "bouncers":
      const findBouncers = bouncers
        .get("users")
        .find({ userID: userID })
        .value();

      const findStaffBouncers = stafftrack
        .get("staff")
        .find({ userID: userID })
        .value();
      if (findBouncers != undefined) {
        bouncers
          .get("users")
          .remove({ userID: userID })
          .write();
        this.success = true;
      } else {
        this.success = false;
      }
      if (findStaffBouncers != undefined) {
        stafftrack
          .get("staff")
          .remove({ userID: userID })
          .write();
      }
      break;
    case "greyfox":
      const findGreyFox = greyfox
        .get("users")
        .find({ userID: userID })
        .value();
      if (findGreyFox != undefined) {
        greyfox
          .get("users")
          .remove({ userID: userID })
          .write();
        this.success = true;
      } else {
        this.success = false;
      }

      break;
    case "redfox":
      const findRedFox = redfox
        .get("users")
        .find({ userID: userID })
        .value();
      if (findRedFox != undefined) {
        redfox
          .get("users")
          .remove({ userID: userID })
          .write();
        this.success = true;
      } else {
        this.success = false;
      }
      break;
    case "arcticfox":
      const findArcticFox = arcticfox
        .get("users")
        .find({ userID: userID })
        .value();
      if (findArcticFox != undefined) {
        arcticfox
          .get("users")
          .remove({ userID: userID })
          .write();
        this.success = true;
      } else {
        this.success = false;
      }
      break;
    case "silverfox":
      const findSilverFox = silverfox
        .get("users")
        .find({ userID: userID })
        .value();
      if (findSilverFox != undefined) {
        silverfox
          .get("users")
          .remove({ userID: userID })
          .write();
        this.success = true;
      } else {
        this.success = false;
      }
      break;
    }
  },
  getHosts: function () {
    this.host = hosts
      .get("users")
      .map("userID")
      .value();
  },
  getManagers: function () {
    this.manager = managers
      .get("users")
      .map("userID")
      .value();
  },
  getBouncers: function () {
    this.bouncer = bouncers
      .get("users")
      .map("userID")
      .value();
  },
  getGreyFox: function () {
    this.greyfoxes = greyfox
      .get("users")
      .map("userID")
      .value();
  },
  getRedFox: function () {
    this.redfoxes = redfox
      .get("users")
      .map("userID")
      .value();
  },
  getArcticFox: function () {
    this.arcticfoxes = arcticfox
      .get("users")
      .map("userID")
      .value();
  },
  getSilverFox: function () {
    this.silverfoxes = silverfox
      .get("users")
      .map("userID")
      .value();
  },
  getAllStaff: function () {
    this.getHosts();
    this.getManagers();
    this.getBouncers();
  },
  checkIfStaff: function (userID) {
    this.getAllStaff();
    if (this.host.indexOf(userID) > -1) {
      this.isStaff = true;
    } else if (this.manager.indexOf(userID) > -1) {
      this.isStaff = true;
    } else if (this.bouncer.indexOf(userID) > -1) {
      this.isStaff = true;
    } else {
      this.isStaff = false;
    }
  },
  getManagersHosts: function () {
    this.getHosts();
    this.getManagers();
  },
  checkIfManagerHost: function (userID) {
    this.getManagersHosts();
    if (this.host.indexOf(userID) > -1) {
      this.isManagerHost = true;
    } else if (this.manager.indexOf(userID) > -1) {
      this.isManagerHost = true;
    } else {
      this.isManagerHost = false;
    }
  },
  checkIfHost: function (userID) {
    this.getHosts();
    if (this.host.indexOf(userID) > -1) {
      this.isHost = true;
    } else {
      this.isHost = false;
    }
  },
  getAllDonors: function () {
    this.getGreyFox();
    this.getRedFox();
    this.getArcticFox();
    this.getSilverFox();

  },
  getSomeDonors: function () {
    this.getRedFox();
    this.getArcticFox();
    this.getSilverFox();
  },
  getHighDonors: function () {
    this.getArcticFox();
    this.getSilverFox();
  },
  getSilverDonors: function () {
    this.getSilverFox();
  },
  checkIfDonor: function (userID) {
    this.getAllDonors();
    if (this.greyfoxes.indexOf(userID) > -1) {
      this.isDonor = true;
    } else if (this.redfoxes.indexOf(userID) > -1) {
      this.isDonor = true;
    } else if (this.arcticfoxes.indexOf(userID) > -1) {
      this.isDonor = true;
    } else if (this.silverfoxes.indexOf(userID) > -1) {
      this.isDonor = true;
    } else {
      this.isDonor = false;
    }
  },
  checkIfRedArcticSilver: function (userID) {
    this.getSomeDonors();
    if (this.redfoxes.indexOf(userID) > -1) {
      this.isRedArcticSilver = true;
    } else if (this.arcticfoxes.indexOf(userID) > -1) {
      this.isRedArcticSilver = true;
    } else if (this.silverfoxes.indexOf(userID) > -1) {
      this.isRedArcticSilver = true;
    } else {
      this.isRedArcticSilver = false;
    }
  },
  checkIfArcticSilver: function (userID) {
    this.getHighDonors();
    if (this.arcticfoxes.indexOf(userID) > -1) {
      this.isArcticSilver = true;
    } else if (this.silverfoxes.indexOf(userID) > -1) {
      this.isArcticSilver = true;
    } else {
      this.isArcticSilver = false;
    }
  },
  checkIfSilver: function (userID) {
    this.getSilverDonors();
    if (this.silverfoxes.indexOf(userID) > -1) {
      this.isSilver = true;
    } else {
      this.isSilver = false;
    }
  }

};