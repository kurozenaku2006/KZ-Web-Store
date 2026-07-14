import {
    getProducts
}
from "../services/products.js";

import {
requireMaintenanceOff
}
from "../services/guard.js";

const catalogGrid =
document.getElementById(
    "catalogGrid"
);

async function loadCatalog(){

    await requireMaintenanceOff();

    const products =
    await getProducts();

    catalogGrid.innerHTML = "";

    const activeProducts =
    products.filter(
        product =>
        product.status === "active"
    );

    if(
        activeProducts.length === 0
    ){

        catalogGrid.innerHTML =
        "<p>No Products Found</p>";

        return;

    }

    activeProducts.forEach(
product => {

    catalogGrid.innerHTML += `

    <div class="card">

        <h2>
            ${product.name}
        </h2>

        <p>
            ₹${product.price}
        </p>

        <p>
            Stock:
            ${product.stock}
        </p>

        <br>

        ${
product.stock > 0 && !product.outOfStock

            ?

            `

            <button
            onclick="
            location.href=
            '/product.html?id=${product.id}'
            ">

                View Product

            </button>

            `

            :

            `

            <button disabled>

                Out Of Stock

            </button>

            `

        }

    </div>

    `;

});

}

loadCatalog();