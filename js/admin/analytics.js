import{

getAnalytics

}
from "../services/analytics.js";

import{

revenueChart

}
from "./widgets/revenue-chart.js";

import{

salesChart

}
from "./widgets/sales-chart.js";

import{

topproductsChart

}
from "./widgets/top-products-chart.js";

import{

categoryChart

}
from "./widgets/category-chart.js";

const charts=

document.getElementById(
"charts"
);

async function load(){

const analytics=

await getAnalytics();

document.getElementById(
"totalRevenue"
).textContent=

`₹${analytics.revenue}`;

document.getElementById(
"totalOrders"
).textContent=

analytics.orders.length;

document.getElementById(
"productsSold"
).textContent=

analytics.productsSold;

document.getElementById(
"averageOrder"
).textContent=

`₹${analytics.averageOrder}`;

charts.innerHTML=

revenueChart()

+

salesChart()

+

topproductsChart()

+

categoryChart();

const sorted=

[...analytics.products]

.sort(

(a,b)=>

(b.stock||0)

-

(a.stock||0)

)

.slice(0,10);

document.getElementById(
"topProducts"
).innerHTML=

sorted.map(product=>`

<div class="activity-item">

<b>

${product.name}

</b>

<br>

Stock :

${product.stock}

<br>

₹${product.price}

</div>

`).join("");

}

load();