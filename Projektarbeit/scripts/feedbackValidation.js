let emailError = document.getElementById("emailError");
let email = document.getElementById("email");

let feedBackField = document.getElementById("feedbackField");

function validateEmail() {

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(email.value)) {
        emailError.innerHTML = email.value + " is not a valid email";
        return false;
    }else {
        emailError.innerHTML = "";
        return true;
    }
}

function validateFeedbackField() {
    return feedBackField.value.length >= 50;
}

function checkFormFilledOut() {
    return validateEmail() && validateFeedbackField();
}