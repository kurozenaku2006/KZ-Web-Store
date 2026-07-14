import{

buildChart,
calculatePercentages

}
from "../../components/chart.js";

export function categoryChart(

categories={}

){

const rows=

calculatePercentages(

Object.entries(categories).map(

([name,data])=>({

label:name,

value:data.revenue

})

)

);

return buildChart(

"Category Revenue",

rows.map(item=>({

label:item.label,

value:`₹${Math.round(item.value)}`,

percent:item.percent

}))

);

}