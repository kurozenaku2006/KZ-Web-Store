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
    getProductById
}
from "./products.js";

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

await addDoc(
    ordersRef,
    {
        ...order,
        uid:user.uid,
        status:"pending",
        createdAt:
        new Date().toISOString()
    }
);

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
            status
        }
    );

}