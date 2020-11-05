var myApp = angular.module("myApp", [
  "ngAnimate",
  "smart-table",
  "ngRoute",
  "ngSanitize"
]);
myApp.directive("newchartjs", function () {
  return {
    restrict: "A",
    scope: {
      chartData: "=chartData",
      chartOptions: "=chartOptions",
      chartType: "=chartType",
      chart: "=chart"
    },
    link: function (scope, element, attrs) {
      var ctx = element[0].getContext("2d");
      var chart = new Chart(ctx);
      var chartObj;
      scope.$watch("chartType", function (value) {
        if (chartObj) {
          chartObj.destroy();
        }
        chartObj = chart[getChartName(scope.chartType)](scope.chartData, {
          animation: true,
          animationEasing: "easeInSine",
          animationSteps: "39"
        });
        scope.chart = chartObj;
        if (scope.chart.datasets) {
          scope.chart.datasets[0].bars[0].fillColor = "#02f563";
          scope.chart.datasets[0].bars[0].strokeColor = "#02f563";
          scope.chart.datasets[0].bars[0].highlightFill = "#02f563";
          scope.chart.datasets[0].bars[0].highlightStroke = "#02f563";

          scope.chart.datasets[0].bars[1].fillColor = "#fa161a";
          scope.chart.datasets[0].bars[1].strokeColor = "#fa161a";
          scope.chart.datasets[0].bars[1].highlightFill = "#fa161a";
          scope.chart.datasets[0].bars[1].highlightStroke = "#fa161a";

          scope.chart.datasets[0].bars[2].fillColor = "#777777";
          scope.chart.datasets[0].bars[2].strokeColor = "#777777";
          scope.chart.datasets[0].bars[2].highlightFill = "#777777";
          scope.chart.datasets[0].bars[2].highlightStroke = "#777777";

          scope.chart.datasets[0].bars[3].fillColor = "#0000cc";
          scope.chart.datasets[0].bars[3].strokeColor = "#0000cc";
          scope.chart.datasets[0].bars[3].highlightFill = "#0000cc";
          scope.chart.datasets[0].bars[3].highlightStroke = "#0000cc";
        }

        scope.chart.update();
      });
      scope.$on("$destroy", function () {
        if (chartObj) {
          chartObj.destroy();
        }
      });
    }
  };

  function getChartName(type) {
    var typeLower = type.toLowerCase();

    switch (typeLower) {
      case "line":
        return "Line";
      case "bar":
        return "Bar";
      case "stackedbar":
        return "StackedBar";
      case "horizontalbar":
        return "HorizontalBar";
      case "horizontalstackedbar":
        return "HorizontalStackedBar";
      case "pie":
        return "Pie";
      case "doughnut":
        return "Doughnut";
      case "radar":
        return "Radar";
      default:
        return type;
    }
  }
});
myApp.filter("secondsToTimeString", function () {
  return function (seconds) {
    var hours = parseInt(seconds / 3600);
    seconds = seconds % 3600;
    var minutes = parseInt(seconds / 60);
    seconds = seconds % 60;

    return (
      (hours < 10 ? "0" + hours : hours) +
      ":" +
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  };
});

myApp.filter("statusToI18N", function () {
  return function (status) {
    var text =
      angular.lowercase(status) == "not_run"
        ? "notRun"
        : angular.lowercase(status);
    return reportLang[text];
  };
});

myApp.filter("screenShotFileName", function () {
  return function (file) {
    var fileEncode = file.replace(/\\/g, "\\\\");
    var index = fileEncode.lastIndexOf("\\\\");
    if (index > 0) {
      return fileEncode.slice(index + 2);
    } else {
      return file;
    }
  };
});

myApp.config(function ($routeProvider) {
  $routeProvider
    // route for the about page
    .when("/", {
      templateUrl: "home.html",
      controller: "HomeController"
    })

    // route for the about page
    .when("/suites/:suiteIndex", {
      templateUrl: "suite.html",
      controller: "SuiteController"
    })

    // route for the contact page
    .when("/suite/:suiteIndex/case/:caseIndex", {
      templateUrl: "case.html",
      controller: "CaseController"
    });
});

myApp.controller("PageController", [
  "$scope",
  "$window",
  function ($scope, $window) {
    $scope.windowheight = $window.innerHeight;

    $scope.getBageName = function (data) {
      if (angular.lowercase(data) == "not_run") {
        return "notRunBage";
      } else if (angular.lowercase(data) == "true") {
        return "passBage";
      } else if (angular.lowercase(data) == "false") {
        return "failBage";
      } else {
        return angular.lowercase(data) + "Bage";
      }
    };

    $scope.getLogTypeClass = function (data) {
      if (data.indexOf("[ERROR]") > -1) {
        return "errorLog";
      } else if (data.indexOf("[WARN]") > -1) {
        return "warnLog";
      } else {
        return "";
      }
    };

    $scope.isMessageColor = function (data) {
      if (data.indexOf("[INFO] " + reportLang.SentMessagetoReport) > -1) {
        var color = data.substring(data.lastIndexOf(" ") + 1);
        switch (color) {
          case reportLang.Pink:
          case reportLang.Blue:
          case reportLang.Green:
          case reportLang.Purple:
          case reportLang.Black:
            return true;
        }
      } else {
        return false;
      }
    };

    $scope.getMessageColor = function (stepNumber, data) {
      var color = data.substring(data.lastIndexOf(" ") + 1);
      data = data.substring(0, data.lastIndexOf(" "));
      if (color == reportLang.Pink) {
        data = '<b>Step #' + stepNumber + '</b> <span class="pink"> ' + ' ' + data + "</span>";
      } else if (color == reportLang.Blue) {
        data = '<b>Step #' + stepNumber + '</b> <span class="blue"> ' + ' ' + data + "</span>";
      } else if (color == reportLang.Green) {
        data = '<b>Step #' + stepNumber + '</b> <span class="green"> ' + ' ' + data + "</span>";
      } else if (color == reportLang.Black) {
        data = '<b>Step #' + stepNumber + '</b> <span class="black"> ' + ' ' + data + "</span>";
      } else if (color == reportLang.Purple) {
        data = '<b>Step #' + stepNumber + '</b> <span class="purple"> ' + ' ' + data + "</span>";
      }
      return data;
    };

    $scope.filterNavActive = "";
    $scope.filterNav = function (type) {
      if (type != undefined && type.length > 0) {
        angular
          .element(document.querySelectorAll("[data-status]"))
          .addClass("hi‌​de");
        angular
          .element(document.querySelectorAll('[data-status="' + type + '"]'))
          .removeClass("hi‌​de");
        $scope.filterNavActive = type;
      } else {
        angular
          .element(document.querySelectorAll("[data-status]"))
          .removeClass("hi‌​de");
        $scope.filterNavActive = "";
      }
    };

    $scope.$watch(
      function () {
        return $window.innerHeight;
      },
      function (value) { }
    );

    var w = angular.element($window);
    w.bind("resize", function () {
      $scope.windowheight = $window.innerHeight;
      $scope.$apply();
    });

    var config = {};
    $scope.scrollbar = function (direction, autoResize, show) {
      config.direction = direction;
      config.autoResize = autoResize;
      config.scrollbar = {
        show: !!show
      };
      return config;
    };
    $scope.reportLang = reportLang;
  }
]);

myApp.controller("MenuController", [
  "$scope",
  "$window",
  function ($scope, $window) {
    $scope.reportData = results;
    $scope.menuCollapse = false;
    $scope.selected;
    $scope.navSelect = function (item) {
      $scope.selected = item;
      if ($window.innerWidth <= 1279) {
        $scope.menuCollapse = false;
      }
    };
    $scope.isNavActive = function (item) {
      if ($scope.selected === item) {
        return "active";
      } else {
        return "";
      }
    };
  }
]);

myApp.controller("HomeController", [
  "$scope",
  "$http",
  function ($scope, $http) {
    $scope.reportData = results;
    $scope.suiteList = $scope.reportData.childObjects
    $scope.chartResult = [
      $scope.reportData.result.pass,
      $scope.reportData.result.fail,
      $scope.reportData.result.skip,
      $scope.reportData.result.notRun
    ];
    $scope.itemsByPage = 5;
  }
]);
myApp.controller("SuiteController", [
  "$scope",
  "$http",
  "$routeParams",
  function ($scope, $http, $routeParams) {
    $scope.suiteData = results.childObjects[$routeParams.suiteIndex];
    $scope.caseList = $scope.suiteData.childObjects;
    $scope.chartResult = [
      $scope.suiteData.result.pass,
      $scope.suiteData.result.fail,
      $scope.suiteData.result.skip,
      $scope.suiteData.result.notRun
    ];
    $scope.itemsByPage = 5;
  }
]);

myApp.controller("CaseController", [
  "$scope",
  "$http",
  "$routeParams",
  "$interval",
  function ($scope, $http, $routeParams, $interval) {
    $scope.caseData =
      results.childObjects[$routeParams.suiteIndex].childObjects[
      $routeParams.caseIndex
      ];
    $scope.consoleLogsetting = results.metadata.consoleLogsetting;
    $scope.iniTemp = 100;
    $scope.steps = $scope.caseData.childObjects;
    $scope.logs = [];
    $scope.logFlag = true;
    $scope.dateTime = '';

    if ($scope.steps && $scope.caseData.result.name !== "NOT_RUN") {
      $scope.logFlag = true;
    } else {
      $scope.logFlag = false;
    }

    $scope.expFile = function () {
      angular.forEach($scope.steps, function (value) {
        if (value.type.indexOf("Iteration") !== -1 || !value.result) {
          $scope.logs.push("\r\n" + value.type + "\r\n");
        }
        if (value.log) {
          $scope.dateTime = value.log.slice(0, 19);
          $scope.seqNumber = value.sequencenumber ? value.sequencenumber.replace('.', ' : ') : ' : ';
          $scope.logValue = value.log ? value.log.replace(/(\r\n|\n|\r)/gm, "") : '';
          if (value.action.name == 'Pink' || value.action.name == 'Blue' || value.action.name == 'Green' || value.action.name == 'Purple' || value.action.name == 'Black') {
            $scope.lastIndex = value.log.lastIndexOf(" ");
            $scope.logValue = value.log.slice(0, $scope.lastIndex + 1);
          }
          $scope.logs.push("Step#" + $scope.seqNumber + $scope.logValue + "\r\n");
        }
      });

      $scope.logCollapse = !$scope.logCollapse;

      $scope.fileText = $scope.logs.join("");
      $scope.fileName = $scope.caseData.name + "_" + $scope.dateTime;

      if (!$scope.fileText) {
        alert("Console.save: No data");
        return;
      }

      if (!$scope.fileName) $scope.fileName = "logs.txt";

      ($scope.blob = new Blob([$scope.fileText], { type: "text/plain" })),
        (e = document.createEvent("MouseEvents")),
        (a = document.createElement("a"));

      // FOR IE:

      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob($scope.blob, $scope.fileName + '.txt');
      } else {
        ($scope.e = document.createEvent("MouseEvents")),
          ($scope.a = document.createElement("a"));

        a.download = $scope.fileName;
        a.href = window.URL.createObjectURL($scope.blob);
        a.dataset.downloadurl = ["text/plain", a.download, a.href].join(".,");
        e.initEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
      }
      $scope.logs = [];
      $scope.blob = null;
    };

    $interval(function () {
      $scope.iniTemp += 100;
    }, 500);

    $scope.checkIterartion = function (currentType, previousType) {
      if (
        typeof previousType != "undefined" &&
        currentType.indexOf("Iteration-") > -1
      ) {
        if (
          previousType.indexOf("Iteration-") > -1 &&
          currentType.indexOf("Iteration-") > -1 &&
          previousType == currentType
        ) {
          return false;
        } else {
          return true;
        }
      } else if (currentType.indexOf("Iteration-") > -1) {
        return true;
      } else {
        return false;
      }
    };
    $scope.checkCallMethod = function (currentType, previousType) {
      if (
        typeof previousType != "undefined" &&
        currentType.indexOf("CallMethod") > -1
      ) {
        if (previousType == currentType) {
          return false;
        } else {
          return true;
        }
      } else if (currentType.indexOf("CallMethod") > -1) {
        return true;
      } else {
        return false;
      }
    };
    $scope.checkIterartionClass = function (currentType) {
      if (
        currentType.indexOf("CallMethod") > -1 ||
        currentType.indexOf("Iteration-") > -1
      ) {
        return "iteration-row";
      }
    };

    $scope.checkIterartionIsBlank = function (index) {
      if (
        ($scope.steps[index].type.indexOf("Iteration-") > -1 ||
          $scope.steps[index].type.indexOf("CallMethod") > -1) &&
        $scope.steps[index].operation.name.length == 0 &&
        $scope.steps[index].executionTime == 0
      ) {
        return true;
      }
      return false;
    };
  }
]);

