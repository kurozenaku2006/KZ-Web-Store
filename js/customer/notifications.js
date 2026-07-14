import{

getCustomerNotifications,

updateNotification,

saveNotificationPreferences,

getNotificationPreferences

}
from "../services/notifications.js";

import{

auth

}
from "../config/firebase.js";

const list=
document.getElementById(
"notificationList"
);

const search=
document.getElementById(
"notificationSearch"
);

const filter=
document.getElementById(
"notificationFilter"
);

const channelFilter=

document.getElementById(
"channelFilter"
);

let notifications=[];

async function load(){

notifications=
await getCustomerNotifications();

render();

}

function render(){

let data=
[...notifications];

const keyword=
search.value.toLowerCase();

if(keyword){

data=data.filter(item=>

(item.title||"")
.toLowerCase()
.includes(keyword)

||

(item.message||"")
.toLowerCase()
.includes(keyword)

);

}

if(filter.value==="read"){

data=data.filter(
item=>item.read
);

}

if(filter.value==="unread"){

data=data.filter(
item=>!item.read
);

}

if(filter.value==="archived"){

data=data.filter(
item=>item.archived
);

}

if(

channelFilter.value!=="all"

){

data=data.filter(

item=>

(item.channel||"inapp")

===

channelFilter.value

);

}

list.innerHTML="";

if(data.length===0){

list.innerHTML=
"<p>No Notifications</p>";

return;

}

data.forEach(item=>{

list.innerHTML+=`

<div class="card">

<h3>

${item.title}

</h3>

<p>

${item.message}

</p>

<p>

${item.createdAt}

</p>

<p>

Channel :

${item.channel||"inapp"}

</p>

<p>

Priority :

${item.priority||"normal"}

</p>

<p>

Status :

${item.deliveryStatus||"pending"}

</p>

<p>

${item.read?"Read":"Unread"}

</p>

<button
onclick="markRead('${item.id}')">

Mark Read

</button>

<button
onclick="archiveNotification('${item.id}')">

Archive

</button>

</div>

`;

});

}

window.markRead=
async function(id){

await updateNotification(
id,
{
read:true
}
);

load();

}

window.archiveNotification=
async function(id){

await updateNotification(
id,
{
archived:true
}
);

load();

}

search.oninput=
render;

filter.onchange=
render;

channelFilter.onchange=

render;

initialize();

async function initialize(){

await load();

const prefs=

await getNotificationPreferences(

auth.currentUser.uid

);

document.getElementById(
"prefInApp"
).checked=
prefs.inApp;

document.getElementById(
"prefEmail"
).checked=
prefs.email;

document.getElementById(
"prefSMS"
).checked=
prefs.sms;

document.getElementById(
"prefPush"
).checked=
prefs.push;

}

document.getElementById(
"savePreferences"
).onclick=
async()=>{

await saveNotificationPreferences(

auth.currentUser.uid,

{

inApp:
document.getElementById(
"prefInApp"
).checked,

email:
document.getElementById(
"prefEmail"
).checked,

sms:
document.getElementById(
"prefSMS"
).checked,

push:
document.getElementById(
"prefPush"
).checked

}

);

alert(
"Preferences Saved"
);

};