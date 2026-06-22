import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { db } from "../config/firebase.js";

const productsRef =
    collection(db, "products");

export async function addProduct(product){

    return await addDoc(
        productsRef,
        product
    );

}

export async function getProducts(){

    const snapshot =
        await getDocs(productsRef);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

}

export async function updateProduct(id,data){

    const productRef =
        doc(db,"products",id);

    await updateDoc(
        productRef,
        data
    );

}

export async function deleteProduct(id){

    const productRef =
        doc(db,"products",id);

    await deleteDoc(
        productRef
    );

}