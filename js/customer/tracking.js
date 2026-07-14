import{

getCustomerTracking

}
from "../services/shipping.js";

import{
requireMaintenanceOff
}
from "../services/guard.js";

const container=
document.getElementById(
"trackingContainer"
);

async function load(){

        await requireMaintenanceOff();


const orders=
await getCustomerTracking();

container.innerHTML=

orders.length===0

?

"<p>No Orders Found</p>"

:

orders.map(order=>`

<div class="card">

<h3>

Order #${order.id}

</h3>

<p>

Status :
${order.status}

</p>

<p>

Courier :
${order.courier||"-"}

</p>

<p>

Tracking :
${order.trackingNumber||"-"}

</p>

<p>

Estimated Delivery :
${order.estimatedDelivery||"-"}

</p>

<div>

${renderTimeline(order.status)}

</div>

</div>

<br>

`).join("");

}

function renderTimeline(status){

const steps=[
"approved",
"packed",
"shipped",
"out_for_delivery",
"delivered"
];

let html="";

steps.forEach(step=>{

const active=
steps.indexOf(step)<=
steps.indexOf(status);

html+=`

<div>

${active?"✅":"⬜"}

${step.replaceAll("_"," ")}

</div>

`;

});

return html;

}

load();