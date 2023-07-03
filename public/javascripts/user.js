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


document.querySelectorAll(".selectaddress").forEach(function (input) {
  input.addEventListener("change", function () {
    var newName = this.getAttribute("id") + "Modified";
    document.querySelectorAll(".selectaddress").forEach(function (otherInput) {
      otherInput.setAttribute("name", newName);
    });
  });
});



//for payment



//otp verification

   function validateFormLogin(event) {
     event.preventDefault();
     const phoneNumber = document.getElementById("phone").value;
     const errorMessage = document.getElementById("errorMessage");
     const phoneRegex = /^[0-9]{10}$/;

     if (!phoneRegex.test(phoneNumber)) {
       errorMessage.textContent = "Invalid phone number";
       return false;
     }

     $("#exampleModalCenter").hide();
      $("#otpModal").modal("show");
     $.ajax({
       url: "/otp",
       method: "POST",
       data: {
         phone: phoneNumber,
       },
       success: function (response) {
         if (response.status) {
           $("#otpModal").modal("show");
         } else {
           errorMessage.textContent = "Failed to generate OTP.";
         }
       },
       error: function (xhr, status, error) {
         errorMessage.textContent =
           "An error occurred while processing the form.";
       },
     });
   }

   //for verifying otp

    $(document).ready(function () {
      $("#verificationForm").submit(function (event) {
        event.preventDefault();

        const otpValue = $("#otpLogin").val().trim();
         const errorMessageOTP = document.getElementById("errorMessageForLogin");

        if (otpValue === "") {
          errorMessageOTP.textContent = "Enter a valid otp";
          return;
        }
        $.ajax({
          url: "/verify",
          method: "POST",
          data: {
            otp: otpValue,
          },
          success: function (response) {
        
            if(response.status)
            {
              location.href='/';
            }
            else
            {
               errorMessageOTP.textContent = "Invalid OTP";
            }
          },
          error: function (xhr, status, error) {
            console.error("Request failed. Status:", status);
          },
        });
      });
    });

    //signup validation

    $(document).ready(function () {
      
      $("#signupForm").submit(function (event) {
        event.preventDefault();
        const name = $("#name").val().trim();
        const phone = $("#phonesignup").val().trim();
        const email = $("#email").val().trim();
        const referal = $("#referal").val().trim();
        const errorMessageOTP = document.getElementById("signUpVerifyId");
        if (name === "") {
           errorMessageOTP.textContent = "Enter a valid name";
         
          return;
        }
        if (phone === "" ) {
          errorMessageOTP.textContent = "Enter a valid phone number";
          return;
        }

        if (email === "") {
          errorMessageOTP.textContent = "Enter a valid email";
          return;
        }
        $.ajax({
          url: "/signup",
          method: "POST",
          data: $(this).serialize(),
          success: function (response) {
            $("#signupModal").hide();
            $("#otpModalsignup").modal("show");
            console.log(response);
          },
          error: function (xhr, status, error) {
            console.error("An error occurred while processing the form.");
          },
        });
      });
    });


    //signupotpverificcation

    $(document).ready(function () {
      $("#otpForm").submit(function (event) {
        event.preventDefault();
        const otp = $("#otp").val().trim();
         const errorMessageOTP = document.getElementById(
           "otpSignUpVerification"
         );
        if (otp === "") {
          errorMessageOTP.textContent = "Enter a valid otp";
          return;
        }
        $.ajax({
          url: "/signupverify",
          method: "POST",
          data: $(this).serialize(),
          success: function (response) {
          if(response.status)
          {
           location.href = "/";
          }
          else if(response.status == false){
            errorMessageOTP.textContent = "Invalid otp";
          }
          },
          error: function (xhr, status, error) {
            console.error("An error occurred while processing the form.");
          },
        });
      });
    });


   
 $('#coupounButton').click(function () {
    event.preventDefault();
    const couponCode = $('#coupounTextBox').val();
    if (couponCode.trim().length === 0) {
      $("#messageId").text("Invalid coupon");
      return
    }
    const totalPrice = $('#totalPrice').text();

    $(this).prop('disabled', true);

    $.ajax({
      url: "/coupon",
      method: "post",
      data: { coupon: couponCode, total: totalPrice },
      success: function (response) {
        if (response.status) {
          $("#messageId").css("display", "inline-block");
          $("#deleteButton").css("display", "inline-block");
          $("#coupounId").css("display", "block");

          $("#messageId").text("coupon applied");
          $("#totalPrice").text('₹' + response.price);
          // { { !--$("#totalprice").text('₹' + response.price); --} }
          $("#coupounId").text('₹' + response.voucher);

          if (response.price < 500) {
            $("#deliveryFee").text("60");

          }

        } else {
          $("#messageId").css("display", "block");
          $("#messageId").css('color', 'red');

          $("#messageId").text(response.message);
          setTimeout(() => {
            location.reload();
          }, 2000)
        }
      },
      error: function (xhr, status, error) {
        console.log("An error occurred: " + error);
      },
      complete: function () {
       
      }

    });
  });



 //checkbox for filtering
document.addEventListener("DOMContentLoaded", function () {
  var categoryCheckboxes = document.querySelectorAll(".category-checkbox");
  categoryCheckboxes.forEach(function (checkbox) {
    checkbox.addEventListener("change", function () {
      document.getElementById("categoryForm").submit();
    });
  });
});


//wallet check box
$(document).ready(function () {
 
  var checkbox = $("#walletForcheckout");
  var checkboxText = $("#walletForcheckoutText");
  const walletId = $(".WalletBalanceId");
    
  
    const totalAmount = $("#totalAmountOffred");
  const wallet = $("#walletBalance").val();
  const balance = $("#walletBalance").val();
 

 
  


  checkbox.change(function () {
    if ($(this).is(":checked")) {
      $.ajax({
        url: "/walletupdate",
        method: "POST",
        data: { wallet:"update" },
        success: function (response1) {
          // Request successful, do something with the response
          console.log(response1);
          // Hide the checkbox
          walletId.hide();
          if(response1.wallet)
          {
          $("#totalAmountOffred").text('₹'+response1.totalAmount);

          }
          if(response1.button){
            $("#walletPay");
          }

         
            // Show the wallet balance applied
            $("#walletBalanceApplied").text("Wallet balance applied: ");
             if (response1.walletUsedFull) {
              document.getElementById("walletPay").style.display = "block";
              document.getElementById("razorpay").style.display = "none";
               document.getElementById("cod").style.display = "none";


             }
          
        },
        error: function (xhr, status, error) {
          // Handle errors
          console.log(error);
        },
        complete: function () {
          // Set the checkbox back to checked
          checkbox.hide();
          walletId.hide();
          checkboxText.html("Wallet balance applied", wallet);
          checkboxText.css("color", "green");
          totalAmountOffred.html('₹'+parseInt(total)-parseInt(wallet))

  
          console.log(flag);
        },
      });
    }
  });
  
});


//address avlidation


