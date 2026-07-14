export function buildChart(
title,
rows=[],
footer=""
){

return`

<div class="chart-box">

<h2>

${title}

</h2>

<br>

<div class="chart-list">

${rows.map(row=>`

<div class="chart-row">

<div class="chart-label">

${row.label}

</div>

<div class="chart-bar">

<div
class="chart-fill"
style="width:${Math.min(100,row.percent)}%">

</div>

</div>

<div class="chart-value">

${row.value}

</div>

</div>

`).join("")}

</div>

${footer}

</div>

`;

}

export function calculatePercentages(data=[]){

const highest=Math.max(

1,

...data.map(item=>Number(item.value)||0)

);

return data.map(item=>({

...item,

percent:

Math.round(

(Number(item.value)||0)

/

highest

*

100

)

}));

}

export function buildSimpleStats(title,stats={}){

return`

<div class="chart-box">

<h2>

${title}

</h2>

<br>

${Object.entries(stats).map(([k,v])=>`

<div class="activity-item">

<p>

${k}

</p>

<h3>

${v}

</h3>

</div>

`).join("")}

</div>

`;

}