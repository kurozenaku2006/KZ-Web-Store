import {
    getProductById
}
from "../services/products.js";

import {
    addToCart
}
from "../services/cart.js";

const params =
new URLSearchParams(
window.location.search
);

const productId =
params.get("id");

const container =
document.getElementById(
"productContainer"
);

window.addProductToCart =
async function(){

    const product =
    await getProductById(
        productId
    );

    await addToCart({

        productId:
        product.id,

        name:
        product.name,

        price:
        product.price

    });

    alert(
        "Product Added To Cart ✅"
    );

}

async function loadProduct(){

    const product =
    await getProductById(
        productId
    );

    if(!product){

        container.innerHTML =
        "<h2>Product Not Found</h2>";

        return;

    }

    container.innerHTML = `

        <div class="card">

            <h1>
                ${product.name}
            </h1>

            <br>

            <p>
                Price:
                ₹${product.price}
            </p>

            <br>

            <p>
                Stock:
                ${product.stock}
            </p>

            <br>

            <p>
                Status:
                ${product.status}
            </p>

            <br>

            <button
            onclick="
            addProductToCart()
            ">

                Add To Cart

            </button>

        </div>

    `;

}

loadProduct();