// Importing all the necessary packages
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const session = require('express-session');
var cors = require('cors');

// Creating a new instance of the Express application.
const app = express();

// Let's load and configure the environment variables from a .env file located in the root directory of the project.
require("dotenv").config();

// Using the environment variables from the .env file
// Let's define a MongoDB connection string for a database named megan running on the local machine at 127.0.0.1 (localhost) on port 27017. Here I have used an environment variable MONGO_URL which is store in the .env file with, 
// MONGO_URL='mongodb://127.0.0.1:27017'
const url = `${process.env.MONGO_URL}/megan`;

//  Setting the port number that the Express application will listen to for incoming HTTP requests.
const port = process.env.PORT || 3000;

// Adding middleware to the Express application to parse incoming request bodies in JSON and URL-encoded formats.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World');
});

// These lines of code configure and establish a connection to a MongoDB database 
mongoose.set("strictQuery", false);
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Adding the 'express-session' middleware to the Express application. It configures it to use a session secret.
// In web development, a session is a way to store user data between requests.The express-session middleware is a popular middleware for handling sessions in Express.
app.use(session({
    secret: 'MEGAN stack'
}));

// Connecting to the MongoDB on our local machine
const db = mongoose.connection;

// Throws error in console if failed to connect to MongoDB
db.on('error', console.error.bind(console, 'connection error:'));

// Throws this message in console if successfully connected to MongoDB
db.once('open', function () {
    // We are connected to the database
    console.log('Connected to MongoDB server: Megan');
});

// The cors() middleware, which is used in the first line of code, enables Cross-Origin Resource Sharing for the Express application by setting the appropriate headers on the HTTP response.
app.use(cors());

// The Access-Control-Allow-Origin header allows cross-origin requests from the specified origin (http://127.0.0.1:5173/ in this case).
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Headers, *, Access-Control-Allow-Origin', 'Origin, X-Requested-with, Content_Type,Accept,Authorization', 'http://127.0.0.1:5173/');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
});


// Starting the Express application listening for incoming HTTP requests on a specified port and hostname.
app.listen(port, process.env.HOST_NAME, () => {
    console.log(`Server listening on http://${process.env.HOST_NAME}:${port}`);
});