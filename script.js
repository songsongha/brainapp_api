
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const app = express();
const cors = require('cors');
const knex = require ('knex'); //for connecting to the db

const pg = knex ({
  client: 'pg',
  connection: {
    host : '127.0.0.1', //same as local host
    user : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD,
    database : 'brainapp'
  }
});

console.log(pg.select('*').from('users'));

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
	database.users.push({
		id: '125',
		name: name,
		email: email,
		password: password,
		entries: '0',
		joined: new Date()
	})
	res.json(database.users[database.users.length-1]);
})


app.get('/profile/:id', (req, res) => {
	const {id} = req.params;
	let found = false;
	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			return res.json(user);
		} 
	})
	
	if (!found) {
		res.status(404).json('no such user');
		}
})

app.put('/image', (req, res) =>{
	const {id} = req.body;
	let found = false;
	database.users.forEach(user => {
	if (user.id === id) {
		found = true;
		user.entries++
		return res.json(user.entries);
	} 
	})
	
	if (!found) {
		res.status(404).json('no such user');
		}
})

app.listen(3001, ()=> {
	console.log('app is running on port 3001');
})


