import{
getSupportTickets,
updateSupportStatus
}
from "../services/support.js";

const container=
document.getElementById(
"supportContainer"
);

const stats=
document.getElementById(
"supportStats"
);

const search=
document.getElementById(
"ticketSearch"
);

const filter=
document.getElementById(
"ticketFilter"
);

let tickets=[];

async function load(){

tickets=
await getSupportTickets();

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

(ticket.email||"")
.toLowerCase()
.includes(keyword)

||

(ticket.message||"")
.toLowerCase()
.includes(keyword)

);

}

if(
filter.value!=="all"
){

data=data.filter(
ticket=>

ticket.status===filter.value

);

}

const open=
tickets.filter(
t=>t.status==="open"
).length;

const closed=
tickets.filter(
t=>t.status==="closed"
).length;

stats.innerHTML=`

<div class="card">

<h3>Total</h3>

<div class="card-value">

${tickets.length}

</div>

</div>

<div class="card">

<h3>Open</h3>

<div class="card-value">

${open}

</div>

</div>

<div class="card">

<h3>Closed</h3>

<div class="card-value">

${closed}

</div>

</div>

`;

container.innerHTML=

data.length===0

?

"<p>No Tickets</p>"

:

data.map(ticket=>`

<div class="card">

<h3>

${ticket.subject||"-"}

</h3>

<p>

${ticket.message||"-"}

</p>

<p>

${ticket.email||"-"}

</p>

<p>

${ticket.status||"open"}

</p>

<p>

Priority :

${ticket.priority||"Medium"}

</p>

<p>

Assigned :

${ticket.assignedTo||"Unassigned"}

</p>

${
ticket.status==="closed"

?

`<button
onclick="reopenTicket('${ticket.id}')">
Reopen
</button>`

:

`<button
onclick="closeTicket('${ticket.id}')">
Close
</button>`
}

</div>

<br>

`).join("");

}

window.closeTicket=
async id=>{

await updateSupportStatus(
id,
"closed"
);

load();

};

window.reopenTicket =
async id=>{

await updateSupportStatus(
id,
"open"
);

load();

};

search.oninput=
load;

filter.onchange=
load;

load();