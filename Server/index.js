const express = require("express");
const app = express();

console.log("weeeeeeee")

app.get('/', (req, res) => {
   res.send("Hello world!");
})

app.get("/test", (req, res) => {
   console.log("You did the thing!!!");
   res.send("You did the thing!!!")
})

app.listen(3001, () => console.log("Server up and running on port 3001!"));