myApp.controller("SummaryChartController", [
  "$scope",
  "$http",
  function ($scope, $http) {
    summaryPieChart();
    $scope.summaryPieChart = summaryPieChart;
    $scope.summaryBarChart = summaryBarChart;

    function summaryPieChart() {
      $scope.chartType = "pie";
      $scope.chartData = [
        {
          value: $scope.$parent.chartResult[0],
          color: "#02f563",
          highlight: "#02f563",
          label: "Pass"
        },
        {
          value: $scope.$parent.chartResult[1],
          color: "#fa161a",
          highlight: "#fa161a",
          label: "Fail"
        },
        {
          value: $scope.$parent.chartResult[2],
          color: "#777777",
          highlight: "#777777",
          label: "Skip"
        },
        {
          value: $scope.$parent.chartResult[3],
          color: "#0000cc",
          highlight: "#0000cc",
          label: "Not Run"
        }
      ];
    }

    function summaryBarChart() {
      $scope.chartType = "bar";
      $scope.chartData = {
        labels: ["Pass", "Fail", "Skip", "Not Run"],
        datasets: [
          {
            data: [
              $scope.$parent.chartResult[0],
              $scope.$parent.chartResult[1],
              $scope.$parent.chartResult[2],
              $scope.$parent.chartResult[3]
            ]
          }
        ]
      };
    }
  }
]);

