$(document).ready(function () {
  // Function to get the value of the select box
  function getSelectedValue() {
    let selectedValue = $("#dateRange").val();

    // Write all the AJAX for updating the data here
    $.ajax({
      url: "/admin/report/" + selectedValue,
      method: "GET",
      success: function (response) {
        // Code to handle a successful response
        $("#totalSales").text(response.data[0].totalSum);
        $("#totalOrders").text(response.data[0].totalCount);
        $("#averageOrder").text(response.data[0].averageSale);

        // Call the AJAX for chart data with the updated selected value
        $.ajax({
          url: "/admin/chartdata",
          method: "post",
          data: {
            selectedValue: selectedValue, // Pass the selected value as a parameter
          },
          success: function (response) {
            var lastFiveDays = [];

            if (selectedValue === "daily") {
              lastFiveDays = getFiveDays(selectedValue);
            } else if (selectedValue === "weekly") {
              lastFiveDays = getFiveWeeks();
            } else if (selectedValue === "monthly") {
              lastFiveDays = getFiveMonths();
            }

            var ctx = document.getElementById("salesCharts").getContext("2d");
            var existingCharts = Chart.instances;

            // Loop through the existing charts and destroy them
            for (var chartId in existingCharts) {
              if (existingCharts.hasOwnProperty(chartId)) {
                existingCharts[chartId].destroy();
              }
            }

            var chartData = {
              labels: lastFiveDays,
              datasets: [
                {
                  label: "Sales",
                  data: response.salesAmount,
                  backgroundColor: "rgba(52, 144, 220, 0.1)",
                  borderColor: "rgba(52, 144, 220, 1)",
                  borderWidth: 1,
                  pointRadius: 3,
                  pointBackgroundColor: "rgba(52, 144, 220, 1)",
                  pointBorderColor: "#fff",
                  pointHoverRadius: 5,
                  pointHoverBackgroundColor: "rgba(52, 144, 220, 1)",
                  pointHoverBorderColor: "#fff",
                  fill: true,
                },
              ],
            };

            // Customize chart options for monthly data
            if (selectedValue === "monthly") {
              chartData.datasets.push({
                label: "Montly",
                data: response.dailyAverageAmount,
                backgroundColor: "rgba(220, 52, 52, 0.1)",
                borderColor: "rgba(220, 52, 52, 1)",
                borderWidth: 1,
                pointRadius: 3,
                pointBackgroundColor: "rgba(220, 52, 52, 1)",
                pointBorderColor: "#fff",
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(220, 52, 52, 1)",
                pointHoverBorderColor: "#fff",
                fill: true,
              });
            }

            var chartOptions = {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: selectedValue === "monthly" ? 1000 : 200,
                  },
                },
              },
            };

            var salesCharts = new Chart(ctx, {
              type: "line",
              data: chartData,
              options: chartOptions,
            });
          },
          error: function (xhr, status, error) {
            // Code to handle an error response
            console.log("Request failed: " + error);
          },
        });
      },
      error: function (xhr, status, error) {
        // Code to handle an error response
        console.log("Request failed: " + error);
      },
    });
  }

  // Call the function on page load
  getSelectedValue();

  // Trigger the function whenever the select box value changes
  $("#dateRange").change(function () {
    getSelectedValue();
  });
});

// Function to get the last five days for chart x-axis
function getFiveDays(selectedValue) {
  const currentDate = new Date();
  const datesArray = [];

  // Loop through the last 5 days
  for (let i = 4; i >= 0; i--) {
    const date = new Date();
    date.setDate(currentDate.getDate() - i);
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
    }).format(date);
    datesArray.push(formattedDate);
  }
  datesArray.reverse();

  return datesArray;
}

// Function to get the last five weeks for chart x-axis
function getFiveWeeks() {
  const currentDate = new Date();
  const datesArray = [];

  // Loop through the last 5 weeks
  for (let i = 4; i >= 0; i--) {
    const date = new Date();
    date.setDate(currentDate.getDate() - i * 7);
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
    }).format(date);
    datesArray.push(formattedDate);
  }
  datesArray.reverse();

  return datesArray;
}

// Function to get the last five months for chart x-axis
function getFiveMonths() {
  const currentDate = new Date();
  const datesArray = [];

  // Loop through the last 5 months
  for (let i = 4; i >= 0; i--) {
    const date = new Date();
    date.setMonth(currentDate.getMonth() - i);
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(date);
    datesArray.push(formattedDate);
  }
  datesArray.reverse();

  return datesArray;
}
