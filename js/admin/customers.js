import{
getCustomers,
getCustomerStatistics,
getCustomerDetails,
updateCustomerStatus,
deleteCustomer,
updateCustomer,
updateCustomerRole,
getCustomerNotes,
addCustomerNote,
deleteCustomerNote
}
from "../services/customers.js";

let customers=[];

let selectedCustomers=[];

const container=
document.getElementById(
"customersContainer"
);

const search=
document.getElementById(
"customerSearch"
);

const sort=
document.getElementById(
"customerSort"
);

const statusFilter=
document.getElementById(
"customerStatusFilter"
);

const tierFilter=
document.getElementById(
"customerTierFilter"
);

const orderFilter=
document.getElementById(
"customerOrderFilter"
);

const riskFilter=
document.getElementById(
"customerRiskFilter"
);

const modal=
document.getElementById(
"customerModal"
);

const modalContent=
document.getElementById(
"customerModalContent"
);

const stats=
document.getElementById(
"customerStats"
);

const leaderboards=
document.getElementById(
"customerLeaderboards"
);

async function load(){

customers=
await getCustomers();

await renderStats();

render();

}

async function renderStats(){

const data=
await getCustomerStatistics();

stats.innerHTML=`

<div class="card">

<h3>

Customers

</h3>

<div class="card-value">

${data.totalCustomers}

</div>

</div>

<div class="card">

<h3>

Orders

</h3>

<div class="card-value">

${data.totalOrders}

</div>

</div>

<div class="card">

<h3>

Claims

</h3>

<div class="card-value">

${data.totalClaims}

</div>

</div>

<div class="card">

<h3>

Revenue

</h3>

<div class="card-value">

₹${data.totalSpend}

</div>

</div>

<div class="card">

<h3>

Reward Points

</h3>

<div class="card-value">

${data.totalRewardPoints}

</div>

</div>

<div class="card">

<h3>

Average Spend

</h3>

<div class="card-value">

₹${data.averageSpend}

</div>

</div>

<div class="card">

<h3>

Highest Spend

</h3>

<div class="card-value">

₹${data.highestSpend}

</div>

</div>

<div class="card">

<h3>

Highest Rewards

</h3>

<div class="card-value">

${data.highestRewardPoints}

</div>

</div>

<div class="card">

<h3>

Active Customers

</h3>

<div class="card-value">

${data.activeCustomers}

</div>

</div>

<div class="card">

<h3>

Disabled Customers

</h3>

<div class="card-value">

${data.disabledCustomers}

</div>

</div>

<div class="card">

<h3>

Customers With Orders

</h3>

<div class="card-value">

${data.customersWithOrders}

</div>

</div>

<div class="card">

<h3>

No Orders Yet

</h3>

<div class="card-value">

${data.customersWithoutOrders}

</div>

</div>

<div class="card">

<h3>

Reward Balance

</h3>

<div class="card-value">

${data.totalRewardBalance}

</div>

</div>

`;

leaderboards.innerHTML=`

<div class="card">

<h3>

Top Spenders

</h3>

${
data.topSpenders
.map(customer=>

`<p>

${customer.name}

—

₹${customer.totalSpend}

</p>`

)

.join("")
}

</div>

<div class="card">

<h3>

Highest Rewards

</h3>

${
data.highestRewardCustomers
.map(customer=>

`<p>

${customer.name}

—

${customer.rewardPoints||0}

</p>`

)

.join("")
}

</div>

<div class="card">

<h3>

Most Claims

</h3>

${
data.mostClaimCustomers
.map(customer=>

`<p>

${customer.name}

—

${customer.totalClaims}

</p>`

)

.join("")
}

</div>

<div class="card">

<h3>

Returning Customers

</h3>

<div class="card-value">

${data.returningCustomers}

</div>

</div>

`;

stats.innerHTML+=`

<div class="card">

<h3>

Returning Customers

</h3>

<div class="card-value">

${data.returningCustomers}

</div>

</div>

<div class="card">

<h3>

Top Spender

</h3>

<div class="card-value">

₹${data.highestSpend}

</div>

</div>

<div class="card">

<h3>

Highest Rewards

</h3>

<div class="card-value">

${data.highestRewardPoints}

</div>

</div>

`;

}

