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

    self.isApplyButtonEnabled = ko.computed(function () {
      return self.selectedDate() !== null && self.selectedDate() !== "";
    });

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

    const formatWithUnit = (value, unit) => value !== null ? `${value}${unit}` : null;
  
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
      return `${date.toLocaleDateString()}`;
    });

    self.temperatureData([ {items: temperatures} ]);
    self.chartGroups(days);
  };

    //   const mockData = {
    //   "lat": 40.5873,
    //   "lon": 22.9482,
    //   "timezone": "Europe/Athens",
    //   "timezone_offset": 7200,
    //   "current": {
    //     "dt": 1711297667,
    //     "sunrise": 1711254275,
    //     "sunset": 1711298644,
    //     "temp": 18.24,
    //     "feels_like": 17.4,
    //     "pressure": 1005,
    //     "humidity": 49,
    //     "dew_point": 7.36,
    //     "uvi": 0.1,
    //     "clouds": 20,
    //     "visibility": 10000,
    //     "wind_speed": 4.12,
    //     "wind_deg": 130,
    //     "weather": [
    //       {
    //         "id": 801,
    //         "main": "Clouds",
    //         "description": "few clouds",
    //         "icon": "02d"
    //       }
    //     ]
    //   },
    //   "daily": [
    //     {
    //       "dt": 1711274400,
    //       "sunrise": 1711254275,
    //       "sunset": 1711298644,
    //       "moonrise": 1711296300,
    //       "moonset": 1711253400,
    //       "moon_phase": 0.47,
    //       "temp": {
    //         "day": 16.77,
    //         "min": 9.25,
    //         "max": 18.24,
    //         "night": 12.56,
    //         "eve": 18.24,
    //         "morn": 9.33
    //       },
    //       "feels_like": {
    //         "day": 15.83,
    //         "night": 11.57,
    //         "eve": 17.4,
    //         "morn": 9.33
    //       },
    //       "pressure": 1010,
    //       "humidity": 51,
    //       "dew_point": 6.07,
    //       "wind_speed": 4.91,
    //       "wind_deg": 163,
    //       "wind_gust": 7.05,
    //       "weather": [
    //         {
    //           "id": 803,
    //           "main": "Clouds",
    //           "description": "broken clouds",
    //           "icon": "04d"
    //         }
    //       ],
    //       "clouds": 54,
    //       "pop": 0,
    //       "uvi": 4.2
    //     },
    //     {
    //       "dt": 1711360800,
    //       "sunrise": 1711340575,
    //       "sunset": 1711385106,
    //       "moonrise": 1711386240,
    //       "moonset": 1711340940,
    //       "moon_phase": 0.5,
    //       "temp": {
    //         "day": 13,
    //         "min": 9.54,
    //         "max": 15.33,
    //         "night": 9.54,
    //         "eve": 13.65,
    //         "morn": 10.52
    //       },
    //       "feels_like": {
    //         "day": 11.71,
    //         "night": 8.54,
    //         "eve": 12.09,
    //         "morn": 9.66
    //       },
    //       "pressure": 1006,
    //       "humidity": 52,
    //       "dew_point": 3,
    //       "wind_speed": 12.36,
    //       "wind_deg": 348,
    //       "wind_gust": 14.94,
    //       "weather": [
    //         {
    //           "id": 500,
    //           "main": "Rain",
    //           "description": "light rain",
    //           "icon": "10d"
    //         }
    //       ],
    //       "clouds": 44,
    //       "pop": 0.2,
    //       "rain": 0.14,
    //       "uvi": 4.48
    //     },
    //     {
    //       "dt": 1711447200,
    //       "sunrise": 1711426875,
    //       "sunset": 1711471569,
    //       "moonrise": 1711476300,
    //       "moonset": 1711428480,
    //       "moon_phase": 0.53,
    //       "temp": {
    //         "day": 16.08,
    //         "min": 7.72,
    //         "max": 16.68,
    //         "night": 12.31,
    //         "eve": 14,
    //         "morn": 7.72
    //       },
    //       "feels_like": {
    //         "day": 15.05,
    //         "night": 11.32,
    //         "eve": 13.18,
    //         "morn": 7.01
    //       },
    //       "pressure": 1014,
    //       "humidity": 50,
    //       "dew_point": 5.39,
    //       "wind_speed": 6.14,
    //       "wind_deg": 172,
    //       "wind_gust": 8.61,
    //       "weather": [
    //         {
    //           "id": 804,
    //           "main": "Clouds",
    //           "description": "overcast clouds",
    //           "icon": "04d"
    //         }
    //       ],
    //       "clouds": 98,
    //       "pop": 0.16,
    //       "uvi": 3.23
    //     },
    //     {
    //       "dt": 1711533600,
    //       "sunrise": 1711513176,
    //       "sunset": 1711558031,
    //       "moonrise": 1711566420,
    //       "moonset": 1711516080,
    //       "moon_phase": 0.56,
    //       "temp": {
    //         "day": 17.46,
    //         "min": 9.86,
    //         "max": 18.56,
    //         "night": 13.45,
    //         "eve": 18.46,
    //         "morn": 9.86
    //       },
    //       "feels_like": {
    //         "day": 16.8,
    //         "night": 13.2,
    //         "eve": 18.01,
    //         "morn": 8.76
    //       },
    //       "pressure": 1009,
    //       "humidity": 59,
    //       "dew_point": 8.98,
    //       "wind_speed": 4.13,
    //       "wind_deg": 186,
    //       "wind_gust": 5.31,
    //       "weather": [
    //         {
    //           "id": 804,
    //           "main": "Clouds",
    //           "description": "overcast clouds",
    //           "icon": "04d"
    //         }
    //       ],
    //       "clouds": 100,
    //       "pop": 0,
    //       "uvi": 3.44
    //     },
    //     {
    //       "dt": 1711620000,
    //       "sunrise": 1711599476,
    //       "sunset": 1711644492,
    //       "moonrise": 1711656720,
    //       "moonset": 1711603860,
    //       "moon_phase": 0.6,
    //       "temp": {
    //         "day": 17.49,
    //         "min": 12.04,
    //         "max": 19.18,
    //         "night": 12.04,
    //         "eve": 18.42,
    //         "morn": 12.61
    //       },
    //       "feels_like": {
    //         "day": 16.42,
    //         "night": 10.76,
    //         "eve": 17.39,
    //         "morn": 12.38
    //       },
    //       "pressure": 1006,
    //       "humidity": 43,
    //       "dew_point": 4.47,
    //       "wind_speed": 9.59,
    //       "wind_deg": 269,
    //       "wind_gust": 12.29,
    //       "weather": [
    //         {
    //           "id": 500,
    //           "main": "Rain",
    //           "description": "light rain",
    //           "icon": "10d"
    //         }
    //       ],
    //       "clouds": 55,
    //       "pop": 1,
    //       "rain": 2.84,
    //       "uvi": 3.75
    //     },
    //     {
    //       "dt": 1711706400,
    //       "sunrise": 1711685776,
    //       "sunset": 1711730954,
    //       "moonrise": 1711747140,
    //       "moonset": 1711691880,
    //       "moon_phase": 0.63,
    //       "temp": {
    //         "day": 18.7,
    //         "min": 10.55,
    //         "max": 21.75,
    //         "night": 14.94,
    //         "eve": 20.99,
    //         "morn": 10.55
    //       },
    //       "feels_like": {
    //         "day": 17.72,
    //         "night": 13.9,
    //         "eve": 20.27,
    //         "morn": 9.18
    //       },
    //       "pressure": 1018,
    //       "humidity": 42,
    //       "dew_point": 5.31,
    //       "wind_speed": 3.45,
    //       "wind_deg": 326,
    //       "wind_gust": 5.83,
    //       "weather": [
    //         {
    //           "id": 800,
    //           "main": "Clear",
    //           "description": "clear sky",
    //           "icon": "01d"
    //         }
    //       ],
    //       "clouds": 1,
    //       "pop": 0,
    //       "uvi": 4
    //     },
    //     {
    //       "dt": 1711792800,
    //       "sunrise": 1711772077,
    //       "sunset": 1711817416,
    //       "moonrise": 0,
    //       "moonset": 1711780260,
    //       "moon_phase": 0.66,
    //       "temp": {
    //         "day": 19.7,
    //         "min": 13.4,
    //         "max": 21.18,
    //         "night": 14.62,
    //         "eve": 19.48,
    //         "morn": 13.4
    //       },
    //       "feels_like": {
    //         "day": 18.8,
    //         "night": 13.68,
    //         "eve": 18.66,
    //         "morn": 12.34
    //       },
    //       "pressure": 1019,
    //       "humidity": 41,
    //       "dew_point": 5.55,
    //       "wind_speed": 3.33,
    //       "wind_deg": 199,
    //       "wind_gust": 3.63,
    //       "weather": [
    //         {
    //           "id": 804,
    //           "main": "Clouds",
    //           "description": "overcast clouds",
    //           "icon": "04d"
    //         }
    //       ],
    //       "clouds": 100,
    //       "pop": 0,
    //       "uvi": 4
    //     },
    //     {
    //       "dt": 1711879200,
    //       "sunrise": 1711858378,
    //       "sunset": 1711903878,
    //       "moonrise": 1711837500,
    //       "moonset": 1711869180,
    //       "moon_phase": 0.69,
    //       "temp": {
    //         "day": 20.21,
    //         "min": 13.19,
    //         "max": 21.28,
    //         "night": 15.92,
    //         "eve": 19.94,
    //         "morn": 13.19
    //       },
    //       "feels_like": {
    //         "day": 19.46,
    //         "night": 15.24,
    //         "eve": 19.3,
    //         "morn": 12.21
    //       },
    //       "pressure": 1019,
    //       "humidity": 45,
    //       "dew_point": 7.39,
    //       "wind_speed": 3.61,
    //       "wind_deg": 188,
    //       "wind_gust": 4.21,
    //       "weather": [
    //         {
    //           "id": 800,
    //           "main": "Clear",
    //           "description": "clear sky",
    //           "icon": "01d"
    //         }
    //       ],
    //       "clouds": 8,
    //       "pop": 0,
    //       "uvi": 4
    //     }
    //   ]
    // }

    //console.log(mockData);

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