import { navbar } from "../nav.js";

navbar();

import * as api from "../api/core.js";
import { redirectLogin } from "../api/active.js";
import { currentUser } from "../api/active.js";

redirectLogin();


// Read query string parameters
const urlParams = new URLSearchParams(window.location.search);
let userID = await api.user(urlParams.get("id"));
if (userID == undefined){
    userID = currentUser;
}

console.log(userID);

//updates their name (on the main page)
document.getElementById("title-card").innerHTML = userID["name"];

//updating their profile picture cannot be done yet

//updates their status (e.g. manager (which is the default option), team leader, nothing)
if (userID["rank"]==1){
    document.getElementsByClassName("heirarchy-card").innerHTML = "Team leader";
} else if (userID["rank"]==0){
    document.getElementsByClassName("heirarchy-card").innerHTML = "";
} 

//updates their email address
document.getElementById("email-box").innerHTML = userID["email"];