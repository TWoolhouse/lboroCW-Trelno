import { navbar } from "../nav.js";

navbar();

import * as api from "../api/core.js";
import { redirectLogin } from "../api/active.js";
import { currentUser } from "../api/active.js";

redirectLogin();

// Read query string parameters
const urlParams = new URLSearchParams(window.location.search);
let user = await api.user(urlParams.get("id"));
if (user == undefined) {
  user = currentUser;
}

console.log("User", user);

//updates their name (on the main page)
document.getElementById("title-card").innerHTML = user.name;

//updates their profile picture
document.getElementById("card-profile-picture").src = user.profilePicture();

//updates their status (e.g. manager (which is the default option), team leader, nothing)
document.getElementById("heirarchy-card").innerHTML = user.rankTitle();

//updates their email address
document.getElementById("email-box").innerHTML = user.email;
