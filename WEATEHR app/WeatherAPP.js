console.log('WeatherAPP');
let weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=skopje&units=metric&APPID=2095b65c75e8d13fe9e3b0e095b36936`

/*
CITY-NAME-HERE => we need to add the CITY here; => DONE
*/

/*
1. Create a HTML file; => DONE
2. Creat a JS file; => DONE
3. Connecte the JS file with the HTML file and test it;
4. Create a function that makes API request tot he corresponding URL (Use Jquerie's AJAX);
5. Select thoes elements;
6. Create a function that makes API request to the corresponding URL (Use jquerie's AJAX);
7. Analyse the response, think about what you may use or what needs to be generetaed;
8. FEEL FREE TO ADD THE MORE STEPS;
NOTE: Feel free to use bootstrap 
*/

/*****  START *****/
let mainContainer = document.getElementById("mainContainer");
let cityInput = document.getElementById("cityInput");
let weatherBtn = document.getElementById("weatherBtn");
let printDiv = document.getElementById("partOneContainer");
let printTables = document.getElementById("partTwoContainer");
let icon = document.getElementById("icon");
let hourlyData = document.getElementById("page2Coment");

// Helper object for response maping
let cityData = {};
let tablesData = [
    {},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}
]; // ne se smejte za extra hard codov:)) haha
let headers = [`Icon`, `Description`, `Date`, `Tempeture`, `Humidity`, `Wind speed`];

// API CALL with Jquery
function getCity(){
    let helper = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput.value}&units=metric&APPID=2095b65c75e8d13fe9e3b0e095b36936`;

    $.ajax({
        url: helper,
        method: "GET",

        success: function(response){
            console.log(response);

            getFirstInfo(response);
            getMaxTemp(response);
            getAvgTemp(response);
            getMinMaxHumidity(response);
            getAvgHumidity(response);
            getWarmest(response);
            getColdest(response);

            printInfo(cityData)

            getTablesInfo(response);
            printTablesHTML(response);
        },

        error: function(error){
            alert(`Dwaa you got error!`, error)
        },
    });
};

// REGULAR info as i uderstood list[0] is the latest info
function getFirstInfo(response){
    cityData.name =  response.city.name;
    cityData.currentTemp = response.list[0].main.temp;
    cityData.feelsLike = response.list[0].main.feels_like;

    //Clouds icons function
    cityData.icon = response.list[0].weather[0].icon// i think this is the latest
};

// HUMIDITY  Min & Max Function
function getMinMaxHumidity(response){
    cityData.maxHumidity = 0;
    cityData.minHumidity = 60;

    for(let i = 0; i < response.list.length; i++){
        if(response.list[i].main.humidity < cityData.minHumidity){
            cityData.minHumidity = response.list[i].main.humidity;
        }
        else if(response.list[i].main.humidity > cityData.maxHumidity){
            cityData.maxHumidity = response.list[i].main.humidity;
        };
    };
    return cityData.minHumidity,cityData.maxHumidity;
};

// TEMPETURE Max&Min function
function getMaxTemp(response){
    cityData.maxTemp = 0;
    cityData.minTemp = 2;

    for(let i = 0; i < response.list.length; i++){
        if(response.list[i].main.temp_min < cityData.minTemp){
            cityData.minTemp = response.list[i].main.temp_min
        }
        else if(response.list[i].main.temp_max > cityData.maxTemp){
            cityData.maxTemp = response.list[i].main.temp_max
        };
    };
    return cityData.maxTemp, cityData.minTemp
};

// Only way for avg temp that i tought of
function getAvgTemp(response){
    cityData.avgTemp = (cityData.maxTemp + cityData.minTemp) / 2;
};

//HUMIDITY Avg Function
function getAvgHumidity(response){
    let avgHumidity = 0;

    for(let i = 0; i < response.list.length; i++){
        avgHumidity  += response.list[i].main.humidity
    };
    return cityData.avgHumidity = avgHumidity / response.list.length;
};

// Warmest time of the period
function getWarmest(response){
    let max = 0;
    cityData.warmestTimeOfThePeriod = "";

    for(let i = 0; i < response.list.length; i++){
        if(response.list[i].main.temp_max > max){
            max = response.list[i].main.temp_max;
            cityData.warmestTimeOfThePeriod = response.list[i].dt_txt;
        };
    };
    return cityData.warmestTimeOfThePeriod;
};

// Coldest time of the period
function getColdest(response){
    let min = 60;
    cityData.coldestTimeOfThePeriod = "";

    for(let i = 0; i < response.list.length; i++){
        if(response.list[i].main.temp_min < min){
            min = response.list[i].main.temp_min;
            cityData.coldestTimeOfThePeriod = response.list[i].dt_txt;
        
        };
    };
    return cityData.coldestTimeOfThePeriod;
};

// Main EVENT
weatherBtn.addEventListener("click", () => {
    getCity()
    hourlyData.style.visibility='visible'
});

//Tables info page 2
function getTablesInfo(response){
        
    for(let i = 0; i < response.list.length; i++){

        tablesData[i].icon = response.list[i].weather[0].icon
        tablesData[i].decription = response.list[i].weather[0].description
        tablesData[i].date = response.list[i].dt_txt
        tablesData[i].temp = response.list[i].main.temp
        tablesData[i].hum = response.list[i].main.humidity
        tablesData[i].windSpeed = response.list[i].wind.speed
        // console.log(response.list[i])

    };
};

// PRINT Page 1
function printInfo(cityObject){
    
    printDiv.innerHTML += `
    <h1> Weather Forcast </h1>
    <br />
    <h3> City name: ${cityObject.name} </h3>
    <h3> Current temp: ${cityObject.currentTemp} </h3>
    <h3> Clouds: <img src="http://openweathermap.org/img/w/${cityData.icon}.png"></img></h3>
    <h4> Max temp: ${cityData.maxTemp} </h4>
    <h4> Max hum: ${cityData.maxHumidity} </h4>
    <h4> Avg temp: ${cityData.avgTemp} </h4>
    <h4> Avg hum: ${cityData.avgHumidity} </h4>
    <h4> Min temp: ${cityData.minTemp} </h4>
    <h4> Min hum: ${cityData.minHumidity} </h4>
    <h4> Warmest time of the period: ${cityData.warmestTimeOfThePeriod} </h4>
    <h4> Coldest time of the period: ${cityData.coldestTimeOfThePeriod} </h4>
    `
};

// Printing Tables info
function printTablesHTML(){
    let table = document.createElement(`table`);
    let headRow = document.createElement(`tr`);

    headers.forEach(headerText => {
        let header = document.createElement('th');
        let textNode = document.createTextNode(headerText);
        header.appendChild(textNode);
        headRow.appendChild(header);
    });
    table.appendChild(headRow);

    tablesData.forEach((emp, index) => {
        let row =document.createElement('tr');

        Object.values(emp).forEach((text, i) => {
            let cell = document.createElement('td');
            if(i === 0){
                let img = document.createElement("img")
                img.src = `http://openweathermap.org/img/w/${text}.png`
                cell.appendChild(img);
            }
            else{
                let textNode = document.createTextNode(text);
                cell.appendChild(textNode);
                console.log(text,i);
                
            }
            row.appendChild(cell);
        })
        table.appendChild(row);
    });
    printTables.appendChild(table);
};