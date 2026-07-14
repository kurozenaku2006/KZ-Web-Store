import{
getCustomerCenter,
updateProfileName,
addAddress,
clearWishlist
}
from "../services/profile.js";

async function load(){

const data=
await getCustomerCenter();

if(!data){

location.href="/login.html";

return;

}

document.getElementById(
"profileCard"
).innerHTML=`

<b>${data.user?.name||"-"}</b>

<br>

${data.user?.email||"-"}

`;

document.getElementById(
"profileName"
).value=
data.user?.name||"";

document.getElementById(
"rewardCard"
).innerHTML=`

Reward Points

<br><br>

<b>

${data.user?.rewardPoints||0}

</b>

`;

document.getElementById(
"addressList"
).innerHTML=

data.addresses.length

?

data.addresses.map(address=>`

<div class="activity-item">

${address}

</div>

`).join("")

:

"<p>No Addresses</p>";

document.getElementById(
"wishlist"
).innerHTML=

data.wishlist.length

?

data.wishlist.map(product=>`

<div class="activity-item">

${product.name}

<br>

₹${product.price}

</div>

`).join("")

:

"<p>No Wishlist Items</p>";

document.getElementById(
"orders"
).innerHTML=

data.orders.length

?

data.orders.slice(-5).reverse().map(order=>`

<div class="activity-item">

Order

<br>

₹${order.total}

<br>

${order.status}

</div>

`).join("")

:

"<p>No Orders</p>";

document.getElementById(
"claims"
).innerHTML=

data.claims.length

?

data.claims.slice(-5).reverse().map(claim=>`

<div class="activity-item">

${claim.productName||"-"}

<br>

${claim.status}

</div>

`).join("")

:

"<p>No Claims</p>";

}

load();

document.getElementById(
"saveProfileBtn"
).onclick=
async()=>{

const name=
document.getElementById(
"profileName"
).value.trim();

if(!name){

return;

}

await updateProfileName(
name
);

alert(
"Profile updated."
);

load();

};

document.getElementById(
"addAddressBtn"
).onclick=
async()=>{

const address=
document.getElementById(
"newAddress"
).value.trim();

if(!address){

return;

}

await addAddress(
address
);

document.getElementById(
"newAddress"
).value="";

load();

};

document.getElementById(
"clearWishlistBtn"
).onclick=
async()=>{

if(
!confirm(
"Clear wishlist?"
)
){

return;

}

await clearWishlist();

load();

};

document.getElementById(
"viewAllOrdersBtn"
).onclick=()=>{

location.href=
"/customer/orders.html";

};

document.getElementById(
"viewAllClaimsBtn"
).onclick=()=>{

location.href=
"/customer/claims.html";

};

const darkMode=

localStorage.getItem(
"customerDarkMode"
)==="true";

document.getElementById(
"darkMode"
).checked=
darkMode;

document.getElementById(
"saveSettingsBtn"
).onclick=()=>{

localStorage.setItem(

"customerDarkMode",

document.getElementById(
"darkMode"
).checked

);

alert(
"Settings saved."
);

location.reload();

};

if(darkMode){

document.body.classList.add(
"dark-mode"
);

}