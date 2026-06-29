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

async function load(){

const notifications =
await getNotifications();

list.innerHTML="";

notifications.forEach(item=>{

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

if(
!title||
!message
){

alert(
"Fill all fields."
);

return;

}

await createNotification({

title,

message,

target

});

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

load();