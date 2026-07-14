import {
    getCartItems,
    removeCartItem,
    updateCartQuantity
}
from "../services/cart.js";

import{
requireMaintenanceOff
}
from "../services/guard.js";

const container =
document.getElementById(
"cartContainer"
);

async function loadCart(){

    await requireMaintenanceOff();

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

total += item.price * (item.quantity || 1);

        container.innerHTML += `

        <div class="card">

            <h2>
                ${item.name}
            </h2>

            <p>
                ₹${item.price}
            </p>

            <p>

Quantity

</p>

<input
type="number"
min="1"
value="${item.quantity || 1}"
onchange="changeQuantity(
'${item.id}',
this.value
)"
>

<p>

    Subtotal:
    ₹${item.price * (item.quantity || 1)}

</p>

<br>

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

        <br>

        <button
        onclick="location.href='checkout.html'">

            Proceed To Checkout

        </button>

    </div>

    `;

}

window.changeQuantity =
async function(
id,
quantity
){

    quantity =
    Number(quantity);

    if(
        quantity < 1
    ){

        quantity = 1;

    }

    await updateCartQuantity(
        id,
        quantity
    );

    loadCart();

}

window.removeItem =
async function(id){

    await removeCartItem(id);

    loadCart();

}

loadCart();