import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    deleteDoc
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    db
}
from "../config/firebase.js";

const productsRef =
collection(
    db,
    "products"
);

export async function addProduct(product){

    return await addDoc(
        productsRef,
        {

            name:
            product.name,

            price:
            Number(product.price),

            stock:
            Number(product.stock),

            status:
            product.status || "active",

            createdAt:
            new Date().toISOString(),

            lastUpdated:
            new Date().toISOString()

        }
    );

}

export async function getProducts(){

    const snapshot =
    await getDocs(
        productsRef
    );

    return snapshot.docs.map(doc => ({

        id:
        doc.id,

        ...doc.data()

    }));

}

export async function getProductById(id){

    const productRef =
    doc(
        db,
        "products",
        id
    );

    const snapshot =
    await getDoc(
        productRef
    );

    if(
        !snapshot.exists()
    ){

        return null;

    }

    return{

        id:
        snapshot.id,

        ...snapshot.data()

    };

}

export async function updateProduct(
    id,
    data
){

    const product =
    await getProductById(id);

    if(
        !product
    ){

        throw new Error(
            "Product not found."
        );

    }

    if(
        data.stock !== undefined &&
        Number(data.stock) < 0
    ){

        throw new Error(
            "Stock cannot be negative."
        );

    }

    await updateDoc(

        doc(
            db,
            "products",
            id
        ),

        {

            ...data,

            lastUpdated:
            new Date().toISOString()

        }

    );

}

export async function deleteProduct(id){

    await deleteDoc(

        doc(
            db,
            "products",
            id

        )

    );

}