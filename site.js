$(document).ready(function() {

    function displayRecipes() {

        event.preventDefault();
        $('#recipe-display').empty();

        // queryURL is the url we'll use to query the API
        let veg1in = $('#ingredient1').val().trim();
        let veg2in = $('#ingredient2').val().trim(); 
        let veg3in = $('#ingredient3').val().trim();
        let veg1 = "";
        let veg2 = ""; 
        let veg3 = "";
      
        if (veg1in !== "" && veg2in !== ""){
            
            veg1 = veg1in + ",";
            //alert("Veg 2 DNE");
        }
        else if (veg1in !== "" && veg2in === ""){
            
            veg1 = veg1in;
        }
    
        if (veg2in !== "" && veg3in !== ""){
            
            veg2 = veg2in + ",";
        }
        else if (veg2in !== "" && veg3in === ""){
            
            veg2 = veg2in;
            
        }
      
        const recipeSearch = "https://api.edamam.com/search?q=" + veg1 + veg2 + veg3 + "&app_id=a653f161&app_key=ff7f8bea67da7c853af3604e42724627&from=0&to=5";
      
        // Begin building an object to contain our API call's query parameters
        // Set the API key
        $.ajax({
            url: recipeSearch,
            method: "GET"
        }).then(function(response) {
      
            // Creating elements to hold the stuff         //var pOne = $("<p>").text("Rating: " + rating);
            for (let j=0; j < response.hits.length; j++){
        
            let recipeName = response.hits[j].recipe.label;
            let recipeImg = response.hits[j].recipe.image;
            let recipeURL = response.hits[j].recipe.url;
        
            const recipeDiv = $('<div class="card mb-4" style="width: 12rem;">');
            const recipeTextWrapper1 = $('<div class="card-body text-center">');
        
            const recipeTitle = $(`<h5 class="card-title">${recipeName}</h5>`);
            const recipeImage = $(`<img src=${recipeImg} class='card-img-top'>`);
            const recipeLink = $(`<a target="_blank" href=${recipeURL} class="btn btn-primary">Get Recipe</a>`);
        
        
            // Appending the stuff
            recipeDiv.append(recipeImage);
            recipeDiv.append(recipeTextWrapper1);
                recipeTextWrapper1.append(recipeTitle);
            recipeDiv.append(recipeLink) 
            

            
            $("#recipe-display").append(recipeDiv);
          }     
      });
    }
    
    $(document).on("click", "#ingredient-submit", displayRecipes);

    /* Market API Call and Click Function */
    function marketQuery() {
        event.preventDefault();
        const zip = $('#zip-code-input').val();
        
        if(zip.length === 5) {
            $('.zip-label').text('Find your closest markets!')

            const queryURL = 'https://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=' + zip

            $('#markets-div').empty();

            $.ajax({
                type: 'GET',
                url: queryURL,
                success: function(response) {
                    const results = response;
                    let newMap
                    const newMapDiv = $('<div>').addClass('col-12 col-sm-10 col-md-11 col-lg-11 col-xl-11 rounded border').attr('id', 'market-map').css('height', '400px');
                    const newMarketsDiv = $('<div>').addClass('p-2 col-12 col-sm-10 col-md-11 col-lg-11 col-xl-11 mt-4 rounded border').attr('id', 'market-display');
                    const secondQueryURL = 'https://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=' + results.results[0].id
                    $.ajax({
                        type: 'GET',
                        url: secondQueryURL,
                        success: function(response) {
                            const googleMapURL = response.marketdetails.GoogleLink
                            const frontChop = googleMapURL.split('q=');
                            const backChop = frontChop[1].split('(');
                            const lonLatChop = backChop[0].split('%2C');
                            const latChop = lonLatChop[1].split('%20');
                            const lon = lonLatChop[0];
                            const lat = latChop[1];

                            newMap = L.map('market-map').setView([lon, lat], 11);

                            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                            maxZoom: 18,
                            id: 'mapbox.streets',
                            accessToken: 'pk.eyJ1IjoiZ2VvZmZkZ2VvcmdlIiwiYSI6ImNqdDZ0MWs2OTBra2UzeW9tb3E5bjRrZXgifQ.b1DgqJBsKuz7T2qhGHBkAw'
                            }).addTo(newMap);
                        }
                    })

                    for(i = 0; i < results.results.length; i++) {
                        const marketID = results.results[i].id;
                        const marketName = results.results[i].marketname.substring(4);
                        const newDiv = $('<div>').addClass('border-bottom border-success p-2');
                        const newName = $('<h4>');
                        newName.text(marketName);
                        newName.appendTo(newDiv);

                        const thirdQueryURL = 'https://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=' + marketID
                        $.ajax({
                            type: 'GET',
                            url: thirdQueryURL,
                            success: function(response) {
                                const secondaryResults = response;

                                const marketMapURL = secondaryResults.marketdetails.GoogleLink;
                                const frontChop = marketMapURL.split('q=');
                                const backChop = frontChop[1].split('(');
                                const lonLatChop = backChop[0].split('%2C');
                                const latChop = lonLatChop[1].split('%20');
                                const lon = lonLatChop[0];
                                const lat = latChop[1];
                                const marker = L.marker([lon, lat]).addTo(newMap);

                                const marketAddress = secondaryResults.marketdetails.Address;
                                const marketSchedule = secondaryResults.marketdetails.Schedule.replace(/( <br> <br> <br> )/g,'').replace(/(;<br> <br> <br> )/g,'').replace(/(;<br> <br> )/g,'');
                                const newAddress = $('<p>');
                                const newSchedule = $('<p>');
                                newAddress.html('<b>Address:</b> ' + marketAddress);
                                if(marketSchedule) {
                                    newSchedule.html('<b>Schedule:</b><br>' + marketSchedule);
                                } else {
                                    newSchedule.html('<b>Schedule:</b><br>Schedule not available.');
                                }
                                
                                newAddress.appendTo(newDiv);
                                newSchedule.appendTo(newDiv);

                                marker.bindPopup(marketName + '<br>' + marketAddress);
                            }
                        })
                        newDiv.appendTo(newMarketsDiv);
                        newMapDiv.appendTo($('#markets-div'));
                        newMarketsDiv.appendTo($('#markets-div'));
                    }
                }
            })
        } else {
            $('.zip-label').text('Please enter a valid five-digit zip code.')
        }
    }

    $('#zip-code-submit').click(marketQuery)

})