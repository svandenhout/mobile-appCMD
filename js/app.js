(function() {
"use strict";

var dairy = [],
    imageBlob;

/*
  --DairyLog constructor--

  title: String,
  message: String,
  image: String,
  location: {lng: Number, lat: Number}
*/
function DairyLog(title, message, image, location) {
  this.title = title;
  this.message = message,
  this.image = image
  this.location = location
  this.date = new Date();
};

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
  if(dairy) this.dairyLogs = JSON.parse(dairy);
};

Dairy.prototype.buildLogs = function() {
  var HTMLlogs = "";
  for(var i = 0; i < this.dairyLogs.length; i++) {
    var parseDate = new Date(this.dairyLogs[i].date).toLocaleDateString();
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
    var removeBtn = 
        "<button class='removeLog' index='" + i + "'>remove</button>";

    HTMLlogs = HTMLlogs + 
        "<li class='log'>"
        + title
        + message
        + image
        + removeBtn
        "</li>";
  }
  return HTMLlogs;
};

Dairy.prototype.removeLog = function(index) {
  this.dairyLogs.splice(index, 1);
  sessionStorage.setItem("dairy", JSON.stringify(this.dairyLogs));
}

// index listeners
if($(".logList").length > 0) {
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

// form listeners
$(".newLogImage").on("change", function(e) {
  var files = e.target.files;

  var reader = new FileReader();
  reader.readAsDataURL(files[0]);
  reader.onload = function(e) {
    imageBlob = reader.result;
  }
});

$(".newLogForm").submit(function(e) {
  e.preventDefault();

  var log = new DairyLog(
    $(".newLogTitle").val(),
    $(".newLogMessage").val(),
    imageBlob,
    {}
  );

  if(sessionStorage.getItem("dairy"))
      dairy = JSON.parse(sessionStorage.getItem("dairy"));

  dairy.push(log.getLog());

  sessionStorage.setItem("dairy", JSON.stringify(dairy));
  window.location = "index.html"
});

})();