import {
    collection,
    getDocs
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    db
}
from "../config/firebase.js";

import {
    getStoreSettings
}
from "../services/settings.js";

import {
getAnalytics
}
from "../services/analytics.js";

import {
revenueChart as buildRevenueChart
}
from "./widgets/revenue-chart.js";

import {
salesChart as buildSalesChart
}
from "./widgets/sales-chart.js";

import {
topProductsChart
}
from "./widgets/top-products-chart.js";

import {
categoryChart
}
from "./widgets/category-chart.js";

const cards =
document.getElementById(
"cards"
);

const rewardActivityBox =
document.getElementById(
"rewardActivity"
);

const recentOrdersBox =
document.getElementById(
"recentOrders"
);

const lowStockBox =
document.getElementById(
"lowStockProducts"
);

const insightsBox =
document.getElementById(
"dashboardInsights"
);

const revenueChart =
document.getElementById(
"dashboardRevenueChart"
);

const salesChart =
document.getElementById(
"dashboardSalesChart"
);

const customerChart =
document.getElementById(
"customerChart"
);

const claimsChart =
document.getElementById(
"claimsChart"
);

const rewardChart =
document.getElementById(
"rewardChart"
);

const notificationChart =
document.getElementById(
"notificationChart"
);

const activityChart =
document.getElementById(
"activityChart"
);

const orderStatusChart =
document.getElementById(
"orderStatusChart"
);

