$(document).ready(function () {
  alert("Enter here");

  // Handle address selection
  $(".address-checkbox").change(function () {
    var selectedAddressIndex = $(this).val();
    $("#selectedAddressIndex").val(selectedAddressIndex);
  });

  // Handle place order button click
  $("#placeOrderButton").click(function () {
    // Open the place order modal
    $("#exampleModalCenterPlaceOrder").modal("show");
  });

  // Handle proceed to payment button click
  $("#proceedToPaymentButton").click(function () {
    alert("Enter at the proceed to payment");
    var selectedAddressIndex = $("#selectedAddressIndex").val();
    var paymentMethod = $("input[name='paymentMethod']:checked").val();

    // Combine the data into an object
    var orderData = {
      selectedAddressIndex: selectedAddressIndex,
      paymentMethod: paymentMethod,
    };

    $.ajax({
      url: "/paymentGate",
      type: "POST",
      data: orderData,
      success: function (response) {
        alert("Entered here");

        if (response.COD) {
          location.href = "/success";
        } else {
          console.log(response.response);
          razorPayment(response.response);
        }
      },
      error: function (xhr, status, error) {
        // Handle errors
        console.error(error);
      },
    });

    $("#exampleModalCenterPlaceOrder").modal("hide");
  });
});

function razorPayment(order) {
  var options = {
    key: "rzp_test_bLt7yzzH20t8v9",
    amount: order.amount,
    currency: "INR",
    name: "Melocia",
    description: "Your Transaction Details",
    image: "https://example.com/your_logo",
    order_id: order.id,
    handler: function (response) {
      alert(response.razorpay_payment_id);
      alert(response.razorpay_order_id);
      alert(response.razorpay_signature);
      verifyPayment(response, order);
    },
    prefill: {
      name: "Gaurav Kumar",
      email: "gaurav.kumar@example.com",
      contact: "9000090000",
    },
    notes: {
      address: "Melocia private Limited",
    },
    theme: {
      color: "#3399cc",
    },
  };
  var rzp1 = new Razorpay(options);
  rzp1.open();
}

function verifyPayment(payment, order) {
  alert("Entered at verify payment");
  $.ajax({
    url: "/verifypayment",
    method: "post",
    data: {
      payment: payment,
      order: order,
    },
    success: function (response) {
      alert(response);
      console.log(response);
      alert(response.status);
      if (response.status === true) {
        location.href = "/success";
      } else if (response.status === false) {
        alert(response.err);
        location.href = "/";
      }
    },
    error: function (xhr, status, error) {
      // Handle errors
      console.error(error);
    },
  });
}
