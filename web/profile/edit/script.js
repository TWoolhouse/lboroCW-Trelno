import { navbar } from "/nav.js";
navbar();


//Javascript for uploading photo window
const updateButton = document.getElementById('card-upload-button');
const favDialog = document.getElementById('favDialog');
const outputBox = document.querySelector('output');
const selectEl = favDialog.querySelector('select');
const confirmBtn = favDialog.querySelector('#confirmBtn');

// If a browser doesn't support the dialog, then hide the
// dialog contents by default.
if (typeof favDialog.showModal !== 'function') {
  favDialog.hidden = true;
  /* a fallback script to allow this dialog/form to function
     for legacy browsers that do not support <dialog>
     could be provided here.
  */
}
// "Update details" button opens the <dialog> modally
updateButton.addEventListener('click', () => {
  if (typeof favDialog.showModal === "function") {
    favDialog.showModal();
  } else {
    outputBox.value = "Sorry, the <dialog> API is not supported by this browser.";
  }
});

// "Confirm" button of form triggers "close" on dialog because of [method="dialog"]
favDialog.addEventListener('close', () => {
//will need to add code to acctually change the profile picture here
});





//Javascript for changing your password window
const updateButtonPassword = document.getElementById('change-password-btn');
const passwordDialog = document.getElementById('passwordDialog');
const outputBoxPassword = document.querySelector('output');
const confirmBtnPassword = passwordDialog.querySelector('#confirmBtnPassword');

// If a browser doesn't support the dialog, then hide the
// dialog contents by default.
if (typeof passwordDialog.showModal !== 'function') {
  passwordDialog.hidden = true;
  /* a fallback script to allow this dialog/form to function
     for legacy browsers that do not support <dialog>
     could be provided here.
  */
}
// "Update details" button opens the <dialog> modally
updateButtonPassword.addEventListener('click', () => {
  if (typeof passwordDialog.showModal === "function") {
    passwordDialog.showModal();
  } else {
    outputBoxPassword.value = "Sorry, the <dialog> API is not supported by this browser.";
  }
});

// "Confirm" button of form triggers "close" on dialog because of [method="dialog"]
passwordDialog.addEventListener('close', () => {
//will need to add code to acctually change the profile picture here
});
