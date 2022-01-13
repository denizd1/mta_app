const express = require("express");
const cors = require("cors");

const path = __dirname + '/views/';

const app = express();
const fs = require('fs');

app.use(express.static(path));

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("../app/routes/tutorial.routes")(app);
require('../app/routes/auth.routes')(app);
require('../app/routes/user.routes')(app);
const db = require("../app/models");
const Role = db.role;

db.sequelize.sync();
// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   initial();
// });

app.get('/', function (req,res) {
  res.sendFile(path + "index.html");
});

app.get('/api/getGeoJson:val', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  val = req.params.val
  if(val == 0){
    fs.createReadStream(__dirname + '/tr-cities-utf8.geojson').pipe(res);
  }
  if(val == 25){
    fs.createReadStream(__dirname + '/pafta25000.geojson').pipe(res);
  }
  
  if(val == 100){
    fs.createReadStream(__dirname + '/pafta100000.geojson').pipe(res);
  }
  if(val == 500){
    fs.createReadStream(__dirname + '/pafta500000.geojson').pipe(res);
  }
  
});


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.create({
    id: 1,
    name: "user"
  });
 
  Role.create({
    id: 2,
    name: "moderator"
  });
 
  Role.create({
    id: 3,
    name: "admin"
  });
}