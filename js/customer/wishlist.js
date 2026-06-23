import {
    getWishlist,
    removeWishlistItem
}
from "../services/wishlist.js";

import {
    getProductById
}
from "../services/products.js";

const container =
document.getElementById(
"wishlistContainer"
);

async function loadWishlist(){

    const items =
    await getWishlist();

    if(items.length === 0){

        container.innerHTML =

        "<p>No Wishlist Items</p>";

        return;

    }

    container.innerHTML = "";

   for(const item of items){

    const product =
    await getProductById(
        item.productId
    );

    if(!product){
        continue;
    }

    container.innerHTML += `

    <div class="card">

        <h2>
            ${product.name}
        </h2>

        <br>

        <p>
            Price:
            ₹${product.price}
        </p>

        <p>
            Stock:
            ${product.stock}
        </p>

        <p>
            Status:
            ${product.status}
        </p>

        <br>

        <button
        onclick="removeItem('${item.id}')">

            Remove

        </button>

    </div>

    <br>

    `;

}

}

window.removeItem =
async function(id){

    await removeWishlistItem(
        id
    );

    loadWishlist();

}

loadWishlist();