$(document).ready(function () {
  $(".status-form").submit(function (event) {
    event.preventDefault();

    var form = $(this);
    var orderId = form.find('input[name="orderId"]').val();
    var selectedValue = form.find(".status").val();

    $.ajax({
      url: "/admin/updateorderstatus",
      method: "POST",
      data: { orderId: orderId, status: selectedValue },
      success: function (response) {
        console.log("Status update sent successfully!");
        location.reload();
      },
      error: function (xhr, status, error) {
        console.error("Error sending status update:", error);
      },
    });
  });

  $(".status").change(function () {
    var form = $(this).closest(".status-form");
    form.submit();
  });
});





$(document).ready(function () {
  $("#myTable").DataTable();
});

//data table 
$(function (){
  $("#productTable").DataTable();
});

//for user table

$(function(){
  $("#userDataTable").DataTable();
})

//order table

$(function () {
  $("#OrderTable").DataTable();
});

//coupoun table

$(function () {
  $("#voucherTable").DataTable();
});


//productOfferTable

$(function () {
  $("#productOfferTable").DataTable();
});


//referalTable

$(function () {
  $("#referalTable").DataTable();
});

//categoryoffers

$(function () {
  $("#categoryOffers").DataTable();
});

//banner

$(function () {
  $("#bannerId").DataTable();
});
$(function () {
  $("#dashboardTable").DataTable();
});



window.addEventListener("DOMContentLoaded", function () {
  var sidebar = document.querySelector(".sidebar");
  var htmlHeight = document.documentElement.scrollHeight;
  sidebar.style.height = htmlHeight + "px";
});
 
//    $(document).ready(function () {
//   // Function to get the value of the select box
//   function getSelectedValue() {
//     let selectedValue = $("#dateRange").val();

//     //write all the ajax for updating the here
//     $.ajax({
//       url: "/admin/report/" + selectedValue,
//       method: "GET",

//       success: function (response) {

//         // Code to handle a successful response
    

//         $("#totalSales").text(response.data[0].totalSum);
//         $("#totalOrders").text(response.data[0].totalCount);
//         $("#averageOrder").text(response.data[0].averageSale);

//         // Call the AJAX for chart data with the updated selected value
//         $.ajax({
//           url: "/admin/chartdata",
//           method: "post",
//           data: {
//             selectedValue: selectedValue, // Pass the selected value as a parameter
//           },
//           success: function (response) {
//             console.log("response is ",response)
//       const lastFiveDays = getFiveDays(selectedValue);
//       var ctx = document.getElementById("salesCharts").getContext("2d");
//    var existingCharts = Chart.instances;

//    // Loop through the existing charts and destroy them
//    for (var chartId in existingCharts) {
//      if (existingCharts.hasOwnProperty(chartId)) {
//        existingCharts[chartId].destroy();
//      }
//    }

//       var salesCharts = new Chart(ctx, {
//         type: "line",
//         data: {
//           labels: lastFiveDays,
//           datasets: [
//             {
//               label: "Sales",
//               data: response.salesAmount.reverse(),
//               backgroundColor: "rgba(52, 144, 220, 0.1)",
//               borderColor: "rgba(52, 144, 220, 1)",
//               borderWidth: 1,
//               pointRadius: 3,
//               pointBackgroundColor: "rgba(52, 144, 220, 1)",
//               pointBorderColor: "#fff",
//               pointHoverRadius: 5,
//               pointHoverBackgroundColor: "rgba(52, 144, 220, 1)",
//               pointHoverBorderColor: "#fff",
//               fill: true,
//             },
//           ],
//         },
//         options: {
//           responsive: true,
//           maintainAspectRatio: false,
//           scales: {
//             y: {
//               beginAtZero: true,
//               ticks: {
//                 stepSize: 200,
//               },
//             },
//           },
//         },
//       });

//           },
//           error: function (xhr, status, error) {
//             // Code to handle an error response
//             console.log("Request failed: " + error);
//           },
//         });
//       },
//       error: function (xhr, status, error) {
//         // Code to handle an error response
//         console.log("Request failed: " + error);
//       },
//     });
//   }

//   // Call the function on page load
//   getSelectedValue();

//   // Trigger the function whenever the select box value changes
//   $("#dateRange").change(function () {
//     getSelectedValue();
//   });
// });

// // Function to get the last five days for chart x-axis
// function getFiveDays(selectedValue) {
//   if (selectedValue == "daily") {
//     const currentDate = new Date();
//     const datesArray = [];

//     // Loop through the last 5 days
//     for (let i = 4; i >= 0; i--) {
//       const date = new Date();
//       date.setDate(currentDate.getDate() - i);
//       const formattedDate = new Intl.DateTimeFormat("en-US", {
//         month: "long",
//         day: "numeric",
//       }).format(date);
//       datesArray.push(formattedDate);
//     }
//     console.log(datesArray, "is arraya");
//     return datesArray;
//   } else if (selectedValue == "weekly") {
//     const currentDate = new Date();
//     const datesArray = [];

//     // Loop through the last 5 weeks
//     for (let i = 4; i >= 0; i--) {
//       const date = new Date();
//       date.setDate(currentDate.getDate() - i * 7);
//       const formattedDate = new Intl.DateTimeFormat("en-US", {
//         month: "long",
//         day: "numeric",
//       }).format(date);
//       datesArray.push(formattedDate);
//     }
//     console.log(datesArray, "is arraya");
//     return datesArray;
//   } else if (selectedValue == "monthly") {
//     const currentDate = new Date();
//     const datesArray = [];

//     // Loop through the last 5 weeks
//     for (let i = 4; i >= 0; i--) {
//       const date = new Date();
//       date.setDate(currentDate.getDate() - i * 30);
//       const formattedDate = new Intl.DateTimeFormat("en-US", {
//         month: "long",
//         day: "numeric",
//       }).format(date);
//       datesArray.push(formattedDate);
//     }
//     console.log(datesArray, "is arraya");
//     return datesArray;
//   }
// }




