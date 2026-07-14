import{
getSupportTickets,
updateSupportStatus,
updateSupportPriority,
addSupportReply,
assignSupportTicket,
addSupportNote
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

const exportBtn=
document.getElementById(
"exportSupportCsv"
);

const priorityFilter=
document.getElementById(
"priorityFilter"
);

const assignmentFilter=
document.getElementById(
"assignmentFilter"
);

const replyFilter=
document.getElementById(
"replyFilter"
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

if(
priorityFilter.value!=="all"
){

data=data.filter(
ticket=>

(ticket.priority||"Medium")===priorityFilter.value

);

}

if(
assignmentFilter.value==="assigned"
){

data=data.filter(
ticket=>

ticket.assignedTo

);

}

if(
assignmentFilter.value==="unassigned"
){

data=data.filter(
ticket=>

!ticket.assignedTo

);

}

if(
replyFilter.value==="replied"
){

data=data.filter(
ticket=>

(ticket.replies||[]).length>0

);

}

if(
replyFilter.value==="unreplied"
){

data=data.filter(
ticket=>

(ticket.replies||[]).length===0

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

<select
onchange="changePriority(
'${ticket.id}',
this.value
)">

<option
${ticket.priority==="Low"?"selected":""}>

Low

</option>

<option
${ticket.priority==="Medium"?"selected":""}>

Medium

</option>

<option
${ticket.priority==="High"?"selected":""}>

High

</option>

<option
${ticket.priority==="Urgent"?"selected":""}>

Urgent

</option>

</select>

<p>

Assigned :

${ticket.assignedTo||"Unassigned"}

</p>

<br>

<input
id="assign-${ticket.id}"
placeholder="Admin Name">

<button
onclick="assignTicket('${ticket.id}')">

Assign

</button>

${
(ticket.replies||[])

.map(reply=>`

<div
style="
margin-left:15px;
border-left:3px solid #666;
padding-left:10px;
margin-bottom:10px;
">

<b>

${reply.sender}

</b>

<br>

${reply.message}

<br>

<small>

${reply.createdAt}

</small>

</div>

`).join("")
}

<hr>

<h4>

Internal Notes

</h4>

${
(ticket.adminNotes||[])

.map(note=>`

<div
style="
background:#222;
padding:8px;
margin:6px 0;
border-left:4px solid orange;
">

<b>

${note.admin}

</b>

<br>

${note.note}

<br>

<small>

${note.createdAt}

</small>

</div>

`).join("")
}

<hr>

<h4>

Timeline

</h4>

${
(ticket.timeline||[])

.map(item=>`

<div
style="
margin:6px 0;
padding:8px;
border-left:3px solid #4caf50;
background:#1f1f1f;
">

<b>

${item.event}

</b>

<br>

<small>

${item.user}

</small>

<br>

<small>

${item.createdAt}

</small>

</div>

`).join("")
}

<textarea
id="reply-${ticket.id}"
placeholder="Reply">
</textarea>

<br>

<button
onclick="replyTicket('${ticket.id}')">

Reply

</button>

<br><br>

<textarea
id="note-${ticket.id}"
placeholder="Internal Admin Note">
</textarea>

<br>

<button
onclick="saveNote('${ticket.id}')">

Save Note

</button>

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

priorityFilter.onchange=
load;

assignmentFilter.onchange=
load;

replyFilter.onchange=
load;

load();

window.changePriority=
async function(
id,
priority
){

await updateSupportPriority(
id,
priority
);

load();

};

window.assignTicket=
async function(id){

const admin=

document
.getElementById(
"assign-"+id
)
.value
.trim();

if(!admin){

alert(
"Enter admin name."
);

return;

}

await assignSupportTicket(

id,

admin

);

load();

};

window.replyTicket=
async function(id){

await addSupportReply(

id,

document
.getElementById(
"reply-"+id
).value

);

load();

};

window.saveNote=
async function(id){

const note=

document
.getElementById(
"note-"+id
)
.value
.trim();

if(!note){

return;

}

await addSupportNote(

id,

note

);

load();

};

exportBtn.onclick=()=>{

let csv=

"Subject,Email,Status,Priority,Assigned To,Replies,Created At\n";

tickets.forEach(ticket=>{

csv+=`"${ticket.subject||""}","${ticket.email||""}","${ticket.status||""}","${ticket.priority||""}","${ticket.assignedTo||""}","${(ticket.replies||[]).length}","${ticket.createdAt||""}"\n`;

});

const blob=
new Blob(
[csv],
{
type:"text/csv"
}
);

const url=
URL.createObjectURL(
blob
);

const a=
document.createElement(
"a"
);

a.href=url;

a.download=
"support-tickets.csv";

a.click();

URL.revokeObjectURL(
url
);

};