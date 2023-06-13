// ajax for increase and decrease the cart items in the cart

function updateCartQuantity(productId, quantity, mobile) {
  $.ajax({
    url: "/quantityupdate",
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify({
      product: productId,
      quantity: quantity,
      mobileNumber: mobile,
    }),
    success: function (response) {
      console.log(response);
      location.reload();
    },
    error: function (xhr, status, error) {
      console.error("Failed to update cart:", error);
    },
  });
}

function decreaseQuantity(productId, mobile) {
  var input = $(this).siblings(".quantity-input");
  var currentQuantity = parseInt(input.val(), 10);
  var newQuantity = currentQuantity - 1;

  if (currentQuantity > 1) {
    input.val(newQuantity);
    updateCartQuantity(productId, newQuantity, mobile);
  }
}


function increaseQuantity(productId, mobile) {
  var input = $(this).siblings(".quantity-input");
  var currentQuantity = parseInt(input.val(), 10);
  var newQuantity = currentQuantity + 1;

  input.val(newQuantity);
  updateCartQuantity(productId, newQuantity, mobile);
}


const checkboxes = document.querySelectorAll(".address-checkbox");

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", (event) => {
    if (event.target.checked) {
      checkboxes.forEach((cb) => {
        if (cb !== checkbox) {
          cb.disabled = true;
        }
      });

      const selectedAddressIndex = event.target.value;
      document.getElementById("selectedAddressIndex").value =
        selectedAddressIndex;

      document.getElementById("deliverButton").style.display = "block";
    } else {
      checkboxes.forEach((cb) => {
        cb.disabled = false;
      });

      document.getElementById("selectedAddressIndex").value = "";

      document.getElementById("deliverButton").style.display = "none";
    }
  });
});

// document.getElementById("deliverButton").addEventListener("click", (event) => {
//   event.preventDefault();
//   document.getElementById("addressForm").submit();
// });

//for wishlist

// document.getElementsByClassName("wishlist-icon").addEventListener("click", function () {
//   this.classList.toggle("clicked");
// });


document.querySelectorAll(".selectaddress").forEach(function (input) {
  input.addEventListener("change", function () {
    var newName = this.getAttribute("id") + "Modified";
    document.querySelectorAll(".selectaddress").forEach(function (otherInput) {
      otherInput.setAttribute("name", newName);
    });
  });
});



//for payment

$(document).ready(function () {
      // Handle address selection
      $(".address-checkbox").change(function () {
        var selectedAddressIndex = $(this).val();
        $("#selectedAddressIndex").val(selectedAddressIndex);
      });

      // Handle place order button click
      $("#placeOrderButton").click(function () {
        // Open the place order modal
        $('#exampleModalCenterPlaceOrder').modal('show');
      });

      // Handle proceed to payment button click
      $("#proceedToPaymentButton").click(function () {
        var selectedAddressIndex = $("#selectedAddressIndex").val();
        var paymentMethod = $("input[name='paymentMethod']:checked").val();

        // Combine the data into an object
        var orderData = {
          selectedAddressIndex: selectedAddressIndex,
          paymentMethod: paymentMethod
        };

       
        $.ajax({
          url: "/paymentGate", 
          type: "POST",
          data: orderData,
          success: function (response) {
            
            if(response.COD)
            {
               location.href="/succeess"
            } else{
              console.log(response.response)
              razorPayment(response.response)
            }
           
          },
          error: function (xhr, status, error) {
            // Handle errors
            console.error(error);
          }
        }); 

       
        $('#exampleModalCenterPlaceOrder').modal('hide');
      });
    });

    function razorPayment(order){
      var options = {
    "key": "rzp_test_bLt7yzzH20t8v9", 
    "amount": order.amount, 
    "currency": "INR",
    "name": "Melocia",
    "description": "Your  Transaction Details",
    "image": "https://example.com/your_logo",
    "order_id": order.id, 
    "handler": function (response){
        // alert(response.razorpay_payment_id);
        // alert(response.razorpay_order_id);
        // alert(response.razorpay_signature);
        verifyPayment(response,order);
    },
    "prefill": {
        "name": "Gaurav Kumar",
        "email": "gaurav.kumar@example.com",
        "contact": "9000090000"
    },
    "notes": {
        "address": "Razorpay Corporate Office"
    },
    "theme": {
        "color": "#3399cc"
    }
};
var rzp1 = new Razorpay(options);
    rzp1.open();
    }
    function verifyPayment(payment,order){
      $.ajax({
        url:'/verifypayment',
        method:"post",
        data:{payment,order},
         success: function (response) {
          console.log(response)
          if(response.status){
            alert("eneterf at the success")
              location.href="/succeess"
          }
          else
          {
            alert("eneterd at the failure")
            location.href='/'
          }
          //  error: function (xhr, status, error) {
          //   // Handle errors
          //   console.error(error);
          // }
         }
      })
    }



    //apply coupoun

