import {
buildChart,
calculatePercentages
}
from "../../components/chart.js";

export function salesChart(
dailySales = {},
currency = "₹"
){

const rows =
Object.entries(dailySales)
.sort()
.slice(-10)
.map(([day, value])=>({
label:day,
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
"Daily Sales",
chartRows
);

}