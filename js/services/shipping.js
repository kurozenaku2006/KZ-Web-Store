import{

collection,
doc,
getDocs,
updateDoc,
query,
where

}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import{

getAuth

}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import{

db

}
from "../config/firebase.js";

const ordersRef=
collection(
db,
"orders"
);

export async function getShippingOrders(){

const snapshot=
await getDocs(
ordersRef
);

return snapshot.docs.map(doc=>({

id:doc.id,

...doc.data()

}));

}

export async function updateShipping(
id,
data
){

await updateDoc(

doc(
db,
"orders",
id
),

{

courier:
data.courier,

trackingNumber:
data.trackingNumber,

estimatedDelivery:
data.estimatedDelivery,

status:
data.status

}

);

}

export async function getCustomerTracking(){

const auth=
getAuth();

const uid=
auth.currentUser.uid;

const q=
query(

ordersRef,

where(
"uid",
"==",
uid
)

);

const snapshot=
await getDocs(q);

return snapshot.docs.map(doc=>({

id:doc.id,

...doc.data()

}));

}