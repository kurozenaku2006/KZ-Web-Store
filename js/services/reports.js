export function getReportSchedule(){

return localStorage.getItem(
"reportSchedule"
)||"disabled";

}

export function saveReportSchedule(
value
){

localStorage.setItem(
"reportSchedule",
value
);

}

export function generateReportSummary(
analytics
){

return `

<div class="activity-item">

<b>Total Revenue</b>

<br>

₹${analytics.revenue}

</div>

<div class="activity-item">

<b>Total Orders</b>

<br>

${analytics.orders.length}

</div>

<div class="activity-item">

<b>Products Sold</b>

<br>

${analytics.productsSold}

</div>

<div class="activity-item">

<b>Average Order</b>

<br>

₹${analytics.averageOrder}

</div>

<div class="activity-item">

<b>Customers</b>

<br>

${analytics.users?.length||0}

</div>

<div class="activity-item">

<b>New Customers</b>

<br>

${analytics.newCustomers}

</div>

<div class="activity-item">

<b>Returning Customers</b>

<br>

${analytics.returningCustomers}

</div>

`;

}

export function exportAnalyticsCsv(
analytics
){

let csv=

`Metric,Value
Revenue,${analytics.revenue}
Orders,${analytics.orders.length}
Products Sold,${analytics.productsSold}
Average Order,${analytics.averageOrder}
Customers,${analytics.users?.length||0}
New Customers,${analytics.newCustomers}
Returning Customers,${analytics.returningCustomers}
Average Lifetime Value,${analytics.averageLifetimeValue}
Reward Usage,${analytics.rewardUsage}
Claim Rate,${analytics.claimRate}
`;

const blob=
new Blob(
[csv],
{
type:
"text/csv"
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
"analytics-report.csv";

a.click();

URL.revokeObjectURL(
url
);

}