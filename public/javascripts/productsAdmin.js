function validateForm()
        {
            console.log("enetred here!")
           
           alert("enetred in the validate form")
            var name =document.getElementById("name").value;
            var nameRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
            var email=document.getElementById("email").value;
             var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
             var subject=document.getElementById("subject").value;
             var message=document.getElementById("message").value;
            if (!name.match(nameRegex)) {
                var inputElement = document.getElementById("name");
                 alert("Enter a proper name");

                return false;  
            }
            else if (!email.match(validRegex)) {
                 
                alert("Please enter a valid email address.");
                return false;
            }
              else  if (subject == null || subject == "") {
                var inputElement = document.getElementById("subject");
                inputElement.placeholder = "Enter a subject";
                return false;
            }
           else  if(message ==null || message =="")
            {
                var inputElement = document.getElementById("message");
                inputElement.placeholder = "Enter a Message";
                 return false;
            }
        }