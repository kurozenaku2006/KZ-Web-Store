import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    doc,
    updateDoc,
    runTransaction
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    auth,
    db
}
from "../config/firebase.js";

import {
    decreaseStock
}
from "./inventory.js";

import {
    logActivity
}
from "./activity.js";

import {
    getProductById
}
from "./products.js";

import {
    getStoreSettings
}
from "./settings.js";

const ordersRef =
collection(db,"orders");

function getCurrentUser(){

    return new Promise((resolve)=>{

        const unsubscribe =
        onAuthStateChanged(
            auth,
            (user)=>{

                unsubscribe();

                resolve(user);

            }
        );

    });

}

export async function createOrder(order){

    const user =
    await getCurrentUser();

    const settings =
await getStoreSettings();

    const userDoc =
await getDocs(
query(
collection(
db,
"users"
),
where(
"uid",
"==",
user.uid
)
)
);

const account =
userDoc.docs[0]?.data();

if(
account?.status==="disabled"
){

throw new Error(
"Your account has been disabled."
);

}

    if(!user){

        alert("Please Login");

        return;
    }

    for(const item of order.items){

    const product =
await getProductById(
    item.productId
);

    if(!product){

        throw new Error(
            `${item.name} not found.`
        );

    }

    const quantity =
    Number(
        item.quantity || 1
    );

    if(
        product.stock <
        quantity
    ){

        throw new Error(
            `${product.name} is out of stock.`
        );

    }

}

for(const item of order.items){

    const quantity =
    Number(
        item.quantity || 1
    );

    await decreaseStock(

    item.productId,

        quantity,

        "Customer Order",

        user.email ||
        user.uid

    );

}

const orderNumber =

`${settings.orderPrefix || "KZ"}-${
Date.now()
}`;

await addDoc(
    ordersRef,
   {
    ...order,

    orderNumber,

    uid:user.uid,

    status:
    settings.autoApproveOrders
    ? "approved"
    : "pending",

    paymentStatus:"pending",

    tax:
    Number(settings.tax || 0),

    shipping:
    Number(settings.shipping || 0),

    rewardRate:
    Number(settings.rewardRate || 1),

    adminNote:"",

    createdAt:
    new Date().toISOString(),

    updatedAt:
    new Date().toISOString()
}
);

await logActivity({

module:"orders",

action:"Order Created",

targetId:orderNumber,

targetName:user.uid,

metadata:{
status:
settings.autoApproveOrders
? "approved"
: "pending"
}

});

}

export async function getOrders(){

    const user =
    await getCurrentUser();

    if(!user){

        return [];

    }

    const q =
    query(
        ordersRef,
        where(
            "uid",
            "==",
            user.uid
        )
    );

    const snapshot =
    await getDocs(q);

    return snapshot.docs.map(
        doc => ({
            id:doc.id,
            ...doc.data()
        })
    );

}


export async function getAllOrders(){

    const snapshot =
    await getDocs(
        ordersRef
    );

    return snapshot.docs.map(
        doc => ({
            id:doc.id,
            ...doc.data()
        })
    );

}

export async function updateOrderStatus(
    orderId,
    status
){

    const snapshot =
    await getDocs(ordersRef);

    const order =
    snapshot.docs
    .map(doc => ({
        id:doc.id,
        ...doc.data()
    }))
    .find(
        order =>
        order.id === orderId
    );

    if(!order){

        return;

    }

    const orderRef =
    doc(
        db,
        "orders",
        orderId
    );

   await updateDoc(

orderRef,

{

status,

updatedAt:
new Date().toISOString()

}

);

    await logActivity({

    module:"orders",

    action:
    status==="approved"
    ? "Order Approved"
    :
    status==="rejected"
    ? "Order Rejected"
    :
    status==="shipped"
    ? "Order Shipped"
    :
    status==="delivered"
    ? "Order Delivered"
    :
    "Order Updated",

    targetId:orderId,

    targetName:order.uid,

    metadata:{
        status
    }

});

}

export async function getOrderStatistics(){

const orders=
await getAllOrders();

return{

total:
orders.length,

pending:
orders.filter(
o=>o.status==="pending"
).length,

approved:
orders.filter(
o=>o.status==="approved"
).length,

shipped:
orders.filter(
o=>o.status==="shipped"
).length,

delivered:
orders.filter(
o=>o.status==="delivered"
).length,

cancelled:
orders.filter(
o=>

o.status==="cancelled"

||

o.status==="rejected"

).length,

revenue:

orders

.filter(
o=>o.status==="delivered"
)

.reduce(

(total,o)=>

total+
Number(o.total||0),

0

)

};

}