function render(){

const keyword=
search.value
.toLowerCase();

let data=
customers.filter(customer=>

(customer.name||"")
.toLowerCase()
.includes(keyword)

||

(customer.email||"")
.toLowerCase()
.includes(keyword)

);

if(
statusFilter.value!=="all"
){

data=
data.filter(
customer=>

(customer.status||"active")
===statusFilter.value

);

}

if(
tierFilter.value!=="all"
){

data=data.filter(

customer=>

customer.customerTier===

tierFilter.value

);

}

if(
orderFilter.value==="ordered"
){

data=data.filter(

customer=>

customer.totalOrders>0

);

}

if(
orderFilter.value==="noorders"
){

data=data.filter(

customer=>

customer.totalOrders===0

);

}

if(
riskFilter.value!=="all"
){

data=data.filter(

customer=>

customer.customerRisk===

riskFilter.value

);

}

if(
sort.value==="name"
){

data.sort(
(a,b)=>

(a.name||"")
.localeCompare(
b.name||""
)

);

}

if(
sort.value==="spent"
){

data.sort(
(a,b)=>

b.totalSpend-
a.totalSpend

);

}

if(
sort.value==="orders"
){

data.sort(
(a,b)=>

b.totalOrders-
a.totalOrders

);

}

if(
sort.value==="rewards"
){

data.sort(
(a,b)=>

(b.rewardPoints||0)-
(a.rewardPoints||0)

);

}

container.innerHTML=

data.length===0

?

"<p>No Customers</p>"

:

data.map(customer=>`

<div class="card">

<label>

<input
type="checkbox"
class="customerSelect"
value="${customer.id}"
${selectedCustomers.includes(customer.id)?"checked":""}>

Select

</label>

<br><br>

<h3>

${customer.name}

</h3>

<p>

${customer.email}

</p>

<p>

Joined :

${customer.createdAt
?
new Date(customer.createdAt).toLocaleDateString()
:
"-"}

</p>

<p>

Reward Points :
${customer.rewardPoints||0}

</p>

<p>

Status :

<b>

${customer.status||"active"}

</b>

</p>

<p>

Orders :
<b>${customer.totalOrders}</b>

</p>

<p>

Claims :
<b>${customer.totalClaims}</b>

</p>

<p>

Lifetime Spend :

<b>

₹${customer.totalSpend}

</b>

</p>

<p>

Tier :

<b>

${customer.customerTier}

</b>

</p>

<p>

Risk :

<b>

${customer.customerRisk}

</b>

</p>

<p>

Last Order :

${

customer.lastOrder

?

new Date(
customer.lastOrder
).toLocaleDateString()

:

"Never"

}

</p>

<p>

Average Order :

₹${customer.averageOrder}

</p>

<p>

Largest Order :

₹${customer.largestOrder}

</p>

<br>

<button
onclick="viewCustomer('${customer.uid}')">

View Details

</button>

<br><br>

${

customer.status==="disabled"

?

`<button
onclick="enableCustomer('${customer.id}')">

Enable

</button>`

:

`<button
onclick="disableCustomer('${customer.id}')">

Disable

</button>`

}

<button
onclick="removeCustomer('${customer.id}')">

Delete

</button>

</div>

<br>

`).join("");

}

document
.querySelectorAll(
".customerSelect"
)
.forEach(box=>{

box.onchange=()=>{

if(box.checked){

if(
!selectedCustomers.includes(
box.value
)
){

selectedCustomers.push(
box.value
);

}

}
else{

selectedCustomers=
selectedCustomers.filter(
id=>id!==box.value
);

}

};

});

window.exportCustomers =
function(){

const csv =

[
"Name,Email,Reward Points,Orders,Claims,Spent,Status,Joined"
];

customers.forEach(customer=>{

csv.push(

`"${customer.name}","${customer.email}",${customer.rewardPoints||0},${customer.totalOrders},${customer.totalClaims},${customer.totalSpend},"${customer.status||"active"}","${customer.createdAt||""}"`

);

});

const blob =
new Blob(
[csv.join("\n")],
{
type:"text/csv"
}
);

const url =
URL.createObjectURL(
blob
);

const a =
document.createElement(
"a"
);

a.href=url;
a.download=
"customers.csv";
a.click();

URL.revokeObjectURL(
url);

};

search.oninput=
render;

sort.onchange=
render;

statusFilter.onchange=
render;

tierFilter.onchange=
render;

orderFilter.onchange=
render;

riskFilter.onchange=
render;

load();

document.getElementById(
"selectAllCustomers"
).onclick=()=>{

if(
selectedCustomers.length===
customers.length
){

selectedCustomers=[];

}
else{

selectedCustomers=
customers.map(
customer=>customer.id
);

}

render();

};

document.getElementById(
"bulkEnableCustomers"
).onclick=
async()=>{

if(
selectedCustomers.length===0
){

alert(
"No customers selected."
);

return;

}

for(const id of selectedCustomers){

await updateCustomerStatus(
id,
"active"
);

}

selectedCustomers=[];

await load();

};

