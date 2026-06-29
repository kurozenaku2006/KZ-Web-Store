import {
    getCartItems,
    removeCartItem
}
from "../services/cart.js";

import {
    createOrder
}
from "../services/orders.js";

import {
    auth
}
from "../config/firebase.js";

import {
    addRewardPoints,
    redeemRewardPoints
}
from "../services/rewards.js";

import {
    getUserData
}
from "../services/auth.js";

import {
    getProductById
}
from "../services/products.js";

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

    total +=
    item.price *
    (item.quantity || 1);

});

    const user =
auth.currentUser;

const userData =
user
? await getUserData(
    user.uid
)
: null;

const rewardPoints =
userData?.rewardPoints || 0;

  container.innerHTML = `

<div class="card">

    <h2>
        Total:
        ₹${total}
    </h2>

    <br>

    <p>

        Available Reward Points:
        ${rewardPoints}

    </p>

    <br>

    <label>

        Redeem Points

    </label>

    <br><br>

    <input
    id="redeemPoints"
    type="number"
    value="0"
    min="0"
    max="${rewardPoints}"
    >

    <br><br>

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

    total +=
    item.price *
    (item.quantity || 1);

});

    for(const item of items){

    const latestProduct =
    await getProductById(
        item.productId
    );

    if(
        !latestProduct
    ){

        alert(
            "A product no longer exists."
        );

        return;

    }

   if(

    latestProduct.stock <

    (item.quantity || 1)

){

    alert(

        `${latestProduct.name} has only ${latestProduct.stock} item(s) remaining.`

    );

    return;

}

}

  const redeemPoints =
Number(
    document.getElementById(
        "redeemPoints"
    ).value || 0
);

if(
    redeemPoints > total
){

    alert(
        "Cannot redeem more than order total"
    );

    return;

}

if(
    redeemPoints > 0
){

    total =
    total - redeemPoints;

}

    await createOrder({

        items,
        total

    });

    const rewardPoints =
Math.floor(
    total / 100
);

const user =
auth.currentUser;

if(user){

    const redeemPoints =
    Number(
        document.getElementById(
            "redeemPoints"
        ).value || 0
    );

    if(
        redeemPoints > 0
    ){

        await redeemRewardPoints(
            user.uid,
            redeemPoints
        );

    }

    await addRewardPoints(
        user.uid,
        rewardPoints,
        total
    );

}

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