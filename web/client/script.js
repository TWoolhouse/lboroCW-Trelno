import * as api from "../api/core.js";
import { currentUser, redirectLogin } from "../api/active.js";

// Read query string parameters
const urlParams = new URLSearchParams(window.location.search);
const client = await api.client(urlParams.get("id"));
console.log(client);
if (client == null); // Do something if the client can't be found and it was a broken link
console.log("Client", client);

// Get client details
function setup() {
  document.querySelector("#client-name").innerHTML = client.name;
  document.querySelector("#client-representative").innerHTML =
    client.representative;
  document.querySelector("#client-address").innerHTML = client.address;
  document
    .querySelector("#client-email")
    .setAttribute("href", "mailto:" + client.email);
  addClientContact(client.email, client.phone, client.website);
  document
    .querySelector("#client-web")
    .setAttribute("href", "https://" + client.website);
  document.querySelector(
    "#client-image"
  ).src = `https://ui-avatars.com/api/?name=${client.representative}&background=random&size=50&format=svg`;
}

setup();

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
