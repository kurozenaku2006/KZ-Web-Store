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

const wishlistRef =
collection(db,"wishlists");

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

export async function addToWishlist(
productId
){

    const user =
    await getCurrentUser();

    if(!user){

        alert("Please Login");

        return;
    }

    await addDoc(
        wishlistRef,
        {
            uid:user.uid,
            productId,
            createdAt:
            new Date().toISOString()
        }
    );

}

export async function getWishlist(){

    const user =
    await getCurrentUser();

    if(!user){

        return [];

    }

    const q =
    query(
        wishlistRef,
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

export async function removeWishlistItem(
id
){

    await deleteDoc(
        doc(
            db,
            "wishlists",
            id
        )
    );

}