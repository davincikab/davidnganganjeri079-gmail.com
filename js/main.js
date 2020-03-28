// Initialize a map object
var data_url = "../data/places.geojson";
var county_url = "../data/county.geojson";
var world_data = "../data/world.geojson";

var map = L.map('map',{
    center: [-.9980, 37.81807708740236],
    zoom:6,
    maxZoom:25,
    minZoom:5
});

// Add a tilelayers
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// osm.addTo(map);

var layer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}' + (L.Browser.retina ? '@2x.png' : '.png'), {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20,
    minZoom: 0
});

layer.addTo(map);

// County data
var kenyanConties = L.geoJson(null,{
    style:function(feature){
        return{
            weight:0.4,
            fillColor:setLayerStyle(feature.properties.Confirmed_Cases),
            color:'#fff',
            fillOpacity:0.6
        }
    },
    onEachFeature:function(feature,layer){
        let popupContent = createPopupContent(feature);
        layer.bindPopup(popupContent);
    },
    filter:function(feature){
        return feature?true:false;
    }
}).addTo(map);

// Create a popup content.
function createPopupContent(feature){
    console.log("Feature");
    return  "<div class='card'>"+
        "<div class='card-header text-center bg-info'>"+
        "<p class='card-title'>"+ feature.properties.COUNTY_NAM+"</p>"+
        "</div>"+
        "<div class='card-body'>"+
        "<table>"+
        "<tr class='text-warning'><td>Confirmed Cases&nbsp&nbsp</td><td>"+feature.properties.Confirmed_Cases+"</td></tr>"+
        "<tr class='text-success'><td>Recovered</td><td>"+feature.properties.Recovered+"</td></tr>"+
        "<tr class='text-danger'><td>Death Count</td><td>"+feature.properties.Death+"</td></tr>"+
        "</table>"+
        "</div>"+
        "</div>";
}

// Update the layer styling
function setLayerStyle(value){
    if (value < 3) {
        return '#DC5';
    }else if(value < 6){
        return '#DC3545';
    }else if(value < 9){
        return '#DC3545';
    }else{
        return '#BBCCE4';
    }
}

var worldData = L.geoJson(null,{}).addTo(map);

// Load the data Layers
var hospitals  = L.geoJson(null,{}).addTo(map);
var towns = L.geoJson(null,{}).addTo(map);
var markets = L.geoJson(null,{}).addTo(map);

// read the data using jquery getJSON method
$.getJSON(county_url)
  .done(function(data){
    populateData(data);
  })  
  .fail(function(error){
      console.log("Failed to load the data");
});

// Leaflet timslider
getDataAddMarkers = function ({ label, value, map, exclamation }){
    // Updatet the markers
    console.log(label);
}

L.control.timelineSlider({
    timelineItems: ["2009", "2010", "2011", "2015", "2020"],
    changeMap: getDataAddMarkers,
    extraChangeMapParams: { exclamation: "Hello World!" }
});
// .addTo(map);   

function populateData(data){
    data.features.forEach(datum=>{
        datum.properties['Confirmed_Cases'] = parseInt(Math.random(0,1)*10);
        datum.properties['Recovered'] = parseInt(Math.random(0,1)*10);
        datum.properties['Death'] = parseInt(Math.random(0,1)*10);

        return datum;
    });

    kenyanConties.addData(data);
}

// function weekly
function weeklyData(){
    createLinePlot();
}

// Extract daily data
function dailyData(){
    createLinePlot();
}

// Extract monthly data
function monthlyData(){
    createLinePlot();
}

createLinePlot("Home");

// Create plots: time 
function createLinePlot(data){
    // clean the data

    // Create a plot: using Chart.js

    // Chart animation
    var ctx = document.getElementById("linechart");
      if (ctx !== null) {
        var chart = new Chart(ctx, {
          // The type of chart we want to create
          type: "line",

          // The data for our dataset
          data: {
            labels: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec"
            ],
            datasets: [
              {
                label: "",
                backgroundColor: "transparent",
                borderColor: "rgb(82, 136, 255)",
                data: [
                  0,
                  0,
                  25
                ],
                lineTension: 0.3,
                pointRadius: 5,
                pointBackgroundColor: "rgba(255,255,255,1)",
                pointHoverBackgroundColor: "rgba(255,255,255,1)",
                pointBorderWidth: 2,
                pointHoverRadius: 8,
                pointHoverBorderWidth: 1
              }
            ]
          },

          // Configuration options go here
          options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              display: false
            },
            layout: {
              padding: {
                right: 10
              }
            },
            scales: {
              xAxes: [
                {
                  gridLines: {
                    display: false
                  }
                }
              ],
              yAxes: [
                {
                  gridLines: {
                    display: true,
                    color: "#eee",
                    zeroLineColor: "#eee",
                  },
                  ticks: {
                    callback: function (value) {
                      var ranges = [
                        { divider: 1e6, suffix: "M" },
                        { divider: 1e4, suffix: "k" }
                      ];
                      function formatNumber(n) {
                        for (var i = 0; i < ranges.length; i++) {
                          if (n >= ranges[i].divider) {
                            return (
                              (n / ranges[i].divider).toString() + ranges[i].suffix
                            );
                          }
                        }
                        return n;
                      }
                      return formatNumber(value);
                    }
                  }
                }
              ]
            },
            tooltips: {
              callbacks: {
                title: function (tooltipItem, data) {
                  return data["labels"][tooltipItem[0]["index"]];
                },
                label: function (tooltipItem, data) {
                  return data["datasets"][0]["data"][tooltipItem["index"]];
                }
              },
              responsive: true,
              intersect: false,
              enabled: true,
              titleFontColor: "#888",
              bodyFontColor: "#555",
              titleFontSize: 12,
              bodyFontSize: 18,
              backgroundColor: "rgba(256,256,256,0.95)",
              xPadding: 20,
              yPadding: 10,
              displayColors: false,
              borderColor: "rgba(220, 220, 220, 0.9)",
              borderWidth: 2,
              caretSize: 10,
              caretPadding: 15
            }
          }
        });
      }
}

donutChart("data");
function donutChart(data){
    var mydeviceChart = new Chart(deviceChart, {
          type: "doughnut",
          data: {
            labels: ["Affected", "No Affected"],
            datasets: [
              {
                label: ["Affected", "No Affected"],
                data: [4,43],
                backgroundColor: [
                  "#DC3545",
                  "#008000",
                ],
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              display: false
            },
            cutoutPercentage: 50,
            rotation:1*Math.PI,
            circumference:1*Math.PI,
            tooltips: {
              callbacks: {
                title: function (tooltipItem, data) {
                  return data["labels"][tooltipItem[0]["index"]];
                },
                label: function (tooltipItem, data) {
                  return (
                    data["datasets"][0]["data"][tooltipItem["index"]] + " Counties"
                  );
                }
              },

              titleFontColor: "#888",
              bodyFontColor: "#555",
              titleFontSize: 12,
              bodyFontSize: 15,
              backgroundColor: "rgba(256,256,256,0.95)",
              displayColors: true,
              xPadding: 10,
              yPadding: 7,
              borderColor: "rgba(220, 220, 220, 0.9)",
              borderWidth: 2,
              caretSize: 6,
              caretPadding: 5
            }
          }
        });
}

/*
    TODO: Find data on:
        - Hospitals
        - Measures
        - Deaths
        - Confirmed
        - Recovered

    Integrate papaParse
    Add a spinner: Show data processing
    Links to websites
    Phone numbers or SMS, USSD etc
*/