myApp.controller("TrendChartController", [
  "$scope",
  "$http",
  function ($scope, $http) {
    trendLineChart();

    $scope.trendLineChart = trendLineChart;
    $scope.trendBarChart = trendBarChart;
    $scope.trendRadarChart = trendRadarChart;

    $scope.chartData = {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "Pass",
          fillColor: "rgba(129,199,132,0.3)",
          strokeColor: "rgba(129,199,132,1)",
          highlightFill: "rgba(129,199,132,1)",
          highlightStroke: "rgba(129,199,132,1)",
          pointColor: "rgba(129,199,132,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(129,199,132,1)",
          data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
          label: "Fail",
          fillColor: "rgba(239,86,101,0.3)",
          strokeColor: "rgba(239,86,101,1)",
          highlightFill: "rgba(239,86,101,1)",
          highlightStroke: "rgba(239,86,101,1)",
          pointColor: "rgba(239,86,101,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(239,86,101,1)",
          data: [28, 48, 40, 19, 86, 27, 90]
        },
        {
          label: "Skip",
          fillColor: "rgba(193,193,193,0.3)",
          strokeColor: "rgba(193,193,193,1)",
          highlightFill: "rgba(193,193,193,1)",
          highlightStroke: "rgba(193,193,193,1)",
          pointColor: "rgba(193,193,193,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(193,193,193,1)",
          data: [81, 56, 55, 40, 59, 80, 81]
        },
        {
          label: "Not Run",
          fillColor: "rgba(100,181,246,0.3)",
          strokeColor: "rgba(100,181,246,1)",
          highlightFill: "rgba(100,181,246,1)",
          highlightStroke: "rgba(100,181,246,1)",
          pointColor: "rgba(100,181,246,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(100,181,246,1)",
          data: [19, 86, 27, 90, 40, 19, 86]
        }
      ]
    };

    function trendLineChart() {
      $scope.chartType = "line";
    }

    function trendBarChart() {
      $scope.chartType = "bar";
    }

    function trendRadarChart() {
      $scope.chartType = "radar";
    }
  }
]);

