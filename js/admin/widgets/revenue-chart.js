import {
buildChart,
calculatePercentages
}
from "../../components/chart.js";

export function revenueChart(
monthlyRevenue = {},
currency = "₹"
){

const rows =
Object.entries(monthlyRevenue)
.sort()
.slice(-12)
.map(([month, value])=>({
label:month,
value:`${currency}${Math.round(value)}`,
raw:Number(value)
}));

const chartRows =
calculatePercentages(
rows.map(row=>({
label:row.label,
value:row.raw
}))
).map((row,index)=>({
label:row.label,
value:rows[index].value,
percent:row.percent
}));

return buildChart(
"Revenue Trend",
chartRows
);

}