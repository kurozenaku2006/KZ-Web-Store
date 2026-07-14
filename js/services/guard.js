import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { auth } from "../config/firebase.js";
import {
getStoreSettings
}
from "./settings.js";
import { getUserData } from "./auth.js";

export async function requireAdmin() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.href = "/login.html";
        return;
      }

      const userData =
        await getUserData(user.uid);

      if (!userData) {
        window.location.href = "/login.html";
        return;
      }

      if (userData.role !== "admin") {
        window.location.href =
          "/customer/dashboard.html";
        return;
      }

      resolve(userData);
    });
  });
}

export async function requireCustomer() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.href = "/login.html";
        return;
      }

      const userData =
        await getUserData(user.uid);

      if (!userData) {
        window.location.href = "/login.html";
        return;
      }

      resolve(userData);
    });
  });
}

export async function requireMaintenanceOff(){

const settings =
await getStoreSettings();

if(
settings.maintenance === "on"
){

const path =
window.location.pathname
.toLowerCase();

const isAdmin =
path.startsWith("/admin");

if(!isAdmin){

document.body.innerHTML = `

<div
style="
display:flex;
justify-content:center;
align-items:center;
height:100vh;
background:#111;
color:white;
font-family:Arial;
text-align:center;
padding:30px;
">

<div>

<h1>

We'll Be Back Soon

</h1>

<br>

<p>

Our store is currently under maintenance.

</p>

<br>

<p>

Please check back later.

</p>

</div>

</div>

`;

throw new Error(
"Maintenance Mode"
);

}

}

}