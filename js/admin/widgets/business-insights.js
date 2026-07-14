export function businessInsightsWidget(data){

return `

<h2>

Business Insights

</h2>

<br>

<div class="activity-item">

<p>

Best Sales Day

</p>

<h3>

${data.bestDay}

</h3>

</div>

<div class="activity-item">

<p>

Best Month

</p>

<h3>

${data.bestMonth}

</h3>

</div>

<div class="activity-item">

<p>

Stock Turnover

</p>

<h3>

${data.stockTurnover}%

</h3>

</div>

<div class="activity-item">

<p>

Average Lifetime Value

</p>

<h3>

${data.currency}${data.averageLifetimeValue}

</h3>

</div>

<div class="activity-item">

<p>

Returning Customers

</p>

<h3>

${data.returningCustomers}

</h3>

</div>

<div class="activity-item">

<p>

New Customers

</p>

<h3>

${data.newCustomers}

</h3>

</div>

<div class="activity-item">

<p>

Claim Rate

</p>

<h3>

${data.claimRate}%

</h3>

</div>

`;

}