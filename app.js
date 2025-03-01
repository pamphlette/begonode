// app.js

/*
    SETUP - contains all of the variables we will need to effectively run the server and handle data
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 9448;                 // Set a port number at the top so it's easy to change in the future
// http://classwork.engr.oregonstate.edu:9443/

//forever start app.js
//node app.js 
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.


//Database
var db      = require('./database/db-connector')

// app.js SETUP
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));


/*
    ROUTES
*/
app.get('/', function(req, res)                 // This is the basic syntax for what is called a 'route'
{
    let showSpecies = "SELECT * FROM Species ORDER BY speciesName ASC;"; // Define our query

        db.pool.query(showSpecies, function(error, rows, fields){    // Execute the query
            let species = rows;
            res.render('index', {data: rows, species: species});                  // Render the index.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we
});                                                             // received back from the query

//CREATE A SPECIES
app.post('/add-species-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    //Capture NULL values
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

//DELETE A SPECIES
app.delete('/delete-species-ajax/', function(req,res,next){
    let data = req.body;
    let speciesID = parseInt(data.id);
    //let delete_SpeciesTraits = `DELETE FROM SpeciesTraits WHERE speciesID = ?`;
    //let delete_SpeciesEvents = `DELETE FROM HybridizationEvents WHERE ovaryID = ?`;
    let delete_Species= `DELETE FROM Species WHERE speciesID = ?`;
  
          // Run the 1st query
          db.pool.query(delete_Species, [speciesID], function(error, rows, fields) {
              if (error) {
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log("error w species, ID: " + `${speciesID}`);
                res.sendStatus(400);

              } else { 
                res.sendStatus(204);
              }
            })
})

app.put('/put-species-ajax', function(req,res,next){
    let data = req.body;
  
    let speciesID = parseInt(data['speciesName']);

    //Capture NULL values
    let section = data['subSection'];
    if (!section) section = null;

    let chromosomeCount = parseInt(data['chromosomeCount']);
    if (isNaN(chromosomeCount)) 
    {
        chromosomeCount = 'NULL'
    }

    let country = data['originCountry'];
    if (!country) country = null;

    let queryUpdateSpecies = `UPDATE Species SET subSection = ?, chromosomeCount = ?, originCountry = ? WHERE speciesID = ?`;
    let selectSpecies = `SELECT * FROM Species WHERE speciesID = ?`

          // Run the 1st query
          db.pool.query(queryUpdateSpecies, [section, chromosomeCount, country, speciesID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the people's
              // table on the front-end
              else
              {
                  // Run the second query
                  db.pool.query(selectSpecies, [speciesID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
  })});

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});

