import {

addCoupon,

getCoupons,

updateCoupon,

deleteCoupon

}
from "../services/coupons.js";

const list =
document.getElementById(
"couponList"
);

const addBtn =
document.getElementById(
"addBtn"
);

async function load(){

const coupons =
await getCoupons();

list.innerHTML="";

coupons.forEach(coupon=>{

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
${coupon.used || 0}
/
${coupon.limit}

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
        used:0,
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

load();

};

load();