import {
    getCartItems,
    removeCartItem
}
from "../services/cart.js";

const container =
document.getElementById(
"cartContainer"
);

async function loadCart(){

    console.log("Loading Cart...");

    const items =
    await getCartItems();

    console.log(items);

    if(items.length === 0){

        container.innerHTML =

        "<h3>Your cart is empty.</h3>";

        return;

    }

    container.innerHTML = "";

    let total = 0;

    items.forEach(item => {

        total += item.price;

        container.innerHTML += `

        <div class="card">

            <h2>
                ${item.name}
            </h2>

            <p>
                ₹${item.price}
            </p>

            <button
            onclick="
            removeItem(
            '${item.id}'
            )
            ">

                Remove

            </button>

        </div>

        `;

    });

    container.innerHTML += `

    <br>

    <div class="card">

        <h2>
            Total:
            ₹${total}
        </h2>

    </div>

    `;

}

window.removeItem =
async function(id){

    await removeCartItem(id);

    loadCart();

}

loadCart();