"# Weather_application" 
This application has been developed using the Oracle JavaScript Extension Toolkit (JET). It's a collection of open source javascript libraries (preact or Knockout.js based architectures) along with Oracle contributed javascript libraries. I chose the knockout.js because I am most familiar with it, and it shares significant similarities with modern JavaScript frameworks such as Angular.js and Vue.js. Required tools and libraries in order for the application to run are: 
Node.js, npm, knockout.js, Oracle JET

It is a simple and modern weather widget using data from a local JS file regarding the area of Thessaloniki. The widget displays current weather information (temperature, feels like, pressure, humidity, wind speed, wind gust, wind deg and a weather icon). A menu also exists in order the user to can see today's weather information as well as to select a future date (up to 6 days ahead) and display the forecast information inside the widget. For the forecast temperature and feels like, the average values of day (morning & day) and night (evening & night) temperatures were used. Finally, a Chart is displayed at the bottom part of the page presenting the max temperatures of the current day and up to 6 days ahead. The chart isn't get affected by the selected filters.

## Installation

To install and run the app, follow these steps:

### Prerequisites

- Install [Node.js](https://nodejs.org/)
- npm install -g @oracle/ojet-cli

### Setup

1. Clone the repository or download the Weather_application to your local machine.
2. Open the project in an IDE or editor of your choice, such as Visual Studio Code.
3. Open a terminal or command prompt in the project directory.

### Install Dependencies

Run the following commands sequentially to install the required dependencies, build and run the application:

```bash
ojet restore

ojet build

ojet serve
