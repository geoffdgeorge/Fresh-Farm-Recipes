$(document).ready(function() {

    function marketQuery() {
        event.preventDefault();
        const zip = $('#zip-code-input').val();
        const queryURL = 'https://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=' + zip

        $.ajax({
            type: 'GET',
            url: queryURL,
            success: function(response) {
                const results = response;
                let newMap
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

                        newMap = L.map('market-map').setView([lon, lat], 10);

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
                    const newDiv = $('<div>');
                    const newName = $('<h3>');
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
                            const marketSchedule = secondaryResults.marketdetails.Schedule;
                            const newAddress = $('<p>');
                            const newSchedule = $('<p>');
                            newAddress.text(marketAddress);
                            newSchedule.html(marketSchedule);
                            newAddress.appendTo(newDiv);
                            newSchedule.appendTo(newDiv);

                            marker.bindPopup(marketName + '<br>' + marketAddress);
                        }
                    })
                    newDiv.appendTo($('#market-display'));
                }
            }
        })
    }

    $('#zip-code-submit').click(marketQuery)

})