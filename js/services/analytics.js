import{
collection,
getDocs
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import{
db
}
from "../config/firebase.js";

import {
getStoreSettings
}
from "./settings.js";

export async function getAnalytics(){

const productsSnapshot=
await getDocs(
collection(
db,
"products"
)
);

const ordersSnapshot=
await getDocs(
collection(
db,
"orders"
)
);

const usersSnapshot=
await getDocs(
collection(
db,
"users"
)
);

const claimsSnapshot=
await getDocs(
collection(
db,
"claims"
)
);

const rewardHistorySnapshot =
await getDocs(
collection(
db,
"rewardHistory"
)
);

const notificationsSnapshot =
await getDocs(
collection(
db,
"notifications"
)
);

const activitySnapshot =
await getDocs(
collection(
db,
"activity"
)
);

const products=
productsSnapshot.docs.map(
doc=>({
id:doc.id,
...doc.data()
})
);

const orders=
ordersSnapshot.docs.map(
doc=>({
id:doc.id,
...doc.data()
})
);

const users=
usersSnapshot.docs.map(
doc=>({
id:doc.id,
...doc.data()
})
);

const claims=
claimsSnapshot.docs.map(
doc=>({
id:doc.id,
...doc.data()
})
);

const rewardHistory =
rewardHistorySnapshot.docs.map(
doc=>({
id:doc.id,
...doc.data()
})
);

const notifications =
notificationsSnapshot.docs.map(
doc=>({
id:doc.id,
...doc.data()
})
);

const activity =
activitySnapshot.docs.map(
doc=>({
id:doc.id,
...doc.data()
})
);

let revenue=0;

let productsSold=0;

orders.forEach(order=>{

revenue+=
Number(
order.total||0
);

(order.items||[]).forEach(item=>{

productsSold+=
Number(
item.quantity||0
);

});

});

const averageOrder=

orders.length===0

?0

:

Math.round(
revenue/
orders.length
);

const monthlyRevenue = {};

orders.forEach(order=>{

if(
order.status==="approved" ||
order.status==="shipped" ||
order.status==="delivered"
){

const date =
new Date(
order.createdAt
);

const month =
`${date.getFullYear()}-${String(
date.getMonth()+1
).padStart(2,"0")}`;

monthlyRevenue[month] ??= 0;

monthlyRevenue[month] +=
Number(
order.total || 0
);

}

});

const dailySales = {};

const weeklySales = {};

const yearlySales = {};

orders.forEach(order=>{

if(
order.status==="approved"||
order.status==="shipped"||
order.status==="delivered"
){

const date =
new Date(order.createdAt);

const day =
date.toISOString().split("T")[0];

dailySales[day] ??= 0;

dailySales[day] +=
Number(order.total||0);

const week =
`${date.getFullYear()}-W${Math.ceil(date.getDate()/7)}`;

weeklySales[week] ??= 0;

weeklySales[week] +=
Number(order.total||0);

const year =
String(
date.getFullYear()
);

yearlySales[year] ??= 0;

yearlySales[year] +=
Number(order.total||0);

}

});

const productPerformance={};

orders.forEach(order=>{

(order.items||[]).forEach(item=>{

const id=
item.productId||
item.id||
item.name;

if(!productPerformance[id]){

productPerformance[id]={

name:item.name,

quantity:0,

revenue:0

};

}

productPerformance[id].quantity+=
Number(
item.quantity||0
);

productPerformance[id].revenue+=
Number(
item.price||0
)*
Number(
item.quantity||0
);

});

});

const rankedProducts=

Object.values(
productPerformance
)

.sort(
(a,b)=>

b.quantity-
a.quantity
);

const revenuePerProduct = {};

Object.values(
productPerformance
).forEach(product=>{

revenuePerProduct[
product.name
] =
product.revenue;

});

const productCategoryMap = {};

products.forEach(product=>{

productCategoryMap[
product.id
] =
product.category ||
"Other";

});

const categorySales = {};

orders.forEach(order=>{

(order.items||[]).forEach(item=>{

const category =

productCategoryMap[
item.productId
] ||

"Other";

categorySales[
category
] ??= {

revenue:0,
quantity:0

};

categorySales[
category
].revenue +=
Number(item.price||0)
*
Number(item.quantity||0);

categorySales[
category
].quantity +=
Number(item.quantity||0);

});

});

let bestDay="-";

let bestDaySales=0;

Object.entries(
dailySales
).forEach(
([day,value])=>{

if(value>bestDaySales){

bestDaySales=value;

bestDay=day;

}

});

let totalStock=0;

products.forEach(product=>{

totalStock+=
Number(
product.stock||0
);

});

const stockTurnover=

productsSold===0

?

0

:

Math.round(

productsSold/

Math.max(
1,
totalStock
)

*100

);

let bestMonth="-";

let bestMonthSales=0;

Object.entries(
monthlyRevenue
).forEach(
([month,value])=>{

if(value>bestMonthSales){

bestMonthSales=value;

bestMonth=month;

}

});

const customerOrders={};

orders.forEach(order=>{

const uid=
order.uid;

if(!uid){

return;

}

customerOrders[uid] ??= {

orders:0,
spend:0

};

customerOrders[uid].orders++;

customerOrders[uid].spend+=
Number(
order.total||0
);

});

const newCustomers=
Object.values(
customerOrders
).filter(
customer=>
customer.orders===1
).length;

const returningCustomers=
Object.values(
customerOrders
).filter(
customer=>
customer.orders>1
).length;

let totalSpend=0;

Object.values(
customerOrders
).forEach(customer=>{

totalSpend+=
customer.spend;

});

const averageLifetimeValue=

Object.keys(
customerOrders
).length===0

?

0

:

Math.round(

totalSpend/

Object.keys(
customerOrders
).length

);

const orderStatus={

pending:0,
approved:0,
shipped:0,
delivered:0,
cancelled:0

};

orders.forEach(order=>{

switch(order.status){

case "pending":
orderStatus.pending++;
break;

case "approved":
orderStatus.approved++;
break;

case "shipped":
orderStatus.shipped++;
break;

case "delivered":
orderStatus.delivered++;
break;

case "cancelled":
orderStatus.cancelled++;
break;

}

});

const claimStatus={

pending:0,
approved:0,
rejected:0

};

claims.forEach(claim=>{

if(claim.status==="pending")
claimStatus.pending++;

if(claim.status==="approved")
claimStatus.approved++;

if(claim.status==="rejected")
claimStatus.rejected++;

});

const totals=

orders.map(
order=>
Number(order.total||0)
);

const highestOrder=

totals.length

?

Math.max(...totals)

:

0;

const lowestOrder=

totals.length

?

Math.min(...totals)

:

0;

let bronzeMembers=0;
let silverMembers=0;
let goldMembers=0;
let platinumMembers=0;

let topRewardPoints=0;
let topRewardUid="-";

users.forEach(user=>{

const points=
Number(
user.rewardPoints||0
);

if(points>=1000){

platinumMembers++;

}

else if(points>=500){

goldMembers++;

}

else if(points>=100){

silverMembers++;

}

else{

bronzeMembers++;

}

if(points>topRewardPoints){

topRewardPoints=points;

topRewardUid=
user.uid||"-";

}

});

const customerStatsMap={};

orders.forEach(order=>{

if(!customerStatsMap[order.uid]){

customerStatsMap[order.uid]={

orders:0,
spend:0

};

}

customerStatsMap[order.uid].orders++;

customerStatsMap[order.uid].spend+=
Number(order.total||0);

});

let topCustomerSpend=0;
let topCustomerUid="-";

let mostActiveOrders=0;
let mostActiveUid="-";

Object.entries(
customerStatsMap
).forEach(([uid,data])=>{

if(data.spend>
topCustomerSpend){

topCustomerSpend=
data.spend;

topCustomerUid=
uid;

}

if(data.orders>
mostActiveOrders){

mostActiveOrders=
data.orders;

mostActiveUid=
uid;

}

});

let rewardUsage = 0;

users.forEach(user=>{

rewardUsage +=
Number(
user.rewardPoints || 0
);

});

const rewardStats={

bronzeMembers,
silverMembers,
goldMembers,
platinumMembers,

rewardUsage,

topRewardPoints,
topRewardUid

};

const customerStats={

topCustomerSpend,
topCustomerUid,

mostActiveOrders,
mostActiveUid

};

const claimRate=

orders.length===0

?

0

:

Math.round(

(claims.length/
orders.length)

*100

);

const settings =
await getStoreSettings();

const currency =
settings.currency || "₹";

const last30Days={};

for(let i=29;i>=0;i--){

const date=new Date();

date.setDate(
date.getDate()-i
);

const key=
date.toISOString().split("T")[0];

last30Days[key]=0;

}

orders.forEach(order=>{

if(

order.status==="approved"

||

order.status==="shipped"

||

order.status==="delivered"

){

const day=

(order.createdAt||"")

.split("T")[0];

if(last30Days[day]!==undefined){

last30Days[day]+=

Number(order.total||0);

}

}

});

const dashboardCards={

revenue,

productsSold,

averageOrder,

customers:users.length,

orders:orders.length,

claims:claims.length,

currency

};

const collections={

products,

users,

orders,

claims,

rewardHistory,

notifications,

activity

};

return{
collections,

orderStatus,

claimStatus,

rewardStats,

customerStats,

highestOrder,

lowestOrder,

dashboardCards,

last30Days,

currency,

products,

users,

orders,

revenue,

productsSold,

dailySales,

weeklySales,

yearlySales,

bestDay,

bestDaySales,

bestMonth,

bestMonthSales,

bestSellingProduct:
rankedProducts[0]||null,

worstSellingProduct:
rankedProducts.at(-1)||null,

productRanking:
rankedProducts,

stockTurnover,

newCustomers,

returningCustomers,

averageLifetimeValue,

rewardUsage,

claimRate,

revenuePerProduct,

averageOrder,
monthlyRevenue,
categorySales

};

}