const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const voteLog = lowdb(new FileSync("databases/fun/votelog.json"));
module.exports = {
  voteCount: 0,
  voteString: "",
  currentVoters: [],
  getPrevious: function (songID) {
    const findVoteLog = voteLog.get('song').find({ id: songID }).map().value();
    this.voteCount = findVoteLog[6];
    if (this.voteCount == 1) {
      this.voteString = `${this.voteCount} vote.`
    } else {
      this.voteString = `${this.voteCount} votes.`
    }
  },
  writeToVoteLog: function (name, artist, id, dj, djID, timePlayed) {
    this.voteCount = 0;
    this.currentVoters = []
    voteLog.get('song').push({
      name: name,
      artist: artist,
      id: id,
      DJ: dj,
      DJID: djID,
      timePlayed: timePlayed,
      votes: 0
    }).write()
  },
  addVoter: function (songID, voterID) {
    this.currentVoters.push(voterID);
    this.voteCount++;
    const addLog = voteLog.get('song').find({ id: songID }).map().value();
    voteLog.get('song').find({ id: songID }).assign({ votes: this.voteCount }).write();
  }

}