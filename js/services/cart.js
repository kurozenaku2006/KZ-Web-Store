import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    query,
    where
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

const cartRef =
collection(db,"carts");

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

export async function addToCart(item){

    const user =
    await getCurrentUser();

    if(!user){

        alert(
            "Please login first"
        );

        return;
    }

    await addDoc(
        cartRef,
        {
            ...item,
            uid:user.uid
        }
    );

}

export async function getCartItems(){

    const user =
    await getCurrentUser();

    if(!user){

        return [];

    }

    const q =
    query(
        cartRef,
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

export async function removeCartItem(id){

    await deleteDoc(
        doc(
            db,
            "carts",
            id
        )
    );

}