document.getElementById(
"bulkDisableCustomers"
).onclick=
async()=>{

if(
selectedCustomers.length===0
){

alert(
"No customers selected."
);

return;

}

for(const id of selectedCustomers){

await updateCustomerStatus(
id,
"disabled"
);

}

selectedCustomers=[];

await load();

};

document.getElementById(
"bulkDeleteCustomers"
).onclick=
async()=>{

if(
selectedCustomers.length===0
){

alert(
"No customers selected."
);

return;

}

if(
!confirm(
"Delete selected customers?"
)
){

return;

}

for(const id of selectedCustomers){

await deleteCustomer(
id
);

}

selectedCustomers=[];

await load();

};

document.getElementById(
"bulkExportCustomers"
).onclick=()=>{

const selected=
customers.filter(
customer=>
selectedCustomers.includes(
customer.id
)
);

const csv=[

"Name,Email,Orders,Claims,Spend,Status"

];

selected.forEach(customer=>{

csv.push(

`"${customer.name}","${customer.email}",${customer.totalOrders},${customer.totalClaims},${customer.totalSpend},"${customer.status||"active"}"`

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
URL.createObjectURL(
blob
);

const a=
document.createElement(
"a"
);

a.href=url;

a.download=
"selected-customers.csv";

a.click();

URL.revokeObjectURL(
url
);

};

window.closeCustomer=function(){

modal.style.display="none";

};

window.viewCustomer=
async function(uid){

const data=
await getCustomerDetails(
uid
);

const pending=
data.orders.filter(
o=>o.status==="pending"
).length;

const approved=
data.orders.filter(
o=>o.status==="approved"
).length;

const shipped=
data.orders.filter(
o=>o.status==="shipped"
).length;

const delivered=
data.orders.filter(
o=>o.status==="delivered"
).length;

const cancelled=
data.orders.filter(
o=>

o.status==="cancelled"

||

o.status==="rejected"

).length;

if(!data){

return;

}

const notes=
await getCustomerNotes(
uid
);

const totalRewardEarned=
data.rewards.reduce(

(total,reward)=>

total+
Number(
reward.points||0
),

0

);

modal.style.display=
"block";

modalContent.innerHTML=`

<label>

Name

</label>

<br>

<input
id="editCustomerName"
value="${data.customer.name||""}"
style="width:100%;">

<br><br>

<label>

Email

</label>

<br>

<input
id="editCustomerEmail"
value="${data.customer.email||""}"
style="width:100%;">

<br><br>

<label>

Reward Points

</label>

<br>

<input
id="editCustomerRewards"
type="number"
value="${data.customer.rewardPoints||0}"
style="width:100%;">

<br><br>

<label>

Role

</label>

<br>

<select
id="editCustomerRole">

<option
value="customer"
${data.customer.role==="customer"?"selected":""}>

Customer

</option>

<option
value="admin"
${data.customer.role==="admin"?"selected":""}>

Admin

</option>

</select>

<br><br>

<button
onclick="saveCustomer('${data.customer.id}')">

Save Customer

</button>

<hr>

<hr>

<h3>

Customer Summary

</h3>

<p>

Customer Lifetime Value :

<b>

₹${data.customer.totalSpend}

</b>

</p>

<p>

Average Order Value :

<b>

₹${data.customer.averageOrder}

</b>

</p>

<p>

Returning Customer :

<b>

${data.customer.totalOrders>1?"Yes":"No"}

</b>

</p>

<div class="activity-item">

<p>

Status :
${data.customer.status||"active"}

</p>

<p>

Role :
${data.customer.role}

</p>

<p>

Last Updated :

${data.customer.updatedAt
?
new Date(data.customer.updatedAt).toLocaleString()
:
"-"}

</p>

<p>

Reward Points :
${data.customer.rewardPoints||0}

</p>

<p>

Orders :
${data.customer.totalOrders}

</p>

<p>

Delivered Orders :

${delivered}

</p>

<p>

Pending Orders :

${data.customer.pendingOrders}

</p>

<p>

Cancelled Orders :

${data.customer.cancelledOrders}

</p>

<p>

Claims :
${data.customer.totalClaims}

</p>

<p>

Lifetime Spend :
₹${data.customer.totalSpend}

</p>

<p>

Average Order :

₹${data.customer.averageOrder}

</p>

<p>

Largest Order :

₹${data.customer.largestOrder}

</p>

<p>

Customer Tier :

<b>

${data.customer.customerTier}

</b>

</p>

<p>

Risk Level :

<b>

${data.customer.customerRisk}

</b>

</p>

<p>

First Order :

${

data.customer.firstOrder

?

new Date(
data.customer.firstOrder
).toLocaleDateString()

:

"Never"

}

</p>

<p>

Last Order :

${
data.orders.length

?

new Date(

data.orders
.slice()
.sort(
(a,b)=>

new Date(b.createdAt)-
new Date(a.createdAt)

)[0].createdAt

).toLocaleString()

:

"Never"

}

</p>

</div>

<hr>

<h3>

Orders
(${data.orders.length})

</h3>

<div class="activity-item">

<p>

Pending :
${pending}

</p>

<p>

Approved :
${approved}

</p>

<p>

Shipped :
${shipped}

</p>

<p>

Delivered :
${delivered}

</p>

<p>

Cancelled :
${cancelled}

</p>

</div>

${
data.orders.length===0

?

"<p>No Orders</p>"

:

data.orders.map(order=>`

<div class="activity-item">

<p>

${order.status}

</p>

<p>

₹${order.total}

</p>

<p>

${order.createdAt}

</p>

</div>

`).join("")
}

<hr>

<h3>

Claims
(${data.claims.length})

</h3>

${
data.claims.length===0

?

"<p>No Claims</p>"

:

data.claims.map(claim=>`

<div class="activity-item">

<p>

${claim.status}

</p>

<p>

${claim.createdAt||"-"}

</p>

</div>

`).join("")
}

<hr>

<h3>

Reward History
(${data.rewards.length})

</h3>

<p>

Total Reward Points Earned :

<b>

${totalRewardEarned}

</b>

</p>

${
data.rewards.length===0

?

"<p>No Reward History</p>"

:

data.rewards.map(reward=>`

<div class="activity-item">

<p>

Points :
${reward.points}

</p>

<p>

Order :
₹${reward.orderTotal||0}

</p>

</div>

`).join("")
}

<hr>

<hr>

<h3>

Activity Timeline

</h3>

${
data.activity.length===0
?

"<p>No Activity Found</p>"

:

data.activity.map(log=>`

<div class="activity-item">

<p>

<b>${log.action}</b>

</p>

<p>

Module :
${log.module}

</p>

<p>

Target :
${log.targetName||"-"}

</p>

<p>

By :
${log.performedBy}

</p>

<p>

${new Date(
log.createdAt
).toLocaleString()}

</p>

</div>

`).join("")
}

<hr>

<hr>

<h3>

Login History

</h3>

<div class="activity-item">

Future Ready

</div>

<h3>

Admin Notes

</h3>

<textarea

id="customerNote"

style="width:100%;height:90px;">

</textarea>

<br><br>

<button
onclick="saveCustomerNote('${uid}')">

Add Note

</button>

<br><br>

${

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

<b>

${note.admin||"Admin"}

</b>

</p>

<p>

${new Date(
note.createdAt
).toLocaleString()}

</p>

<button
onclick="removeCustomerNote('${note.id}','${uid}')">

Delete

</button>

</div>

`).join("")

}

`;

};

window.disableCustomer=
async function(id){

if(
!confirm(
"Disable customer?"
)
){
return;
}

await updateCustomerStatus(
id,
"disabled"
);

load();

};

window.enableCustomer=
async function(id){

if(
!confirm(
"Enable customer?"
)
){
return;
}

await updateCustomerStatus(
id,
"active"
);

load();

};

window.removeCustomer=
async function(id){

if(
!confirm(
"Delete customer?"
)
){
return;
}

await deleteCustomer(
id
);

load();

};

window.saveCustomer=
async function(id){

await updateCustomer(

id,

{

name:
document.getElementById(
"editCustomerName"
).value,

email:
document.getElementById(
"editCustomerEmail"
).value,

rewardPoints:
Number(
document.getElementById(
"editCustomerRewards"
).value
),

role:
document.getElementById(
"editCustomerRole"
).value

}

);

await updateCustomerRole(

id,

document.getElementById(
"editCustomerRole"
).value

);

alert(
"Customer Updated"
);

modal.style.display=
"none";

await load();

};

window.saveCustomerNote=
async function(uid){

const textarea=
document.getElementById(
"customerNote"
);

const note=
textarea.value.trim();

if(
!note
){

alert(
"Enter a note."
);

return;

}

await addCustomerNote(

uid,
note,
"Administrator"

);

textarea.value="";

await viewCustomer(
uid
);

};

window.removeCustomerNote=
async function(
id,
uid
){

if(
!confirm(
"Delete note?"
)
){

return;

}

await deleteCustomerNote(
id
);

await viewCustomer(
uid
);

};