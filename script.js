
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const app = express();
const cors = require('cors');
const knex = require ('knex'); //for connecting to the db
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

app.post('/signin', (req, res) => {
	// bcrypt.compare(hash, function(err, res) {
	// 	//res == true
	// });
	// bcrypt.compare("", hash, function(err, res) {
	// 	// res = false
	// });

	if(req.body.email === database.users[0].email &&
		req.body.password === database.users[0].password) {
		res.json(database.users[0]);
	}else{
		res.status(400).json('error logging in');
	}
})

app.post('/register', (req, res) => {
	const { email, name, password } = req.body;
	bcrypt.hash(password, null, null, function(err, hash) {
		console.log(hash)
	})

	db('users')
	.returning('*')
	.insert({
		name: name,
		email: email,
		joined: new Date()
	})
	.then(user => {
		res.json(user[0])
	})
	.catch(err => res.status(400).json('unable to register'))
	
})


app.get('/profile/:id', (req, res) => {
	const {id} = req.params;
		db.select('*').from('users').where({id})
	.then(user => {
		if (user.length) {
			res.json(user[0]);
		} else {
			res.status(400).json('Not found')
		}
	})
	.catch(err => res.status(400).json('error getting user'))
	
})

app.put('/image', (req, res) =>{
	const {id} = req.body;
  db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
  	//error checking for if the id doesn't exist??
  	res.json(entries[0]);
  })
  .catch(err => res.status(400).json('unable to get entries'))
})

app.listen(3001, ()=> {
	console.log('app is running on port 3001');
})


