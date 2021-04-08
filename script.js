
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const app = express();
const cors = require('cors');
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

const database = {
	users:[
		{
			id: '123',
			name: 'John',
			email: 'john@email.com',
			password: 'cookies',
			entries: '0',
			joined: new Date()
		},
		{
			id: '124',
			name: 'Sally',
			email: 'sally@email.com',
			password: 'bananas',
			entries: '0',
			joined: new Date()
		}

	]
}

app.get('/', (req, res) => {
	res.send(database.users);
})

app.post('/signin', (req,res) => { signin.handleSignin(req, res, db, bcrypt)})
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt)})
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)})
app.put('/image', (req, res) =>{image.handleImage(req, res, db)})
app.post('/imageurl', (req,res) =>{image.handleApiCall(req, res)})

app.listen(3001, ()=> {
	console.log('app is running on port 3001');
})


