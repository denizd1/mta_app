const express = require("express");
const cors = require("cors");
// const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser')

const helmet = require('helmet');
const rateLimit = require('express-rate-limit')
const db = require(__dirname +"/models");
const fs = require('fs');

const path = __dirname + '/views/';
const app = express();
const Role = db.role;

var corsOptions = {
  origin: "http://localhost:8081"
};


//Limiter
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})


app.use(helmet());
app.use(limiter)
app.use(express.static(path));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(cookieParser())



require(__dirname +"/routes/tutorial.routes")(app);
require(__dirname +'/routes/auth.routes')(app);
require(__dirname +'/routes/user.routes')(app);


db.sequelize.sync();
// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   initial();
// });

app.get('/', function (req,res) {
  res.sendFile(path + "index.html");
});

app.get('/api/getGeoJson:val', function(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
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