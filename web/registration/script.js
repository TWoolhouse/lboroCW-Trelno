
/*quick attempt at form validation*/
function validateForm() {
    let x = document.forms["registrationForm"]["email"].value;
    var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (x.value.match(mailFormat)) {
        return true;
    } else {
        alert("Invaild Email");
        return false;
    }
    
}