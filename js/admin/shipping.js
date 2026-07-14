import{

getShippingOrders,
updateShipping

}
from "../services/shipping.js";

const container=
document.getElementById(
"shippingContainer"
);

async function load(){

const orders=
await getShippingOrders();

container.innerHTML=

orders.map(order=>`

<div class="card">

<h3>

Order #${order.id}

</h3>

<p>

${order.customerName||"-"}

</p>

<p>

Current :
${order.status}

</p>

<input

id="courier-${order.id}"

placeholder="Courier"

value="${order.courier||""}">

<br><br>

<input

id="tracking-${order.id}"

placeholder="Tracking Number"

value="${order.trackingNumber||""}">

<br><br>

<input

id="delivery-${order.id}"

type="date"

value="${order.estimatedDelivery||""}">

<br><br>

<select
id="status-${order.id}">

<option
value="approved">

Approved

</option>

<option
value="packed">

Packed

</option>

<option
value="shipped">

Shipped

</option>

<option
value="out_for_delivery">

Out For Delivery

</option>

<option
value="delivered">

Delivered

</option>

</select>

<br><br>

<button
onclick="saveShipping('${order.id}')">

Save

</button>

</div>

<br>

`).join("");

orders.forEach(order=>{

document.getElementById(
`status-${order.id}`
).value=
order.status;

});

}

window.saveShipping=
async id=>{

await updateShipping(
id,
{

courier:
document.getElementById(
`courier-${id}`
).value,

trackingNumber:
document.getElementById(
`tracking-${id}`
).value,

estimatedDelivery:
document.getElementById(
`delivery-${id}`
).value,

status:
document.getElementById(
`status-${id}`
).value

}
);

load();

};

load();