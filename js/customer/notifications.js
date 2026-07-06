import{

getCustomerNotifications,

updateNotification

}
from "../services/notifications.js";

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

load();