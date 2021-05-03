
const express = require('express');
const bodyParser = require('body-parser'); // for handling JSON
const bcrypt = require('bcrypt-nodejs');
const app = express();
const cors = require('cors'); // allows us to connect to the front end, using fetch
const knex = require ('knex'); //for connecting to the db
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
require('dotenv').config();

const db = knex ({
  client: 'pg',
  connection: {
    host : '127.0.0.1', //same as local host
    user : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD,
    database : 'brainapp'
  }
});


app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
// do we need to have anything in here?
})

app.post('/signin', (req,res) => { signin.handleSignin(req, res, db, bcrypt)})
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt)})
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)})
app.put('/image', (req, res) =>{image.handleImage(req, res, db)})
app.post('/imageurl', (req,res) =>{image.handleApiCall(req, res)})

app.listen(process.env.PORT || 3001, ()=> {
	console.log('app is running on port 3001 ${process.env.PORT}');
})


