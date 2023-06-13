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



// admin voucher adding validation

function validateForm() {
  let isValidForm = true;
  event.preventDefault(); // Prevent the form from submitting and closing

  // Reset error messages and remove the "is-invalid" class from fields
  resetForm();

  // Get field values
  let title = document.getElementById("title").value;
  let price = document.getElementById("price").value;
  let cappedPrice = document.getElementById("cappedPrice").value;
  let minSpent = document.getElementById("minSpent").value;
  let usageLimit = document.getElementById("usageLimit").value;
  let limitPerOrder = document.getElementById("limitPerOrder").value;
  let voucherCode = document.getElementById("voucherCode").value;
  let startTime = document.getElementById("startTime").value;
  let endTime = document.getElementById("endTime").value;

  // Title validation
  var nameRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
  if (!title.match(nameRegex)) {
    isValidForm = false;
    showError("title", "Enter a proper title");
  }

  // Price validation
  if (parseInt(price) < 1) {
    isValidForm = false;
    showError("price", "Price should be greater than 0");
  }

  // Capped price validation
  if (parseInt(cappedPrice) < 1) {
    isValidForm = false;
    showError("cappedPrice", "Invalid");
  }

  // Min spent validation
  if (parseInt(minSpent) < 1) {
    isValidForm = false;
    showError("minSpent", "Invalid");
  }

  // Usage limit validation
  if (parseInt(usageLimit) < 1) {
    isValidForm = false;
    showError("usageLimit", "Invalid");
  }

  // Limit per order validation
  if (parseInt(limitPerOrder) < 1) {
    isValidForm = false;
    showError("limitPerOrder", "Invalid");
  }

  // Voucher code validation
  if (voucherCode.trim() === "") {
    isValidForm = false;
    showError("voucherCode", "Voucher code is required");
  }

  // Start time validation
  var currentDateTime = new Date();
  var selectedStartTime = new Date(startTime);
  if (selectedStartTime < currentDateTime) {
    isValidForm = false;
    showError("startTime", "Start time should be in the future");
  }

  // End time validation
  var selectedEndTime = new Date(endTime);
  if (selectedEndTime <= currentDateTime) {
    isValidForm = false;
    showError("endTime", "End time should be in the future");
  }

  // Submit the form if it is valid
  if (isValidForm) {
    jQuery.ajax({
      url: "/admin/offers/coupon",
      data: jQuery("#voucherId").serialize(),
      method: "POST",
      success: function (response) {
        window.location.reload();
        alert("Submitted");
      },
      error: function (err) {
        alert("Something went wrong");
      },
    });
  }

  return false; // Prevent the form from submitting and closing
}

function resetForm() {
  let form = document.getElementById("voucherId");
  let fields = form.getElementsByClassName("form-control");
  for (let i = 0; i < fields.length; i++) {
    fields[i].classList.remove("is-invalid");
    fields[i].placeholder = fields[i].getAttribute("data-placeholder");
  }
}

function showError(fieldId, errorMessage) {
  let field = document.getElementById(fieldId);
  field.classList.add("is-invalid");
  field.placeholder = errorMessage;
}


$(document).ready(function () {
  $("#myTable").DataTable();
});