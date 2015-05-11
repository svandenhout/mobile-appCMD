(function() {
"use strict";

var dairy = [],
    imageBlob,
    currentLng,
    currentLat,
    loading = false,
    API_KEY = "AIzaSyCs1tA0Phu_oYzrCI9YJqlE2L6UHuwxx1w";

/*
  --DairyLog constructor--

  title: String,
  message: String,
  image: String,
  location: {lng: Number, lat: Number}
*/
function DairyLog(title, message, image, location) {
  this.title = title;
  this.message = message;
  this.image = image;
  this.location = location;
  this.date = new Date();
}

DairyLog.prototype.getLog = function() {
  var log = {
    title: this.title,
    message: this.message,
    image: this.image,
    location: this.location,
    date: this.date
  };
  return log;
};

/*
  --Dairy constructor--
*/
function Dairy() {
  var dairy = sessionStorage.getItem("dairy");
  if(dairy) {
    this.dairyLogs = JSON.parse(dairy);
  }else {
    this.dairyLogs = [];
  }
}

Dairy.prototype.__getAddressFromLatLng = function(latlng, callback) {
  var lat = this.dairyLogs.location.lat;
  var lng = this.dairyLogs.location.lng;

  var query = "latlng=" + lat + "," + lng + "&key=" + API_KEY;
  var geocode = 
      $.ajax("https://maps.googleapis.com/maps/api/geocode/json?" + query);
  geocode.done(function(data) {
    callback(data);
  });
};

Dairy.prototype.buildLogs = function() {
  var HTMLlogs = "";
  for(var i = 0; i < this.dairyLogs.length; i++) {
    var parseDate = new Date(this.dairyLogs[i].date).toLocaleDateString();
    var clear = "<div class='clear'></div>";
    var date = 
        "<span class='date'>" +
        parseDate + "</span>";
    var message = 
        (this.dairyLogs[i].message) ?
        "<p class='message'>" + this.dairyLogs[i].message + "</p>" : "";
    var title = 
        (this.dairyLogs[i].title) ?
        "<h1 class='title'>" + this.dairyLogs[i].title + "</h1>" : "";
    var image = 
        (this.dairyLogs[i].image) ?
        "<img src='"+ this.dairyLogs[i].image +"'/>" : "";
    var location = 
        "";
    var removeBtn = 
        "<button class='removeLog' index='" + i + "'>remove</button>";
    if(this.dairyLogs.location) {
      this.__getAddressFromLatLng(this.dairyLogs.location, function(data) {
        console.log(data);
      });
    }

    HTMLlogs = HTMLlogs +
        "<div class='log'>" +
          image +
          "<div class='textDiv'>" +
            title +
            message +
          "</div>" +
          location +
          removeBtn +
        "</div>";
  }
  return HTMLlogs;
};

Dairy.prototype.removeLog = function(index) {
  this.dairyLogs.splice(index, 1);
  sessionStorage.setItem("dairy", JSON.stringify(this.dairyLogs));
};

function buildLogList() {
  var dairy = new Dairy();
  $(".logList").html(dairy.buildLogs());
  // add remove listeners to logList
  var removeLog = function() {
    $(".removeLog").click(function() {
      dairy.removeLog($(this).attr("index"));
      $(".logList").html(dairy.buildLogs());
      removeLog();
    });
  };
  removeLog();
};

buildLogList();

$(".newLogForm").submit(function(e) {
  e.preventDefault();

  // not submitting during file load
  if(loading) return false;

  var latLng = {};
  if(currentLat) latLng.lat = currentLat;
  if(currentLng) latLng.lng = currentLng;
  
  var log = new DairyLog(
    $(".newLogTitle").val(),
    $(".newLogMessage").val(),
    imageBlob,
    latLng
  );

  if(sessionStorage.getItem("dairy"))
      dairy = JSON.parse(sessionStorage.getItem("dairy"));

  dairy.push(log.getLog());

  sessionStorage.setItem("dairy", JSON.stringify(dairy));
  buildLogList();
});

$(".showForm").click(function(e) {
  e.preventDefault();
  $(".newLogForm").animate({top: "50px"}, 200);
});

$(".hideForm.submit").click(function() {
  $(".newLogForm").animate({top: "100%"}, 200);
});

$(".hideForm.cancel").click(function(e) {
  e.preventDefault();
  $(".newLogForm").animate({top: "100%"}, 200);
});

// new form listeners
if("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(function(position) {
    currentLat = position.coords.latitude;
    currentLng = position.coords.longitude;
  });
}

$(".newLogImage").on("change", function(e) {
  var status = $(".status");
  var files = e.target.files;

  var reader = new FileReader();
  reader.readAsDataURL(files[0]);
  
  reader.onloadstart = function() {
    loading = true;
    status.html("loading");
  };

  reader.onprogress = function(e) {
    status.html(Math.round((e.total / e.loaded) * 100) + "%");
  };

  reader.onloadend = function() {
    loading = false;
    imageBlob = reader.result;
  };

  reader.onerror = function() {
    status.html(e)
  };
});

})();