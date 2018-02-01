class sessionTracker {
   constructor() {
      this.sessions = {};
   }

   addSession(sessionID) {
      this.sessions[sessionID] = sessionID;
   }

   getSession(sessionID) {
      return this.sessions[sessionID];
   }

   removeSession(sessionID) {
      delete this.sessions[sessionID];
   }
}
let session = new sessionTracker();
module.exports = session;