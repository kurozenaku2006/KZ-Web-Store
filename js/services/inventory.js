import {
    collection,
    doc,
    getDoc,
    getDocs,
    updateDoc,
    addDoc
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    getProductById
}
from "./products.js";

import {
    db
}
from "../config/firebase.js";

const productsRef =
collection(
    db,
    "products"
);

const inventoryLogsRef =
collection(
    db,
    "inventory_logs"
);

export async function getInventoryProducts(){

    const snapshot =
    await getDocs(
        productsRef
    );

    return snapshot.docs.map(doc => ({
        id:doc.id,
        ...doc.data()
    }));

}

export async function updateInventoryStock(
    productId,
    newStock,
    movementType,
    reason = "",
    performedBy = "admin"
){

    const product =
    await getProductById(
        productId
    );

    if(!product){

        throw new Error(
            "Product not found."
        );

    }

    if(newStock < 0){

        throw new Error(
            "Stock cannot be negative."
        );

    }

    const previousStock =
    Number(
        product.stock || 0
    );

    await updateDoc(
        doc(
            db,
            "products",
            productId
        ),
        {
            stock:newStock,
            lastUpdated:
            new Date().toISOString()
        }
    );

    await addDoc(
        inventoryLogsRef,
        {
            productId,
            productName:
            product.name,
            movementType,
            quantity:
            Math.abs(
                newStock -
                previousStock
            ),
            previousStock,
            newStock,
            reason,
            performedBy,
            createdAt:
            new Date().toISOString()
        }
    );

}

export async function increaseStock(
    productId,
    quantity,
    reason = "Restock",
    performedBy = "admin"
){

    const product =
    await getProductById(
        productId
    );

    await updateInventoryStock(
        productId,
        Number(
            product.stock
        ) + Number(quantity),
        "increase",
        reason,
        performedBy
    );

}

export async function decreaseStock(
    productId,
    quantity,
    reason = "Manual Reduction",
    performedBy = "admin"
){

    const product =
    await getProductById(
        productId
    );

    const newStock =
    Number(
        product.stock
    ) - Number(quantity);

    if(newStock < 0){

        throw new Error(
            "Insufficient stock."
        );

    }

    await updateInventoryStock(
        productId,
        newStock,
        "decrease",
        reason,
        performedBy
    );

}

export async function restockProduct(
    productId,
    quantity,
    performedBy = "admin"
){

    await increaseStock(
        productId,
        quantity,
        "Restocked",
        performedBy
    );

}

export async function adjustStock(
    productId,
    newStock,
    reason,
    performedBy = "admin"
){

    await updateInventoryStock(
        productId,
        Number(newStock),
        "adjustment",
        reason,
        performedBy
    );

}