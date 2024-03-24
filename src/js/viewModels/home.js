define(['knockout', 'ojs/ojchart', 'ojs/ojcontext', 'ojs/ojmodule-element-utils', 'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', 'ojs/ojcorerouter', 'ojs/ojarraydataprovider', 'ojs/ojknockouttemplateutils', 'ojs/ojmodule-element', 'ojs/ojknockout'],
 function(ko, ojChart, Context, moduleUtils, ResponsiveUtils, ResponsiveKnockoutUtils, CoreRouter, ArrayDataProvider, KnockoutTemplateUtils) {
    function DashboardViewModel() {
      const self = this;

      self.isNowSelected = ko.observable(true);
      self.isTodaySelected = ko.observable(false);
      self.isDateSelected = ko.observable(false);

      self.isTodaySelectedClicked = function () {
        self.isNowSelected(false);
        self.isTodaySelected(true);
        self.isDateSelected(false);
      };

      self.isDateSelectedClicked = function () {
        self.isNowSelected(false);
        self.isTodaySelected(false);
        self.isDateSelected(true);
      };

      self.isNowSelectedClicked = function () {
        self.isNowSelected(true);
        self.isTodaySelected(false);
        self.isDateSelected(false);
      };

      self.temperatureData = ko.observableArray([
        {items: [
          (1,16), (2,18), (3,21), (4,17)
        ]}
      ]);

      self.chartGroups = ko.observableArray(["Day 1", "Day 2", "Day 3", "Day 4"]);

      // add code here

      self.connected = () => {
       };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      self.disconnected = () => {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      self.transitionCompleted = () => {
        // Implement if needed
      };
    }

    /*
     * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
     * return a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.
     */
    return DashboardViewModel;
  }
);
