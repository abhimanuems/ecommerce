// $(document).ready(function () {
//     alert("eneteref here");
//     console.log("enetered ate the rzzapor pay")
// $(".address-checkbox").change(function () {
//   var selectedAddressIndex = $(this).val();
//   $("#selectedAddressIndex").val(selectedAddressIndex);
// });

// $("#placeOrderButton").click(function () {
//   if ($(".address-checkbox").is(":checked")) {
//     $("#exampleModalCenterPlaceOrder").modal("show");
//   }
// });



//   $("#proceedToPaymentButton").click(function () {
  
//     var selectedAddressIndex = $("#selectedAddressIndex").val();
//     var paymentMethod = $("input[name='paymentMethod']:checked").val();

  
//     var orderData = {
//       selectedAddressIndex: selectedAddressIndex,
//       paymentMethod: paymentMethod,
//     };

//     $.ajax({
//       url: "/paymentGate",
//       type: "POST",
//       data: orderData,
//       success: function (response) {

//         if (response.COD) {
//           location.href = "/success";
//         } else {
        
          
//           console.log(response.response);
//           razorPayment(response.response);
//         }
//       },
//       error: function (xhr, status, error) {
      
//         console.error(error);
//       },
//     });

//     $("#exampleModalCenterPlaceOrder").modal("hide");
//   });
// });

// function razorPayment(order) {
//   console.log(order,'razorpay')
//   var options = {
//     key: "rzp_test_bLt7yzzH20t8v9",
//     amount: order.amount,
//     currency: "INR",
//     name: "Melocia",
//     description: "Your Transaction Details",
//     image: "https://example.com/your_logo",
//     order_id: order.id,
//     handler: function (response) {
      
//       verifyPayment(response, order);
//     },
//     prefill: {
//       name: "Gaurav Kumar",
//       email: "gaurav.kumar@example.com",
//       contact: "9000090000",
//     },
//     notes: {
//       address: "Melocia private Limited",
//     },
//     theme: {
//       color: "#3399cc",
//     },
//   };
//   var rzp1 = new Razorpay(options);
//   rzp1.open();
// }



// function verifyPayment(payment, order) {
//   alert("eneteref here")
//   $.ajax({
//     url: "/verifypayment",

//     data: {
//       payment: payment,
//       order: order,
//     },
//     method: "post",
//     success: function (response) {
//       console.log(response);
//       if (response.status == true) {
//         location.href = "/success";
//       } else if (response.status == false) {
//         alert(response.err);
//         location.href = "/";
//       }
//     },
//     error: function (xhr, status, error) {
      
//       console.error(error);
   
//       location.href = "/error";
//     },
//   });
// }

