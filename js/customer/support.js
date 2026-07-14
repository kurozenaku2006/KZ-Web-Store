import{

createSupportTicket,

getCustomerSupportTickets,

updateSupportStatus,

addSupportReply

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

let selectedTicket="";

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
onclick="selectTicket('${ticket.id}')">

Reply

</button>

<br><br>

${
(ticket.replies||[])

.map(reply=>`

<div
style="margin-left:15px">

<b>

${reply.sender}

</b>

<br>

${reply.message}

<br>

<small>

${reply.createdAt}

</small>

<hr>

</div>

`).join("")
}

<button
onclick="closeTicket('${ticket.id}')">

Close

</button>

</div>

`;

});

}

window.selectTicket=
function(id){

selectedTicket=id;

};

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
).value,

priority:
document.getElementById(
"priority"
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

document
.getElementById(
"sendReply"
)
.onclick=
async()=>{

if(!selectedTicket){

alert(
"Select a ticket first."
);

return;

}

await addSupportReply(

selectedTicket,

document
.getElementById(
"replyMessage"
).value

);

document
.getElementById(
"replyMessage"
).value="";

load();

};