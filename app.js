// load our app server using express

const express = require('express')
const session = require('express-session');
const app = express()
const morgan = require('morgan')
const mysql = require('mysql')
const cors = require('cors')


const bodyParser = require('body-parser')

app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://127.0.0.1:8081");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

app.use(morgan('combined'))

app.use(express.static('public'));
//Connect nodejs to MySQL
function getConnection(){
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'polymer-pagination'
    });
}
const connection = getConnection();



//Get movies with page
app.get("/movies/:offset", (req, res) => {
    const queryString = `SELECT * FROM movies LIMIT 4 OFFSET ${req.params.offset}`;
    const movies = connection.query(queryString, (err, rows, fields) =>{
        if (err) throw err;
        console.log("I Think we fetch posts successfully")
        res.json(rows)
    });
})

//get number of movies
app.get("/moviescount", (req, res) => {
    const queryString = `SELECT COUNT(*) as total FROM movies`;
    const postscount = connection.query(queryString, (err, rows, fields) =>{
        if (err) throw err;
        console.log("We known how many posts")
        res.json(rows)
    });
})

// localhost:3000
app.listen(3000, () => {
    console.log("Server is listening up on 3000")
})