// Get the objects we need to modify
let updateSpeciesForm = document.getElementById('update-species-form-ajax');

// Modify the objects we need
updateSpeciesForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputSpecies = document.getElementById("mySelect");
    let inputSection = document.getElementById("update-section");
    let inputChromo = document.getElementById("update-chromosomes");
    let inputCountry = document.getElementById("update-country");

    // Get the values from the form fields
    let species = inputSpecies.value;

    //Capture NULL values
    let section = inputSection.value;
    
    let chromosomeCount = inputChromo.value;
    
    let country = inputCountry.value;

    // Put our data we want to send in a javascript object
    let data = {
        speciesName: species,
        subSection: section,
        chromosomeCount: chromosomeCount,
        originCountry: country
    };
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-species-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, species);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, speciesID){
    let parsedData = JSON.parse(data);

    let updatedSpecies = parsedData[0]
    let table = document.getElementById("species-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == speciesID) {

            // Get the location of the row where we found the matching plant
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            //let td = updateRowIndex.getElementsByTagName("td")[3];
            //updateRowIndex.getElementsByTagName("td")[2].innerHTML = updatedSpecies.subSection
            // td.innerHTML = parsedData[1].subSection; 
            // td.innerHTML = parsedData[2].chromosomeCount; 
            // td.innerHTML = parsedData[3].originCountry; 
       }
    }
}