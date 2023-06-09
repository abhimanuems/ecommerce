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
