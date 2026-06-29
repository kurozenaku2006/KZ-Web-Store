import{
getSupportTickets,
updateSupportStatus
}
from "../services/support.js";

const container=
document.getElementById(
"supportContainer"
);

async function load(){

const tickets=
await getSupportTickets();

container.innerHTML=

tickets.length===0

?

"<p>No Tickets</p>"

:

tickets.map(ticket=>`

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

<button
onclick="closeTicket('${ticket.id}')">

Close

</button>

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

load();