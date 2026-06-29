import{
getCustomers
}
from "../services/customers.js";

let customers=[];

const container=
document.getElementById(
"customersContainer"
);

const search=
document.getElementById(
"customerSearch"
);

async function load(){

customers=
await getCustomers();

render();

}

function render(){

const keyword=
search.value
.toLowerCase();

const data=
customers.filter(customer=>

(customer.name||"")
.toLowerCase()
.includes(keyword)

||

(customer.email||"")
.toLowerCase()
.includes(keyword)

);

container.innerHTML=

data.length===0

?

"<p>No Customers</p>"

:

data.map(customer=>`

<div class="card">

<h3>

${customer.name}

</h3>

<p>

${customer.email}

</p>

<p>

Reward Points :
${customer.rewardPoints||0}

</p>

<p>

Orders :
${customer.totalOrders}

</p>

<p>

Claims :
${customer.totalClaims}

</p>

<p>

Spent :
₹${customer.totalSpend}

</p>

</div>

<br>

`).join("");

}

search.oninput=
render;

load();