import{

createSupportTicket,

getCustomerSupportTickets,

updateSupportStatus

}
from "../services/support.js";

const list=
document.getElementById(
"ticketList"
);

const search=
document.getElementById(
"ticketSearch"
);

const createBtn=
document.getElementById(
"createTicket"
);

let tickets=[];

async function load(){

tickets=
await getCustomerSupportTickets();

render();

}

function render(){

let data=[...tickets];

const keyword=
search.value
.toLowerCase();

if(keyword){

data=data.filter(ticket=>

(ticket.subject||"")
.toLowerCase()
.includes(keyword)

||

(ticket.message||"")
.toLowerCase()
.includes(keyword)

);

}

list.innerHTML="";

if(data.length===0){

list.innerHTML=
"<p>No Tickets</p>";

return;

}

data.forEach(ticket=>{

list.innerHTML+=`

<div class="card">

<h3>

${ticket.subject}

</h3>

<p>

${ticket.message}

</p>

<p>

Status :

${ticket.status}

</p>

<p>

Priority :

${ticket.priority||"Medium"}

</p>

<button
onclick="closeTicket('${ticket.id}')">

Close

</button>

</div>

`;

});

}

window.closeTicket=
async function(id){

await updateSupportStatus(
id,
"closed"
);

load();

}

createBtn.onclick=
async()=>{

await createSupportTicket({

subject:
document.getElementById(
"subject"
).value,

message:
document.getElementById(
"message"
).value

});

document.getElementById(
"subject"
).value="";

document.getElementById(
"message"
).value="";

load();

};

search.oninput=
render;

load();