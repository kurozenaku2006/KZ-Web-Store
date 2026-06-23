import {
    getCartItems,
    removeCartItem
}
from "../services/cart.js";

import {
    createOrder
}
from "../services/orders.js";

const container =
document.getElementById(
"checkoutContainer"
);

async function loadCheckout(){

    const items =
    await getCartItems();

    if(items.length === 0){

        container.innerHTML =
        "<h3>Cart Empty</h3>";

        return;

    }

    let total = 0;

    items.forEach(item => {

        total += item.price;

    });

    container.innerHTML = `

        <div class="card">

            <h2>
                Total:
                ₹${total}
            </h2>

            <br>

            <button
            onclick="placeOrder()">

                Place Order

            </button>

        </div>

    `;

}

window.placeOrder =
async function(){

    const items =
    await getCartItems();

    let total = 0;

    items.forEach(item => {

        total += item.price;

    });

    await createOrder({

        items,
        total

    });

    for(const item of items){

        await removeCartItem(
            item.id
        );

    }

    alert(
        "Order Created ✅"
    );

    location.reload();

}

loadCheckout();