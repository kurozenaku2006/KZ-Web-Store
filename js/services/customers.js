import {
collection,
getDocs
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
db
}
from "../config/firebase.js";

export async function getCustomers(){

const users=
await getDocs(
collection(
db,
"users"
)
);

const orders=
await getDocs(
collection(
db,
"orders"
)
);

const claims=
await getDocs(
collection(
db,
"claims"
)
);

const orderList=
orders.docs.map(doc=>doc.data());

const claimList=
claims.docs.map(doc=>doc.data());

return users.docs
.map(doc=>({

id:doc.id,

...doc.data()

}))
.filter(user=>
user.role==="customer"
)
.map(user=>{

const customerOrders=
orderList.filter(
order=>
order.uid===user.uid
);

const customerClaims=
claimList.filter(
claim=>
claim.uid===user.uid
);

const spend=
customerOrders.reduce(
(total,order)=>
total+
Number(
order.total||0
),
0
);

return{

...user,

totalOrders:
customerOrders.length,

totalSpend:
spend,

totalClaims:
customerClaims.length

};

});

}