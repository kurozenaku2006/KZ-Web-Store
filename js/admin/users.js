import {
getUsers,
toggleUserStatus
}
from "../services/users.js";

import {
updateUserRole
}
from "../services/roles.js";

let users=[];

const container=
document.getElementById(
"usersContainer"
);

const search=
document.getElementById(
"searchUser"
);

const roleFilter=
document.getElementById(
"roleFilter"
);

async function load(){

users=
await getUsers();

render();

}

function render(){

let data=[...users];

const keyword=
search.value
.toLowerCase();

if(keyword){

data=data.filter(user=>

(user.name||"")
.toLowerCase()
.includes(keyword)

||

(user.email||"")
.toLowerCase()
.includes(keyword)

);

}

if(
roleFilter.value!=="all"
){

data=data.filter(
user=>
user.role===
roleFilter.value
);

}

container.innerHTML=

data.map(user=>`

<div class="card">

<h3>

${user.name}

</h3>

<p>

${user.email}

</p>

<p>

Role :
${user.role}

</p>

<p>

Status :
${user.active?"Active":"Disabled"}

</p>

<button
onclick="changeRole(
'${user.id}',
'customer'
)">

Customer

</button>

<button
onclick="changeRole(
'${user.id}',
'admin'
)">

Admin

</button>

<button
onclick="toggleStatus(
'${user.id}',
${!user.active}
)">

${user.active?"Disable":"Enable"}

</button>

</div>

<br>

`).join("");

}

window.changeRole=
async function(
id,
role
){

await updateUserRole(
id,
role
);

load();

};

window.toggleStatus=
async function(
id,
status
){

await toggleUserStatus(
id,
status
);

load();

};

search.oninput=
render;

roleFilter.onchange=
render;

load();