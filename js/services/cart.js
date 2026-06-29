import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    query,
    where,
    updateDoc
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

    const q =
    query(
        cartRef,
        where(
            "uid",
            "==",
            user.uid
        ),
        where(
            "productId",
            "==",
            item.productId
        )
    );

    const snapshot =
    await getDocs(q);

    if(
        !snapshot.empty
    ){

        const cartDoc =
        snapshot.docs[0];

        const data =
        cartDoc.data();

        await updateDoc(
            doc(
                db,
                "carts",
                cartDoc.id
            ),
            {
                quantity:
                Number(
                    data.quantity || 1
                ) + 1
            }
        );

        return;

    }

    await addDoc(
        cartRef,
        {
            ...item,
            uid:user.uid,
            quantity:1
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

export async function updateCartQuantity(
    id,
    quantity
){

    const cartDoc =
    doc(
        db,
        "carts",
        id
    );

    await updateDoc(
        cartDoc,
        {
            quantity
        }
    );

}