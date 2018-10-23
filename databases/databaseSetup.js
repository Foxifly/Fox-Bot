const lowdb = require("lowdb");
const jsonname = "changelog";
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync(jsonname + ".json");
const db = lowdb(adapter);

//?

db.defaults({ versions: [] }).write();

console.log(" Database Created: " + jsonname);