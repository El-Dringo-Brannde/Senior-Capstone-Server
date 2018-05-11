/**
 * Alexa can sometimes timeout a session, or a user can accidently/on purpose
 * end the session
 *
 * Keep track of the current session to provide a smoother experience
 */
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