async function loadDashboard(){

    const settings =
await getStoreSettings();

const analytics =
await getAnalytics();

const currency =
settings.currency || "₹";

const{

dashboardCards,

monthlyRevenue,

dailySales,

productRanking,

categorySales,

bestDay,

bestMonth,

stockTurnover,

newCustomers,

returningCustomers,

averageLifetimeValue,

claimRate,

rewardUsage,

orderStatus,

claimStatus,

rewardStats,

customerStats,

highestOrder,

lowestOrder

}=analytics;

const lowStockLimit =
Number(settings.lowStock || 5);

const{

products,

users,

orders,

claims,

rewardHistory,

notifications,

activity

}=analytics.collections;

const latestActivity =

activity

.slice()

.sort(

(a,b)=>

new Date(b.createdAt)-

new Date(a.createdAt)

)

.slice(0,10);

const totalNotifications =
notifications.length;

const archivedNotifications =
notifications.filter(
item=>item.archived
).length;

const scheduledNotifications =
notifications.filter(
item=>item.scheduleAt
).length;

const unreadNotifications =
notifications.filter(
item=>!item.read
).length;

let totalRewardIssued = 0;

rewardHistory.forEach(
    reward => {

        totalRewardIssued +=
        Number(
            reward.points || 0
        );

    }
);

    cards.innerHTML=`

<div class="card">

<h3>

Revenue

</h3>

<div class="card-value">

${currency}${dashboardCards.revenue}

</div>

</div>

<div class="card">

<h3>

Orders

</h3>

<div class="card-value">

${dashboardCards.orders}

</div>

</div>

<div class="card">

<h3>

Customers

</h3>

<div class="card-value">

${dashboardCards.customers}

</div>

</div>

<div class="card">

<h3>

Claims

</h3>

<div class="card-value">

${dashboardCards.claims}

</div>

</div>

<div class="card">

<h3>

Products Sold

</h3>

<div class="card-value">

${dashboardCards.productsSold}

</div>

</div>

<div class="card">

<h3>

Average Order

</h3>

<div class="card-value">

${currency}${dashboardCards.averageOrder}

</div>

</div>

`;

    const recentOrders =
orders.slice(-5).reverse();

recentOrdersBox.innerHTML = `

<h2>
Recent Orders
</h2>

<br>

${
recentOrders.length === 0
? "<p>No Orders Found</p>"
: recentOrders.map(order => `

<div class="activity-item">

    <p>
        Status:
        ${order.status}
    </p>

    <p>
        Total:
        ${currency}${order.total}
    </p>

    <p>
        ${order.createdAt}
    </p>

</div>

`).join("")
}

`;

const lowStockProducts =
products.filter(
product =>
product.stock <= lowStockLimit
);

lowStockBox.innerHTML = `

<h2>
Low Stock Products
</h2>

<br>

${
lowStockProducts.length === 0
? "<p>No Low Stock Products</p>"
: lowStockProducts.map(product => `

<div class="activity-item">

    <p>
        ${product.name}
    </p>

    <p>
        Stock:
${product.stock}

<small>
Alert:
${lowStockLimit}
</small>
    </p>

</div>

`).join("")
}

`;

const recentRewards =
rewardHistory
.slice(-10)
.reverse();

rewardActivityBox.innerHTML = `

<h2>
Recent Reward Activity
</h2>

<br>

${
recentRewards.length === 0
? "<p>No Reward Activity</p>"
: recentRewards.map(reward => `

<div class="activity-item">

    <p>
        Points:
        ${reward.points}
    </p>

    <p>
        Order Total:
        ${currency}${reward.orderTotal}
    </p>

</div>

`).join("")
}

`;

revenueChart.innerHTML =
buildRevenueChart(
analytics.monthlyRevenue,
currency
);

salesChart.innerHTML =
buildSalesChart(
analytics.dailySales,
currency
);

insightsBox.innerHTML=`

<h2>

Business Insights

</h2>

<br>

<div class="activity-item">

<p>

Best Sales Day

</p>

<h3>

${bestDay}

</h3>

</div>

<div class="activity-item">

<p>

Best Month

</p>

<h3>

${bestMonth}

</h3>

</div>

<div class="activity-item">

<p>

Stock Turnover

</p>

<h3>

${stockTurnover}%

</h3>

</div>

<div class="activity-item">

<p>

Average Lifetime Value

</p>

<h3>

${currency}${averageLifetimeValue}

</h3>

</div>

<div class="activity-item">

<p>

Returning Customers

</p>

<h3>

${returningCustomers}

</h3>

</div>

<div class="activity-item">

<p>

New Customers

</p>

<h3>

${newCustomers}

</h3>

</div>

<div class="activity-item">

<p>

Claim Rate

</p>

<h3>

${claimRate}%

</h3>

</div>

`;

customerChart.innerHTML =
topProductsChart(
analytics.productRanking
);

claimsChart.innerHTML =
categoryChart(
analytics.categorySales
);

rewardChart.innerHTML=`

<h2>

Reward Analytics

</h2>

<br>

<div class="activity-item">

<p>

Reward Balance

</p>

<h3>

${rewardUsage}

</h3>

</div>

<div class="activity-item">

<p>

Top Holder

</p>

<h3>

${rewardStats.topRewardPoints}

</h3>

<small>

${rewardStats.topRewardUid}

</small>

</div>

`;

notificationChart.innerHTML=`

<h2>

Notification Analytics

</h2>

<br>

<div class="activity-item">

<p>

Total

</p>

<h3>

${totalNotifications}

</h3>

</div>

<div class="activity-item">

<p>

Unread

</p>

<h3>

${unreadNotifications}

</h3>

</div>

<div class="activity-item">

<p>

Scheduled

</p>

<h3>

${scheduledNotifications}

</h3>

</div>

<div class="activity-item">

<p>

Archived

</p>

<h3>

${archivedNotifications}

</h3>

</div>

`;
activityChart.innerHTML=`

<h2>

Recent Activity

</h2>

<br>

${

latestActivity.length===0

?

"<p>No Activity</p>"

:

latestActivity.map(log=>`

<div class="activity-item">

<p>

${log.action||"-"}

</p>

<small>

${log.module||"-"}

</small>

</div>

`).join("")

}

`;

orderStatusChart.innerHTML=`

<h2>

Order Status Analytics

</h2>

<br>

<div class="activity-item">

<p>

Pending

</p>

<h3>

${orderStatus.pending}

</h3>

</div>

<div class="activity-item">

<p>

Approved

</p>

<h3>

${orderStatus.approved}

</h3>

</div>

<div class="activity-item">

<p>

Shipped

</p>

<h3>

${orderStatus.shipped}

</h3>

</div>

<div class="activity-item">

<p>

Delivered

</p>

<h3>

${orderStatus.delivered}

</h3>

</div>

<div class="activity-item">

<p>

Cancelled

</p>

<h3>

${orderStatus.cancelled}

</h3>

</div>

`;

}

loadDashboard();

setInterval(

()=>{

loadDashboard();

},

60000

);

