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

import {
    topProductsChart
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

renderMonthlyRevenue(
analytics.monthlyRevenue
);

renderCategoryData(
analytics.categorySales
);

renderSalesAnalytics(
analytics
);

renderProductAnalytics(
analytics
);

renderCustomerAnalytics(
analytics
);

charts.innerHTML=

revenueChart()

+

salesChart()

+

topProductsChart()

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

function renderMonthlyRevenue(
data
){

const container =
document.getElementById(
"monthlyRevenue"
);

if(!container){

return;
}

container.innerHTML =

Object.entries(data)
.map(
([month,value])=>

`<div class="activity-item">

<b>${month}</b>

<br>

₹${value}

</div>`
)
.join("");

}

function renderCategoryData(
data
){

const container =
document.getElementById(
"categoryAnalytics"
);

if(!container){

return;
}

container.innerHTML =

Object.entries(data)
.map(
([category,value])=>

`<div class="activity-item">

<b>${category}</b>

<br>

${value} Products

</div>`
)
.join("");

}

function renderSalesAnalytics(
analytics
){

const container =
document.getElementById(
"salesAnalytics"
);

if(!container){

return;

}

container.innerHTML=`

<div class="activity-item">

<b>

Best Day

</b>

<br>

${analytics.bestDay}

<br>

₹${analytics.bestDaySales}

</div>

<div class="activity-item">

<b>

Best Month

</b>

<br>

${analytics.bestMonth}

<br>

₹${analytics.bestMonthSales}

</div>

<div class="activity-item">

<b>

Daily Records

</b>

<br>

${Object.keys(
analytics.dailySales
).length}

</div>

<div class="activity-item">

<b>

Weekly Records

</b>

<br>

${Object.keys(
analytics.weeklySales
).length}

</div>

<div class="activity-item">

<b>

Yearly Records

</b>

<br>

${Object.keys(
analytics.yearlySales
).length}

</div>

`;

}

function renderProductAnalytics(
analytics
){

const container=
document.getElementById(
"productAnalytics"
);

if(!container){

return;

}

container.innerHTML=`

<div class="activity-item">

<b>

Best Seller

</b>

<br>

${analytics.bestSellingProduct?.name||"-"}

<br>

${analytics.bestSellingProduct?.quantity||0}

 Sold

</div>

<div class="activity-item">

<b>

Lowest Seller

</b>

<br>

${analytics.worstSellingProduct?.name||"-"}

<br>

${analytics.worstSellingProduct?.quantity||0}

 Sold

</div>

<div class="activity-item">

<b>

Stock Turnover

</b>

<br>

${analytics.stockTurnover}%

</div>

<div class="activity-item">

<b>

Tracked Products

</b>

<br>

${analytics.productRanking.length}

</div>

`;

}

function renderCustomerAnalytics(
analytics
){

const container=
document.getElementById(
"customerAnalytics"
);

if(!container){

return;

}

container.innerHTML=`

<div class="activity-item">

<b>

New Customers

</b>

<br>

${analytics.newCustomers}

</div>

<div class="activity-item">

<b>

Returning Customers

</b>

<br>

${analytics.returningCustomers}

</div>

<div class="activity-item">

<b>

Average Lifetime Value

</b>

<br>

₹${analytics.averageLifetimeValue}

</div>

<div class="activity-item">

<b>

Average Order Value

</b>

<br>

₹${analytics.averageOrder}

</div>

<div class="activity-item">

<b>

Reward Usage

</b>

<br>

${analytics.rewardUsage}

 Points

</div>

<div class="activity-item">

<b>

Claim Rate

</b>

<br>

${analytics.claimRate}%

</div>

`;

}

load();