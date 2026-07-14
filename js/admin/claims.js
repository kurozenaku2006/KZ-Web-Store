import {
    getAllClaims,
    updateClaimStatus,
    getClaimTimeline,
    getClaimNotes,
    addClaimNote,
    deleteClaimNote
}
from "../services/claims.js";

const container =
document.getElementById(
"claimsContainer"
);

const stats =
document.getElementById(
"claimStats"
);

const search =
document.getElementById(
"claimSearch"
);

const filter =
document.getElementById(
"claimStatusFilter"
);

let allClaims = [];

let claims = [];

async function loadClaims(){

allClaims =
await getAllClaims();

claims =
[...allClaims];

const keyword =
search.value.toLowerCase();

if(keyword){

claims =
claims.filter(claim=>

(claim.orderId||"")
.toLowerCase()
.includes(keyword)

||

(claim.productId||"")
.toLowerCase()
.includes(keyword)

||

(claim.uid||"")
.toLowerCase()
.includes(keyword)

);

}

if(
document.getElementById(
"claimStatusFilter"
).value!=="all"
){

claims =
claims.filter(
claim=>

claim.status===document.getElementById(
"claimStatusFilter"
).value

);

}

renderStats(claims);

render();

}

function renderStats(data){

const pending =
data.filter(
c=>c.status==="pending"
).length;

const approved =
data.filter(
c=>c.status==="approved"
).length;

const rejected =
data.filter(
c=>c.status==="rejected"
).length;

stats.innerHTML=`

<div class="card">

<h3>Total Claims</h3>

<div class="card-value">

${data.length}

</div>

</div>

<div class="card">

<h3>Pending</h3>

<div class="card-value">

${pending}

</div>

</div>

<div class="card">

<h3>Approved</h3>

<div class="card-value">

${approved}

</div>

</div>

<div class="card">

<h3>Rejected</h3>

<div class="card-value">

${rejected}

</div>

</div>

`;

}

function render(){

let data=[...claims];

const keyword=
search.value
.trim()
.toLowerCase();

const dateFilter=

document.getElementById(
"claimDate"
)?.value || "";

if(keyword){

data=data.filter(claim=>

(claim.id||"")
.toLowerCase()
.includes(keyword)

||

(claim.uid||"")
.toLowerCase()
.includes(keyword)

||

(claim.orderId||"")
.toLowerCase()
.includes(keyword)

||

(claim.productId||"")
.toLowerCase()
.includes(keyword)

||

(claim.reason||"")
.toLowerCase()
.includes(keyword)

);

}

if(dateFilter){

data=data.filter(claim=>

(claim.createdAt||"")

.startsWith(
dateFilter
)

);

}

if(data.length===0){

    renderStats(claims);

container.innerHTML=
"<p>No Claims Found</p>";

return;

}

container.innerHTML=
data.map(claim=>`

<div class="card">

<p>

Order :
${claim.orderId}

</p>

<p>

Product :
${claim.productId}

</p>

<p>

Customer :
${claim.uid}

</p>

<p>

Customer :
${claim.uid}

</p>

<p>

Reason :
${claim.reason}

</p>

<p>

Status :
<b>${claim.status}</b>

</p>

<p>

Created :
${new Date(
claim.createdAt
).toLocaleString()}

</p>

<p>

Updated :
${claim.updatedAt
?
new Date(
claim.updatedAt
).toLocaleString()
:
"-"}

</p>

<hr>

<b>

Timeline

</b>

<p>

Created

</p>

<p>

↓

</p>

<p>

${claim.status}

</p>

<p>

${new Date(
claim.createdAt
).toLocaleString()}

</p>

<hr>

<h4>

Admin Notes

</h4>

<div
id="notes-${claim.id}">

Loading...

</div>

<textarea
id="note-${claim.id}"
placeholder="Add admin note"
style="width:100%;height:70px;">
</textarea>

<br><br>

<button
onclick="saveClaimNote('${claim.id}')">

Add Note

</button>

<hr>

<div
id="timeline-${claim.id}">

Loading Timeline...

</div>

<hr>

<button
onclick="approveClaim('${claim.id}')">

Approve

</button>

<button
onclick="rejectClaim('${claim.id}')">

Reject

</button>

</div>

<br>

`).join("");

data.forEach(async claim=>{

const notes=
await getClaimNotes(
claim.id
);

const timeline=
await getClaimTimeline(
claim.id
);

const notesDiv=
document.getElementById(
`notes-${claim.id}`
);

if(notesDiv){

notesDiv.innerHTML=

notes.length===0

?

"<p>No Notes</p>"

:

notes.map(note=>`

<div class="activity-item">

<p>

${note.note}

</p>

<p>

${note.admin||"Administrator"}

</p>

<p>

${new Date(
note.createdAt
).toLocaleString()}

</p>

<button
onclick="removeClaimNote('${note.id}')">

Delete

</button>

</div>

`).join("");

}

const timelineDiv=
document.getElementById(
`timeline-${claim.id}`
);

if(timelineDiv){

timelineDiv.innerHTML=

timeline.length===0

?

"<p>No Timeline</p>"

:

timeline.map(event=>`

<div class="activity-item">

<p>

<b>

${event.action}

</b>

</p>

<p>

${event.performedBy}

</p>

<p>

${new Date(
event.createdAt
).toLocaleString()}

</p>

</div>

`).join("");

}

});

}

window.approveClaim =
async function(id){

    await updateClaimStatus(
        id,
        "approved"
    );

    await loadClaims();

}

window.rejectClaim =
async function(id){

    await updateClaimStatus(
        id,
        "rejected"
    );

    await loadClaims();

}

window.saveClaimNote=
async function(claimId){

const textarea=
document.getElementById(
`note-${claimId}`
);

const note=
textarea.value.trim();

if(!note){

alert(
"Enter a note."
);

return;

}

await addClaimNote(

claimId,

note,

"Administrator"

);

await loadClaims();

};

window.removeClaimNote=
async function(id){

if(
!confirm(
"Delete this note?"
)
){

return;

}

await deleteClaimNote(
id
);

await loadClaims();

};

search.oninput=
loadClaims;

const claimDate=

document.getElementById(
"claimDate"
);

if(claimDate){

claimDate.onchange=

loadClaims;

}

document.getElementById(
"claimStatusFilter"
).onchange =
loadClaims;

window.exportClaims=function(){

const csv=[

"Order,Product,Customer,Status,Reason,Created"

];

claims.forEach(claim=>{

csv.push(

`"${claim.orderId}","${claim.productId}","${claim.uid}","${claim.status}","${claim.reason}","${claim.createdAt}"`

);

});

const blob=
new Blob(

[csv.join("\n")],

{
type:"text/csv"
}

);

const url=
URL.createObjectURL(blob);

const a=
document.createElement("a");

a.href=url;

a.download="claims.csv";

a.click();

URL.revokeObjectURL(url);

};

setInterval(

loadClaims,

30000

);