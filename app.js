// app.js

/*
    SETUP - contains all of the variables we will need to effectively run the server and handle data
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

var db      = require('./database/db-connector')
PORT        = 9441;                 // Set a port number at the top so it's easy to change in the future
// http://classwork.engr.oregonstate.edu:9443/

//forever start app.js
//node app.js 

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

/*
    ROUTES
*/
app.get('/', function(req, res)                 // This is the basic syntax for what is called a 'route'
{
    let showSpecies = "SELECT speciesID,speciesName,subSection,chromosomeCount,originCountry FROM Species ORDER BY speciesName ASC;"; // Define our query

        db.pool.query(showSpecies, function(error, rows, fields){    // Execute the query

            res.render('index', {data: rows});                  // Render the index.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we
});                                                             // received back from the query


    //res.render('index');                    // Note the call to render() and not send(). Using render() ensures the templating engine
                                            // will process this file, before sending the finished HTML to the client.
    // // Define our queries
    // query1 = 'DROP TABLE IF EXISTS diagnostic;';
    // query2 = 'CREATE TABLE diagnostic(id INT PRIMARY KEY AUTO_INCREMENT, text VARCHAR(255) NOT NULL);';
    // query3 = 'INSERT INTO diagnostic (text) VALUES ("MySQL is working for BEGONIA GIT!")'; //replace with your onid
    // query4 = 'SELECT * FROM diagnostic;';

    // // Execute every query in an asynchronous manner, we want each query to finish before the next one starts
    // // by nesting each query() call, the next one will not start to run, until the previous one finishes.

    // // DROP TABLE...
    // db.pool.query(query1, function (err, results, fields){

    //     // CREATE TABLE...
    //     db.pool.query(query2, function(err, results, fields){

    //         // INSERT INTO...
    //         db.pool.query(query3, function(err, results, fields){

    //             // SELECT *...
    //             db.pool.query(query4, function(err, results, fields){

    //             // every db.pool.query() call takes two arguments. The first is the query we want to run, and the second is what
    //             // is called a callback function. This is the function that will run after the current function is done executing

    //                 // Send the results to the browser
    //                 res.send(JSON.stringify(results));
    //             });
    //         });
    //     });
    // });
//});                                        // requesting the web site.

app.post('/add-species-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    //Capture NULL values
    // let section = data['input-section'];
    // if (section == "")
    // {
    //     section = 'NULL'
    // }

    let section = data['input-section'];
    if (!section) section = null;
    else section = `'${data['input-section']}'`;

    let chromosomeCount = parseInt(data['input-chromosomes']);
    if (isNaN(chromosomeCount)) 
    {
        chromosomeCount = 'NULL'
    }

    let country = data['input-section'];
    if (!country) country = null;
    else country = `'${data['input-country']}'`;
    
    // let originCountry = data['input-country'];
    // if (originCountry == "")
    // {
    //     originCountry = 'NULL"
    // }

    // Create the query and run it on the database
    addSpecies = `INSERT INTO Species (speciesName, subSection, chromosomeCount, originCountry) VALUES ('${data['input-species']}', ${section}, ${chromosomeCount}, ${country});`;
    db.pool.query(addSpecies, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/');
        }
    })
})

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});

