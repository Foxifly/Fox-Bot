const settings = require("../../settings/settings.js");
const MsTranslator = require("mstranslator");
const client = new MsTranslator({
    api_key: settings.translatorKey
  },
  true
);

module.exports = {
  translatedString: "",
  targetLanguage: "",
  toTranslate: "",
  getLanguage: function (msg) {
    return new Promise((resolve, reject) => {

      if (msg.startsWith("portuguese")) {
        this.targetLanguage = "PORTUGUESE"
        let message = msg.substring(11);
        this.toTranslate = message;
        let params = {
          text: message,
          from: 'en',
          to: 'pt'
        };
        client.detect(params, (err, data) => {
          if (err) { reject(err) }
          let language = data;
          client.translate(params, (err, data) => {
            if (err) { reject(err) }
            this.translatedString = data;
            resolve(this);
          })
        });
      } else if (msg.startsWith("french")) {
        this.targetLanguage = "FRENCH";
        let message = msg.substring(7)
        this.toTranslate = message;
        let params = {
          text: message,
          from: 'en',
          to: 'fr'
        };
        client.detect(params, (err, data) => {
          if (err) { reject(err) }
          let language = data;
          client.translate(params, (err, data) => {
            if (err) { reject(err) }
            this.translatedString = data;
            resolve(this);
          })
        });
      } else if (msg.startsWith("german")) {
        this.targetLanguage = "GERMAN";
        let message = msg.substring(7)
        this.toTranslate = message;
        let params = {
          text: message,
          from: 'en',
          to: 'de'
        };
        client.detect(params, (err, data) => {
          if (err) { reject(err) }
          let language = data;
          client.translate(params, (err, data) => {
            if (err) { reject(err) }
            this.translatedString = data;
            resolve(this);
          })
        });
      } else if (msg.startsWith("finnish")) {
        this.targetLanguage = "FINNISH";
        let message = msg.substring(8);
        this.toTranslate = message;
        let params = {
          text: message,
          from: 'en',
          to: 'fi'
        };
        client.detect(params, (err, data) => {
          if (err) { reject(err) }
          let language = data;
          client.translate(params, (err, data) => {
            if (err) { reject(err) }
            this.translatedString = data;
            resolve(this);
          })
        });
      } else if (msg.startsWith("dutch")) {
        this.targetLanguage = "DUTCH";
        let message = msg.substring(6);
        this.toTranslate = message;
        let params = {
          text: message,
          from: 'en',
          to: 'nl'
        };
        client.detect(params, (err, data) => {
          if (err) { reject(err) }
          let language = data;
          client.translate(params, (err, data) => {
            if (err) { reject(err) }
            this.translatedString = data;
            resolve(this);
          })
        });
      } else if (msg.startsWith("spanish")) {
        this.targetLanguage = "SPANISH";
        let message = msg.substring(8)
        this.toTranslate = message;
        let params = {
          text: message,
          from: 'en',
          to: 'es'
        };
        client.detect(params, (err, data) => {
          if (err) { reject(err) }
          let language = data;
          client.translate(params, (err, data) => {
            if (err) { reject(err) }
            this.translatedString = data;
            resolve(this);
          })
        });
      } else {
        this.targetLanguage = "ENGLISH"
        this.toTranslate = msg;
        let params = {
          text: msg,
          to: 'en'
        };
        client.detect(params, (err, data) => {
          if (err) { reject(err) }
          let language = data;
          let params = {
            text: msg,
            from: language,
            to: 'en'
          }
          client.translate(params, (err, data) => {
            if (err) { reject(err) }
            this.translatedString = data;
            resolve(this);
          })
        })
      }
    });
  }
}