myApp.controller("EffectivenessChartController", [
  "$scope",
  "$http",
  function ($scope, $http) {
    effectivenessLineChart();

    $scope.effectivenessLineChart = effectivenessLineChart;
    $scope.effectivenessBarChart = effectivenessBarChart;
    $scope.effectivenessRadarChart = effectivenessRadarChart;

    $scope.chartData = {
      labels: [
        "Suite 1",
        "Suite 2",
        "Suite 3",
        "Suite 4",
        "Suite 5",
        "Suite 6",
        "Suite 7"
      ],
      datasets: [
        {
          label: "Steps",
          fillColor: "rgba(144,164,174,0.3)",
          strokeColor: "rgba(144,164,174,1)",
          highlightFill: "rgba(144,164,174,1)",
          highlightStroke: "rgba(144,164,174,1)",
          pointColor: "rgba(144,164,174,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(144,164,174,1)",
          data: [90, 40, 19, 86, 19, 86, 27]
        },
        {
          label: "Statements",
          fillColor: "rgba(121,134,203,0.3)",
          strokeColor: "rgba(121,134,203,1)",
          highlightFill: "rgba(121,134,203,1)",
          highlightStroke: "rgba(121,134,203,1)",
          pointColor: "rgba(121,134,203,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(121,134,203,1)",
          data: [21, 56, 55, 40, 65, 59, 80]
        },
        {
          label: "Reusability",
          fillColor: "rgba(149,117,205,0.3)",
          strokeColor: "rgba(149,117,205,1)",
          highlightFill: "rgba(149,117,205,1)",
          highlightStroke: "rgba(149,117,205,1)",
          pointColor: "rgba(149,117,205,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(149,117,205,1)",
          data: [36, 27, 90, 28, 48, 40, 19]
        },
        {
          label: "Loop/Conditions",
          fillColor: "rgba(100,181,246,0.3)",
          strokeColor: "rgba(100,181,246,1)",
          highlightFill: "rgba(100,181,246,1)",
          highlightStroke: "rgba(100,181,246,1)",
          pointColor: "rgba(100,181,246,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(100,181,246,1)",
          data: [20, 81, 81, 56, 55, 40, 59]
        }
      ]
    };

    function effectivenessLineChart() {
      $scope.chartType = "line";
    }

    function effectivenessBarChart() {
      $scope.chartType = "bar";
    }

    function effectivenessRadarChart() {
      $scope.chartType = "radar";
    }
  }
]);
