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

return{

products,

orders,

revenue,

productsSold,

averageOrder

};

}