import * as api from "../api/core.js";
import { currentUser, redirectLogin } from "../api/active.js";
// import { Client } from "../api/model/client.js"; // not implemented yet

// Read query string parameters
const urlParams = new URLSearchParams(window.location.search);
const clientId = urlParams.get("id");

// Get client details
await api.client(clientId).then((clientResponse) => {
  document.querySelector("#client-name").innerHTML = clientResponse.name;
  document.querySelector("#client-representative").innerHTML =
    clientResponse.representative.name;
  document.querySelector("#client-address").innerHTML = clientResponse.address;
  document
    .querySelector("#client-email")
    .setAttribute("href", "mailto:" + clientResponse.email);
  addClientContact(
    clientResponse.email,
    clientResponse.phone,
    clientResponse.website
  );
  document
    .querySelector("#client-web")
    .setAttribute("href", clientResponse.website);
});

// Add client contact details to the relevant card
function addClientContact(email, phone, website) {
  let infoParagraph = document.querySelector("#client-info");
  const clientInfo =
    "Email: " +
    email +
    "<br/>" +
    " Phone: " +
    phone +
    "<br/>" +
    " Website: " +
    website;

  infoParagraph.innerHTML = clientInfo;
}
