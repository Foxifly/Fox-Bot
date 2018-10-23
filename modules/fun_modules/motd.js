const settings = require("../../settings/botsettings.json");
module.exports = {
  motdMessage: "",
  motdResponse: "",
  getMOTDStatus: function (msg) {
    if (msg.startsWith("set")) {
      let message = msg.substring(4).trim();
      if (message == "") {
        this.motdResponse = "Please enter a message to display as the MOTD."
      } else {
        if (this.motdMessage == "") {
          this.motdMessage = message;
          this.motdResponse = "MOTD set successfully. To turn off please use !motd off"
          settings.motds = true;
        } else {
          this.motdMessage = message;
          this.motdResponse = "MOTD changed succesfully. To turn off please use !motd off";
          settings.motds = true;
        }
      }
    } else {
      switch (msg) {
      case "clear":
      case "off":
        if (this.motdMessage == "") {
          this.motdResponse = "MOTD is already empty. Nothing to clear."
        } else {
          settings.motds = false;
          this.motdMessage = "";
          this.motdResponse = "Successfully cleared the MOTD."
        }
        break;
      case "show":
      case "display":
      case "message":
      case "msg":
        if (this.motdMessage == "") {
          this.motdResponse = "No MOTD has been set. Nothing to display."
        } else {
          this.motdResponse = this.motdMessage;
        }
        break;
      default:
        this.motdResponse = "Invalid usage. !motd [off/show/set]"
      }
    }
  }
}