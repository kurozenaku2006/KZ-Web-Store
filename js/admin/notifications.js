import {

createNotification,

getNotifications,

deleteNotification

}
from "../services/notifications.js";

const list =
document.getElementById(
"notificationList"
);

const sendBtn =
document.getElementById(
"sendBtn"
);

const search =
document.getElementById(
"notificationSearch"
);

let notifications = [];

async function load(){

notifications =
await getNotifications();

const keyword =
search.value
.toLowerCase();

let data =
[...notifications];

if(keyword){

data =
data.filter(item=>

(item.title||"")
.toLowerCase()
.includes(keyword)

||

(item.message||"")
.toLowerCase()
.includes(keyword)

);

}

list.innerHTML="";

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

Target :

${item.target}

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

Delivery :

${item.deliveryStatus||"pending"}

</p>

<p>

${item.createdAt}

</p>

<button
onclick="removeNotification('${item.id}')">

Delete

</button>

</div>

`;

});

}

window.removeNotification=
async function(id){

if(
!confirm(
"Delete notification?"
)
)return;

await deleteNotification(
id
);

load();

}

sendBtn.onclick=
async()=>{

const title=
document
.getElementById(
"title"
).value;

const message=
document
.getElementById(
"message"
).value;

const target=
document
.getElementById(
"target"
).value;

const scheduleAt =
document
.getElementById(
"scheduleAt"
).value;

const customerUid =
document
.getElementById(
"customerUid"
).value.trim();

const channel=

document
.getElementById(
"notificationChannel"
).value;

const priority=

document
.getElementById(
"notificationPriority"
).value;

if(
!title||
!message
){

alert(
"Fill all fields."
);

return;

}

try{

    await createNotification({

title,

message,

target,

scheduleAt,

customerUid,

channel,

priority

});

}
catch(error){

    alert(
        error.message
    );

    return;

}

document
.getElementById(
"title"
).value="";

document
.getElementById(
"message"
).value="";

load();

};

search.oninput =
load;

load();