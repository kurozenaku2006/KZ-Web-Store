import {

addCoupon,

getCoupons,

updateCoupon,

deleteCoupon,

getCouponStatistics

}
from "../services/coupons.js";

const list =
document.getElementById(
"couponList"
);

const stats =
document.getElementById(
"couponStats"
);

const addBtn =
document.getElementById(
"addBtn"
);

const search =
document.getElementById(
"couponSearch"
);

const statusFilter =
document.getElementById(
"couponStatus"
);

let coupons = [];

async function load(){

coupons =
await getCoupons();

let data =
[...coupons];

const keyword =
search.value
.toLowerCase();

if(keyword){

data =
data.filter(coupon=>

coupon.code
.toLowerCase()
.includes(keyword)

);

}

if(
statusFilter.value!=="all"
){

data =
data.filter(
coupon=>

coupon.status===statusFilter.value

);

}

const analytics =
await getCouponStatistics();

stats.innerHTML=`

<div class="card">

<h3>Total</h3>

<div class="card-value">

${analytics.total}

</div>

</div>

<div class="card">

<h3>Active</h3>

<div class="card-value">

${analytics.active}

</div>

</div>

<div class="card">

<h3>Expired</h3>

<div class="card-value">

${analytics.expired}

</div>

</div>

<div class="card">

<h3>Total Uses</h3>

<div class="card-value">

${analytics.totalUses}

</div>

</div>

`;

list.innerHTML="";

renderStats(data);

list.innerHTML="";

data.forEach(coupon=>{

list.innerHTML+=`

<div class="card">

<h3>

${coupon.code}

</h3>

<p>

Discount :
${coupon.discount}%

</p>

<p>

Usage :
${coupon.usedCount||0}
/
${coupon.limit}

</p>

<p>

Remaining :
${Math.max(
0,
Number(coupon.limit||0)-
Number(coupon.usedCount||0)
)}

</p>

<p>

Expiry :
${coupon.expiry||"Never"}

</p>

<p>

Restriction :
${coupon.allowedCustomer||"Everyone"}

</p>

<p>

Status :
${coupon.status}

</p>

<button
onclick="toggleCoupon('${coupon.id}','${coupon.status}')">

Toggle

</button>

<button
onclick="removeCoupon('${coupon.id}')">

Delete

</button>

</div>

`;

});

}

function renderStats(data){

const active =
data.filter(
c=>c.status==="active"
).length;

const inactive =
data.filter(
c=>c.status==="inactive"
).length;

const expired =
data.filter(c=>

c.expiry &&

new Date(c.expiry)<new Date()

).length;

const uses =
data.reduce(

(total,c)=>

total+
Number(
c.usedCount||0
),

0

);

stats.innerHTML=`

<div class="card">

<h3>Total</h3>

<div class="card-value">

${data.length}

</div>

</div>

<div class="card">

<h3>Active</h3>

<div class="card-value">

${active}

</div>

</div>

<div class="card">

<h3>Inactive</h3>

<div class="card-value">

${inactive}

</div>

</div>

<div class="card">

<h3>Expired</h3>

<div class="card-value">

${expired}

</div>

</div>

<div class="card">

<h3>Total Uses</h3>

<div class="card-value">

${uses}

</div>

</div>

`;

stats.innerHTML+=`

<div class="card">

<h3>

Most Used Coupons

</h3>

${data
.slice()
.sort(
(a,b)=>

Number(b.usedCount||0)-

Number(a.usedCount||0)

)
.slice(0,5)
.map(c=>`

<p>

${c.code}

—

${c.usedCount||0}

uses

</p>

`)
.join("")}

</div>

`;

}

window.toggleCoupon=
async function(
id,
status
){

await updateCoupon(
id,
{
status:
status==="active"
?
"inactive"
:
"active"
}
);

load();

};

window.removeCoupon=
async function(id){

if(
!confirm(
"Delete coupon?"
)
)return;

await deleteCoupon(
id
);

load();

};

addBtn.onclick=
async()=>{

const code=
document
.getElementById(
"code"
).value
.trim()
.toUpperCase();

const discount=
Number(
document
.getElementById(
"discount"
).value
);

const limit=
Number(
document
.getElementById(
"limit"
).value
);

if(
!code||
!discount||
!limit
){

alert(
"Complete all fields."
);

return;

}

try{

    await addCoupon({

code,

discount,

limit,

usedCount:0,

expiry:
document.getElementById(
"expiry"
).value,

maxPerCustomer:
Number(
document.getElementById(
"maxPerCustomer"
).value||0
),

allowedCustomer:
document.getElementById(
"allowedCustomer"
).value.trim(),

allowedEmail:
document.getElementById(
"allowedEmail"
).value.trim()
.toLowerCase(),

oneTimeUse:
document.getElementById(
"oneTimeUse"
).checked,

status:"active"

});

}
catch(error){

    alert(
        error.message
    );

    return;

}

document
.getElementById(
"code"
).value="";

document
.getElementById(
"discount"
).value="";

document
.getElementById(
"limit"
).value="";

document
.getElementById(
"expiry"
).value="";

document
.getElementById(
"maxPerCustomer"
).value="";

document
.getElementById(
"allowedCustomer"
).value="";

document
.getElementById(
"allowedEmail"
).value="";

document
.getElementById(
"oneTimeUse"
).checked=false;

load();

};

search.oninput=
load;

statusFilter.onchange=
load;

load();

setInterval(

load,

30000

);

window.exportCoupons=function(){

const csv=[

"Code,Discount,Status,Limit,Used,Remaining,Expiry"

];

coupons.forEach(c=>{

csv.push(

`"${c.code}",${c.discount},"${c.status}",${c.limit},${c.usedCount||0},${Math.max(0,(c.limit||0)-(c.usedCount||0))},"${c.expiry||""}"`

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

a.download="coupons.csv";

a.click();

URL.revokeObjectURL(url);

};