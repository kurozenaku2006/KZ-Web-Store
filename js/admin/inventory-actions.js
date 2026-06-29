import {
    getProducts
}
from "../services/products.js";

import {
    increaseStock,
    decreaseStock,
    adjustStock
}
from "../services/inventory.js";

export function registerInventoryActions(
    refreshProducts
){

    window.restockProduct =
    async function(
        id,
        amount
    ){

        const products =
        await getProducts();

        const product =
        products.find(
            p => p.id === id
        );

        if(!product){

            return;

        }

        const confirmRestock =
        confirm(
            `Add ${amount} units to ${product.name}?`
        );

        if(!confirmRestock){

            return;

        }

        await increaseStock(
            id,
            amount,
            "Manual Restock",
            "admin"
        );

        await refreshProducts();

    };

    window.reduceStock =
    async function(id){

        const products =
        await getProducts();

        const product =
        products.find(
            p => p.id === id
        );

        if(!product){

            return;

        }

        const amount =
        Number(
            prompt(
                "Reduce stock by:"
            )
        );

        if(
            isNaN(amount) ||
            amount <= 0
        ){

            alert(
                "Invalid amount."
            );

            return;

        }

        if(
            amount >
            Number(product.stock)
        ){

            alert(
                "Cannot reduce below zero."
            );

            return;

        }

        const confirmReduce =
        confirm(
            `Reduce ${product.name} by ${amount}?`
        );

        if(!confirmReduce){

            return;

        }

        await decreaseStock(
            id,
            amount,
            "Manual Reduction",
            "admin"
        );

        await refreshProducts();

    };

    window.adjustProductStock =
    async function(id){

        const products =
        await getProducts();

        const product =
        products.find(
            p => p.id === id
        );

        if(!product){

            return;

        }

        const newStock =
        Number(
            prompt(
                "Enter New Stock",
                product.stock
            )
        );

        if(
            isNaN(newStock) ||
            newStock < 0
        ){

            alert(
                "Invalid Stock"
            );

            return;

        }

        await adjustStock(
            id,
            newStock,
            "Manual Adjustment",
            "admin"
        );

        await refreshProducts();

    };

}
