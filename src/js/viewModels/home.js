define([
  "knockout",
  "ojs/ojchart",
  "ojs/ojdatetimepicker",
  "ojs/ojresponsiveutils",
  "ojs/ojresponsiveknockoututils",
  "ojs/ojarraydataprovider",
  "ojs/ojknockouttemplateutils",
  "ojs/ojknockout",
  "text!views/WeatherDataHtml.html",
  "!viewModels/api"
], function (
  ko,
  ojChart,
  InputDateElement,
  ResponsiveUtils,
  ResponsiveKnockoutUtils,
  ArrayDataProvider,
  KnockoutTemplateUtils,
  oj,
  WeatherDataHtml,
) {
  function DashboardViewModel() {
    const self = this;

    self.isNowSelected = ko.observable(true);
    self.isTodaySelected = ko.observable(false);
    self.isDateSelected = ko.observable(false);
    self.isApplyClicked = ko.observable(false);
    self.selectedDate = ko.observable(null);
    self.weatherDataHtml = ko.observable({
      viewModel: self,
      view: WeatherDataHtml
  });
    self.weatherData = ko.observable();

    self.weatherProps = {
      tempAvg: ko.observable(null),
      feelsLikeAvg: ko.observable(null),
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

    self.temperatureData = ko.observableArray([]);
    self.chartGroups = ko.observableArray([]);

    self.isTodaySelectedClicked = function () {
      self.isNowSelected(false);
      self.isTodaySelected(true);
      self.isDateSelected(false);
      self.isApplyClicked(false);

      if (self.weatherData()) {
        self.updateForecastData(self.weatherData());
      } else {
        console.error("Weather data not available for 'Today'.");
      }
    };

    self.isDateSelectedClicked = function () {
      self.selectedDate("");
      self.isNowSelected(false);
      self.isTodaySelected(false);
      self.isDateSelected(true);
    };

    self.isNowSelectedClicked = function () {
      self.isNowSelected(true);
      self.isTodaySelected(false);
      self.isDateSelected(false);
      self.isApplyClicked(false);

      self.updateViewModelData(mockData);
    };

    self.isApplyButtonEnabled = ko.computed(function () {
      return self.selectedDate() !== null && self.selectedDate() !== "";
    });

    self.applyDate = function () {

      self.isApplyClicked(true);
    
      if (self.weatherData() && self.selectedDate()) {
        const selectedDateData = self.findDataForSelectedDate(self.weatherData(), self.selectedDate());
        if (selectedDateData) {
          self.updateSelectedDateWeather(selectedDateData);
        } else {
          console.error("No data available for the selected date.");
        }
      } else {
        console.error("No date selected or data available.");
      }
    };
    
    self.findDataForSelectedDate = function (data, selectedDate) {
      const date = new Date(selectedDate);
      return data.daily.find(day => {
        const dayDate = new Date(day.dt * 1000);
        return dayDate.toISOString().split('T')[0] === date.toISOString().split('T')[0];
      });
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

    const formatWithUnit = (value, unit) => {
      if (value === null || value === undefined) {
      return "No Data";
    }
    return `${value}${unit}`;
  };
  
    self.updateViewModelData = function (data) {
      self.weatherProps.temp(formatWithUnit(data.current.temp, ' °C'));
      self.weatherProps.feels_like(formatWithUnit(data.current.feels_like, ' °C'));
      self.weatherProps.pressure(formatWithUnit(data.current.pressure, ' hPa'));
      self.weatherProps.humidity(formatWithUnit(data.current.humidity, ' %'));
      self.weatherProps.wind_speed(formatWithUnit(data.current.wind_speed, ' m/s'));
      self.weatherProps.wind_deg(formatWithUnit(data.current.wind_deg, ' °'));
      self.weatherProps.wind_gust(formatWithUnit(data.current.wind_gust, ' m/s'));
      self.weatherProps.description(data.current.weather[0].description);
      self.weatherProps.icon(`http://openweathermap.org/img/wn/${data.current.weather[0].icon}.png`);
  };

    self.updateForecastData = function (data) {
      const today = data.daily[0];
      const tempAvg = (today.temp.day + today.temp.eve + today.temp.morn + today.temp.night) / 4;
      const feelsLikeAvg = (today.feels_like.day + today.feels_like.eve + today.feels_like.morn + today.feels_like.night) / 4;

      self.weatherProps.tempAvg(formatWithUnit(tempAvg.toFixed(2), ' °C'));
      self.weatherProps.feelsLikeAvg(formatWithUnit(feelsLikeAvg.toFixed(2),' °C'));
      self.weatherProps.pressure(formatWithUnit(today.pressure, ' hPa'));
      self.weatherProps.humidity(formatWithUnit(today.humidity, ' %'));
      self.weatherProps.wind_speed(formatWithUnit(today.wind_speed, ' m/s'));
      self.weatherProps.wind_deg(formatWithUnit(today.wind_deg, ' °'));
      self.weatherProps.wind_gust(formatWithUnit(today.wind_gust, ' m/s'));
      self.weatherProps.description(today.weather[0].description);
      self.weatherProps.icon(`http://openweathermap.org/img/wn/${today.weather[0].icon}.png`);
  };

  self.updateSelectedDateWeather = function (selectedDateData) {
    const tempAvg = (selectedDateData.temp.day + selectedDateData.temp.eve + selectedDateData.temp.morn + selectedDateData.temp.night) / 4;
    const feelsLikeAvg = (selectedDateData.feels_like.day + selectedDateData.feels_like.eve + selectedDateData.feels_like.morn + selectedDateData.feels_like.night) / 4;

    self.weatherProps.tempAvg(formatWithUnit(tempAvg.toFixed(2), ' °C'));
    self.weatherProps.feelsLikeAvg(formatWithUnit(feelsLikeAvg.toFixed(2),' °C'));
    self.weatherProps.pressure(formatWithUnit(selectedDateData.pressure, ' hPa'));
    self.weatherProps.humidity(formatWithUnit(selectedDateData.humidity, ' %'));
    self.weatherProps.wind_speed(formatWithUnit(selectedDateData.wind_speed, ' m/s'));
    self.weatherProps.wind_deg(formatWithUnit(selectedDateData.wind_deg, ' °'));
    self.weatherProps.wind_gust(formatWithUnit(selectedDateData.wind_gust, ' m/s'));
    self.weatherProps.description(selectedDateData.weather[0].description);
    self.weatherProps.icon(`http://openweathermap.org/img/wn/${selectedDateData.weather[0].icon}.png`);
};

  self.updateForecastMaxTemperatures = function (data) {
    const temperatures = data.daily.slice(0, 7).map((day, index) => (index + 1,
      day.temp.max)
    );

    const days = data.daily.slice(0, 7).map((day) => {
      const date = new Date(day.dt * 1000);
      return date.toLocaleDateString();
    });

    self.temperatureData([ {items: temperatures} ]);
    self.chartGroups(days);
  };

    function simulateFetchData() {
      self.weatherData(mockData);
      self.updateViewModelData(mockData);
      self.updateForecastMaxTemperatures(mockData);
    }
    
    simulateFetchData();

    //API call
    // const apiUrl =
    //   "https://api.openweathermap.org/data/2.5/onecall?lat=40.58725980318928&lon=22.948223362612612&exclude=hourly,minutely&appid=bb34f7ce943c039db388b40a8fae4f31&units=metric";

    // fetch(apiUrl)
    //   .then((response) => {
    //     if (!response.ok) {
    //       throw new Error("Network response was not ok");
    //     }
    //     return response.json();
    //   })
    //   .then((data) => {
    //      self.weatherData(mockData);
         // self.updateViewModelData(mockData);
         // self.updateForecastMaxTemperatures(mockData);
    //   })
    //   .catch((error) =>
    //     console.error("There has been a problem fetching data", error)
    //   );
  }
  return DashboardViewModel;
});