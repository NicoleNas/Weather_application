define([
  "knockout",
  "ojs/ojchart",
  "ojs/ojdatetimepicker",
  "ojs/ojcontext",
  "ojs/ojmodule-element-utils",
  "ojs/ojresponsiveutils",
  "ojs/ojresponsiveknockoututils",
  "ojs/ojcorerouter",
  "ojs/ojarraydataprovider",
  "ojs/ojknockouttemplateutils",
  "ojs/ojmodule-element",
  "ojs/ojknockout",
], function (
  ko,
  ojChart,
  InputDateElement,
  ResponsiveUtils,
  ResponsiveKnockoutUtils,
  ArrayDataProvider,
  KnockoutTemplateUtils
) {
  function DashboardViewModel() {
    const self = this;

    self.isNowSelected = ko.observable(true);
    self.isTodaySelected = ko.observable(false);
    self.isDateSelected = ko.observable(false);
    self.isApplyClicked = ko.observable(false);
    self.selectedDate = ko.observable(null);
    self.selectedVal = ko.observable();

    self.currentWeather = {
      temp: ko.observable(null),
      feels_like: ko.observable(null),
      pressure: ko.observable(null),
      humidity: ko.observable(null),
      wind_speed: ko.observable(null),
      wind_deg: ko.observable(null),
      wind_gust: ko.observable(null),
      description: ko.observable(null),
      icon: ko.observable(null),
    };

    self.forecastWeather = {
      tempAvg: ko.observable(null),
      feelsLikeAvg: ko.observable(null),
      pressure: ko.observable(null),
      humidity: ko.observable(null),
      wind_speed: ko.observable(null),
      wind_deg: ko.observable(null),
      wind_gust: ko.observable(null),
      description: ko.observable(null),
      icon: ko.observable(null)
  };

  self.temperatureData = ko.observableArray([]);
  self.chartGroups = ko.observableArray([]);

    self.selectedVal.subscribe(function (value) {
      self.selectedDate(value);
      self.isApplyButtonEnabled();
    });

    self.isApplyButtonEnabled = ko.computed(function () {
      return self.selectedDate() !== null && self.selectedDate() !== "";
    });

    self.isTodaySelectedClicked = function () {
      self.isNowSelected(false);
      self.isTodaySelected(true);
      self.isDateSelected(false);
      self.isApplyClicked(false);
    };

    self.isDateSelectedClicked = function () {
      self.isNowSelected(false);
      self.isTodaySelected(false);
      self.isDateSelected(!self.isDateSelected());
    };

    self.isNowSelectedClicked = function () {
      self.isNowSelected(true);
      self.isTodaySelected(false);
      self.isDateSelected(false);
      self.isApplyClicked(false);
    };

    self.applyDate = function () {
      self.isApplyClicked(!self.isApplyClicked());
    };

    function getCurrentAndFiveDaysAhead() {
      const currentDate = new Date();
      const fiveDaysAhead = new Date();
      fiveDaysAhead.setDate(currentDate.getDate() + 5);

      const currentDateFormatted = currentDate.toISOString().split("T")[0];
      const fiveDaysAheadFormatted = fiveDaysAhead.toISOString().split("T")[0];

      return { currentDateFormatted, fiveDaysAheadFormatted };
    }

    const { currentDateFormatted, fiveDaysAheadFormatted } =
      getCurrentAndFiveDaysAhead();

    self.minDate = ko.observable(currentDateFormatted);
    self.maxDate = ko.observable(fiveDaysAheadFormatted);

    self.updateViewModelData = function (data) {
      self.currentWeather.temp(data.current.temp);
      self.currentWeather.feels_like(data.current.feels_like);
      self.currentWeather.pressure(data.current.pressure);
      self.currentWeather.humidity(data.current.humidity);
      self.currentWeather.wind_speed(data.current.wind_speed);
      self.currentWeather.wind_deg(data.current.wind_deg);
      self.currentWeather.wind_gust(data.current.wind_gust);
      self.currentWeather.description(data.current.weather[0].description);
      self.currentWeather.icon(
        `http://openweathermap.org/img/wn/${data.current.weather[0].icon}.png`
      );
    };

    self.updateForecastData = function (data) {
      const today = data.daily[0];
      const tempAvg = (today.temp.day + today.temp.eve + today.temp.morn + today.temp.night) / 4;
      const feelsLikeAvg = (today.feels_like.day + today.feels_like.eve + today.feels_like.morn + today.feels_like.night) / 4;

      self.forecastWeather.tempAvg(tempAvg.toFixed(2));
      self.forecastWeather.feelsLikeAvg(feelsLikeAvg.toFixed(2));
      self.forecastWeather.pressure(today.pressure);
      self.forecastWeather.humidity(today.humidity);
      self.forecastWeather.wind_speed(today.wind_speed);
      self.forecastWeather.wind_deg(today.wind_deg);
      self.forecastWeather.wind_gust(today.wind_gust);
      self.forecastWeather.description(today.weather[0].description);
      self.forecastWeather.icon(`http://openweathermap.org/img/wn/${today.weather[0].icon}.png`);
  };

  self.updateForecastMaxTemperatures = function (data) {
    const temperatures = data.daily.slice(0, 7).map((day, index) => (index + 1,
      day.temp.max)
    );

    const days = data.daily.slice(0, 7).map((day) => {
      const date = new Date(day.dt * 1000);
      return `${date.toLocaleDateString()}`;
    });

    self.temperatureData([ {items: temperatures} ]);
    console.log(self.temperatureData());
    self.chartGroups(days);
  };

    // API call
    const apiUrl =
      "https://api.openweathermap.org/data/2.5/onecall?lat=40.58725980318928&lon=22.948223362612612&exclude=hourly,minutely&appid=11b0499bd13ab56063de7565a440eb97&units=metric";

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        self.updateViewModelData(data);
        self.updateForecastData(data);
        self.updateForecastMaxTemperatures(data);
      })
      .catch((error) =>
        console.error("There has been a problem fetching data", error)
      );
  }
  return DashboardViewModel;
});
