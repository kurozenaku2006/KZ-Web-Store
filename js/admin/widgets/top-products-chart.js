import{

buildChart,
calculatePercentages

}
from "../../components/chart.js";

export function topProductsChart(

products=[]

){

const top=

products

.slice(0,10)

.map(item=>({

label:item.name,

value:item.quantity

}));

const rows=

calculatePercentages(top)

.map(item=>({

label:item.label,

value:item.value,

percent:item.percent

}));

return buildChart(

"Top Selling Products",

rows

);

}