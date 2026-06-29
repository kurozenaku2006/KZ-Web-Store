import {
    getProducts
}
from "../services/products.js";

import {
    renderProducts
}
from "./product-renderer.js";

import {
    registerProductActions
}
from "./product-actions.js";

import {
    registerInventoryActions
}
from "./inventory-actions.js";

import {
    registerProductForm
}
from "./product-form.js";

const productsList =
document.getElementById(
    "productsList"
);

async function loadProducts(){

    try{

        const products =
        await getProducts();

        renderProducts(
            products,
            productsList
        );

    }
    catch(error){

        console.error(error);

        productsList.innerHTML = `

<div class="card">

<h3>

Failed to load products

</h3>

<p>

${error.message}

</p>

</div>

`;

    }

}

registerProductActions(
    loadProducts
);

registerInventoryActions(
    loadProducts
);

registerProductForm(
    loadProducts
);

loadProducts();