import {

getUsersWithRoles,

updateUserRole

}
from "../services/roles.js";

const usersList =
document.getElementById(
"usersList"
);

async function load(){

const users =
await getUsersWithRoles();

usersList.innerHTML="";

users.forEach(user=>{

usersList.innerHTML+=`

<div class="card">

<h3>

${user.name || "-"}

</h3>

<p>

${user.email}

</p>

<select
onchange="changeRole('${user.id}',this.value)">

<option
value="customer"
${user.role==="customer"?"selected":""}>

Customer

</option>

<option
value="admin"
${user.role==="admin"?"selected":""}>

Admin

</option>

</select>

</div>

`;

});

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

load();