/**
 * A top-level require call executed by the Application.
 * Although 'knockout' would be loaded in any case (it is specified as a  dependency
 * by some modules), we are listing it explicitly to get the reference to the 'ko'
 * object in the callback
 */
 require(['ojs/ojbootstrap', 'knockout', './appController', 'ojs/ojlogger', 'ojs/ojknockout',
 'ojs/ojmodule', 'ojs/ojnavigationlist', 'ojs/ojbutton', 'ojs/ojtoolbar'],
 function (Bootstrap, ko, app, Logger) { // this callback gets executed when all required modules are loaded
   Bootstrap.whenDocumentReady().then(
    function() {
      ko.applyBindings(app, document.getElementById('globalBody'));
    }
  );
 }
);
