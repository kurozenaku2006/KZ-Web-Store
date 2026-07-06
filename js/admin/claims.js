import {
    getAllClaims,
    updateClaimStatus
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
search.value.toLowerCase();

if(keyword){

data=data.filter(claim=>

(claim.reason||"")
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

<div class="activity-item">

${claim.note || "No Notes"}

</div>

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

search.oninput=
loadClaims;

document.getElementById(
"claimStatusFilter"
).onchange =
loadClaims;

window.exportClaims=function(){

const csv=[

"Order,Product,Customer,Status,Reason,Created"

];

allClaims.forEach(claim=>{

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