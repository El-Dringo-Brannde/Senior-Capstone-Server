const app = require('express')();
const io = require('./websockets/sockets'); // start socket.io
const mongo = require('mongodb');
const salesRoutes = require('./components/sales/routes');
const sessionRoutes = require('./components/session/routes');
const bodyParser = require('body-parser');

const url = require('./config/mongoURL')


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: false
}))


mongo.connect(url, (err, database) => {
   if (err)
      throw err
   const mongoDB = database.db('seniorCapstone')

   app.use('/sales', salesRoutes(mongoDB, io));
   app.use('/session', sessionRoutes());

   app.listen(3105, () => console.log('Server initialize finished, running on port 3105!')); // start server
});
