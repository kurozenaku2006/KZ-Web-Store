import {
    getProducts,
    deleteProduct,
    updateProduct
}
from "../services/products.js";

import {
    logActivity
}
from "../services/activity.js";

export function registerProductActions(refreshProducts){

    window.removeProduct =
    async function(id){

        const confirmDelete =
        confirm("Delete Product?");

        const products =
await getProducts();

const product =
products.find(
p=>p.id===id
);

        if(!confirmDelete){

            return;

        }

        await logActivity({

    module:"Products",

    action:"Deleted Product",

    targetId:id,

    targetName:product?.name||""

});

await deleteProduct(id);

await refreshProducts();

    };

    window.editProduct =
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

        const newName =
        prompt(
            "Product Name",
            product.name
        );

        if(newName === null){

            return;

        }

        const newPrice =
        Number(
            prompt(
                "Price",
                product.price
            )
        );

        if(isNaN(newPrice)){

            alert("Invalid Price");

            return;

        }

        const newStock =
        Number(
            prompt(
                "Stock",
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

        await updateProduct(
            id,
            {
                name:newName,
                price:newPrice,
                stock:newStock
            }
        );

        await logActivity({

    module:"Products",

    action:"Edited Product",

    targetId:id,

    targetName:newName,

    metadata:{

        oldName:product.name,

        newName,

        price:newPrice,

        stock:newStock

    }

});

        await refreshProducts();

    };

    window.toggleStatus =
    async function(
        id,
        currentStatus
    ){

        const newStatus =
        currentStatus === "active"
        ? "inactive"
        : "active";

        await updateProduct(
    id,
    {
        status:newStatus
    }
);

const products =
await getProducts();

const product =
products.find(
p=>p.id===id
);

await logActivity({

    module:"Products",

    action:
    newStatus==="active"
    ?
    "Activated Product"
    :
    "Deactivated Product",

    targetId:id,

    targetName:
    product?.name||""

});

await refreshProducts();

    };

}