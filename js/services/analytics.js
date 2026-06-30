import{
collection,
getDocs
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import{
db
}
from "../config/firebase.js";

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

const categorySales = {};

products.forEach(product=>{

const category =
product.category ||
"Other";

categorySales[category] ??= 0;

categorySales[category]++;

});

return{

products,

orders,

revenue,

productsSold,

averageOrder,
monthlyRevenue,
categorySales

};

}