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

document.getElementsByClassName("wishlist-icon").addEventListener("click", function () {
  alert("eneted her")
  this.classList.toggle("clicked");
});


document.querySelectorAll(".selectaddress").forEach(function (input) {
  input.addEventListener("change", function () {
    alert("entered here");
    var newName = this.getAttribute("id") + "Modified";
    document.querySelectorAll(".selectaddress").forEach(function (otherInput) {
      otherInput.setAttribute("name", newName);
    });
  });
});


