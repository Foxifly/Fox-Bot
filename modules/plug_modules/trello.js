const settings = require("../../settings/settings.js");
const Trello = require("trello");
const trello = new Trello(settings.trelloKey, settings.trelloToken);


module.exports = {
  isAdded: false,
  addCard: function (userName, userID, staffName, duration) {
    if (userName && userID && staffName && duration) {
      let addCard = trello.addCard(userName, `Banned by ${staffName}`, '59a389ea8dfa3a408abdabd9');
      addCard.then((card) => {
        this.userNameCustom(userName, card.id);
        this.userIDCustom(userID, card.id);
        this.lengthCustom(duration, card.id);
      }).catch(console.error);
    }
  },
  userNameCustom: function (userName, cardID) {
    trello.editCustomFields(cardID, '5a98670fd6afbd6de1cbde57', userName, function (error, card) { //cardid, fieldid, value, callback
      if (error) {
        console.log(error);
      }
    })
  },
  userIDCustom: function (userID, cardID) {
    trello.editCustomFields(cardID, '5a98670fd6afbd6de1cbde59', userID, function (error, card) { //cardid, fieldid, value, callback
      if (error) {
        console.log(error);
      }
    })
  },
  reasonCustom: function (reason, cardID) {
    trello.editCustomFields(cardID, '5a98670fd6afbd6de1cbde5b', reason, function (error, card) { //cardid, fieldid, value, callback
      if (error) {
        console.log(error);
      }
    })
  },
  lengthCustom: function (duration, cardID) {
    let value, labelID;
    if (duration == "permanently") {
      value = "5a98670fd6afbd6de1cbde60";
      labelID = "59a388ef0849ea56504269e0"
    } else if (duration == "for an hour") {
      value = "5a98670fd6afbd6de1cbde5e";
      labelID = "59a37e741314a339994962b3"
    } else if (duration == "for a day") {
      value = "5a98670fd6afbd6de1cbde5f";
      labelID = "59a37e741314a339994962b3";
    }
    if (value) {
      trello.editOptionField(cardID, '5a98670fd6afbd6de1cbde5d', value, function (error, card) {
        if (error) {
          console.log(error);
        }
      });
      trello.addLabelToCard(cardID, labelID, function (error, card) {
        if (error) {
          console.log(error);
        }
      })
    }
  },
  addEarrapeCard: function (userName, userID, staffName, duration) {
    if (userName && userID && staffName && duration) {
      let addCard = trello.addCard(userName, `Banned by ${staffName}`, '59a389ea8dfa3a408abdabd9');
      addCard.then((card) => {
        this.userNameCustom(userName, card.id);
        this.userIDCustom(userID, card.id);
        this.lengthCustom(duration, card.id);
        setTimeout(() => {
          this.reasonCustom("Earrape/porn", card.id);
          this.addEarrapeLabel(card.id, "59a37e741314a339994962b7");
        }, 1000);

      }).catch(console.error);
    }
  },

  addEarrapeLabel: function (cardID, labelID) {
    trello.addLabelToCard(cardID, labelID, function (error, card) {
      if (error) {
        console.log(error);
      }
    })
  },
  suggestString: "",
  handleSuggest: function (toSuggest, suggestion, suggestedFrom) {
    let listID, userSuggestion;
    switch (toSuggest) {
    case "foxbot":
      listID = "5994a96ec34a7b44e9dd640a";
      suggestion = suggestion.substring(7).trim();
      if (suggestion) {
        userSuggestion = suggestion;
      }
      break;
    case "theme":
      listID = "5995030422039aae7a527d55";
      suggestion = suggestion.substring(6).trim();
      if (suggestion) {
        userSuggestion = suggestion;
      }
      break;
    case "discord":
      listID = "5994dd3f5acdef1a2704964f"
      suggestion = suggestion.substring(8).trim();
      if (suggestion) {
        userSuggestion = suggestion;
      }
      break;
    case "website":
      listID = "5994e13a38eb96f7f606e55a";
      suggestion = suggestion.substring(8).trim();
      if (suggestion) {
        userSuggestion = suggestion;
      }
      break;
    }
    if (listID && suggestion) {
      this.suggestString = `Added your suggestion to our ${toSuggest} suggestion list, Thank you!`
      trello.addCard(userSuggestion, `Suggestion from ${suggestedFrom}`, listID,
        function (error, trelloCard) {
          if (error) {
            console.log('Could not add card:', error);
          }
        });
    } else {
      this.suggestString = "Invalid suggestion. !suggest [foxbot/theme/discord/website] [msg]"
    }
  }
}



/*



{ raw: { m: 'Foxifly', mi: 3439856, t: 'Sėkmės', d: 'f' },
  duration: 'Forever',
  moderator:
   User {
     avatarID: 'pixel-e01',
     badge: 'dinerb-s05',
     blurb: undefined,
     gRole: 0,
     grab: false,
     id: 3439856,
     ignores: undefined,
     joined: '2012-12-07 02:59:49.485000',
     language: null,
     level: 19,
     notifications: undefined,
     pp: undefined,
     pw: undefined,
     rawun: 'Foxifly',
     role: 5000,
     silver: true,
     slug: null,
     status: 1,
     sub: 1,
     username: 'Foxifly',
     vote: 0,
     xp: undefined },
  user: 'Sėkmės' }*/