<!DOCTYPE html>
<html>
  <meta name="viewport" content="width=device-width" />

  <head>
    <title>My events</title>
    <!-- 
      If no icons are specified using a link element, the website root directory is searched for icons with the apple-touch-icon... prefix.
    --> 
    <link rel="icon" sizes="192x192" href="apple-touch-icon-192x192.png">
    <link rel="icon" sizes="128x128" href="apple-touch-icon-128x128.png">
    <link href="stylesheets/style.css" rel="stylesheet" type="text/css">

  </head>
  <body>
    <button class="showHideForm showForm"> New log </button>
    <div class="logList">
    </div>

    <form class="newLogForm">
      <label class="label" for="newLogTitle"> title: </label>
      <input type="text" class="newLogTitle" id="newLogTitle"/></br>
      <div class='clear'></div>

      <label class="label" for="newLogMessage"> message: </label>
      <textarea rows="10" cols="40" class="newLogMessage" id="newLogMessage"></textarea></br>
      <div class='clear'></div>

      <label class="label" for="newLogImage"> select image: </label>
      <input type="file" class="newLogImage" id="newLogImage" name="image"/>
      <span class="status"></span>
      <div class='clear'></div>

      <button class="hideForm submit"> Save </button>
      <button class="hideForm cancel"> Cancel </button>
    </form>

    <script type="text/javascript" src="js/lib/zepto.min.js"></script>
    <script type="text/javascript" src="js/lib/fx.js"></script>
    <script type="text/javascript" src="js/app.js"/></script>
  </body>
</html>