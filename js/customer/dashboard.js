import {
    auth
}
from "../config/firebase.js";

import {
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    getUserData
}
from "../services/auth.js";

import {
    getRewardHistory
}
from "../services/rewards.js";

import {
    getOrders
}
from "../services/orders.js";

import {
    getCartItems
}
from "../services/cart.js";

const container =
document.getElementById(
"dashboardContainer"
);

async function loadDashboard(){

    const user =
    auth.currentUser;

    const orders =
    await getOrders();

    const cartItems =
    await getCartItems();

    const customerName =
    user?.email || "Customer";

    const userData =
user
? await getUserData(
    user.uid
)
: null;

const rewardPoints =
userData?.rewardPoints || 0;

let currentTier = "Bronze";
let nextTier = "Silver";
let pointsToNext = 100 - rewardPoints;

if(rewardPoints >= 100){

    currentTier = "Silver";
    nextTier = "Gold";
    pointsToNext = 500 - rewardPoints;

}

if(rewardPoints >= 500){

    currentTier = "Gold";
    nextTier = "Platinum";
    pointsToNext = 1000 - rewardPoints;

}

if(rewardPoints >= 1000){

    currentTier = "Platinum";
    nextTier = "MAX";
    pointsToNext = 0;

}

const rewardHistory =
user
? await getRewardHistory(
    user.uid
)
: [];

let lifetimeEarned = 0;
let lifetimeRedeemed = 0;

rewardHistory.forEach(item => {

    if(
        item.type === "earned"
    ){

        lifetimeEarned +=
        Number(
            item.points || 0
        );

    }

    if(
        item.type === "redeemed"
    ){

        lifetimeRedeemed +=
        Math.abs(
            Number(
                item.points || 0
            )
        );

    }

});

    let pending = 0;
    let approved = 0;
    let shipped = 0;
    let delivered = 0;
    let cancelled = 0;

    orders.forEach(order => {

        switch(order.status){

            case "pending":
                pending++;
                break;

            case "approved":
                approved++;
                break;

            case "shipped":
                shipped++;
                break;

            case "delivered":
                delivered++;
                break;

            case "cancelled":
                cancelled++;
                break;

        }

    });

    const recentOrders =
    orders.slice(-5).reverse();

container.innerHTML = `

<div class="card">

    <h2>
        Welcome Back
    </h2>

    <p>
        ${customerName}
    </p>

</div>

<div class="dashboard-grid">

    <div class="stat-card">

        <h3>Total Orders</h3>

        <h1>
            ${orders.length}
        </h1>

    </div>

    <div class="stat-card">

        <h3>Cart Items</h3>

        <h1>
            ${cartItems.length}
        </h1>

    </div>

    <div class="stat-card">

    <h3>
        Reward Balance
    </h3>

    <h1>
        ${rewardPoints}
    </h1>

</div>

<div class="stat-card">

    <h3>
        Current Tier
    </h3>

    <h1>
        ${currentTier}
    </h1>

    <small>
        Next:
        ${nextTier}
    </small>

</div>

    <div class="stat-card">

        <h3>Delivered</h3>

        <h1>
            ${delivered}
        </h1>

    </div>

    <div class="stat-card">

    <h3>
        Lifetime Earned
    </h3>

    <h1>
        ${lifetimeEarned}
    </h1>

</div>

<div class="stat-card">

    <h3>
        Lifetime Redeemed
    </h3>

    <h1>
        ${lifetimeRedeemed}
    </h1>

</div>

</div>

<br>

<div class="card">

    <h2>
        Reward Tier Progress
    </h2>

    <p>

        Current Tier:
        ${currentTier}

    </p>

    <p>

        Next Tier:
        ${nextTier}

    </p>

    <p>

        Points Needed:
        ${pointsToNext > 0 ? pointsToNext : 0}

    </p>

</div>

<br>

<div class="card">

    <h2>
        Order Status Summary
    </h2>

    <p>Pending: ${pending}</p>
    <p>Approved: ${approved}</p>
    <p>Shipped: ${shipped}</p>
    <p>Delivered: ${delivered}</p>
    <p>Cancelled: ${cancelled}</p>

</div>

<br>

<div class="card">

    <h2>
        Recent Orders
    </h2>

    <br>

<div class="card">

    <h2>
        Reward History
    </h2>

    <br>

    ${
        rewardHistory.length === 0
        ? "<p>No Rewards Yet</p>"
        : rewardHistory
        .slice(-5)
        .reverse()
        .map(reward => `

        <div>

            <p>
                +${reward.points} Points
            </p>

            <p>
                Order Total:
                ₹${reward.orderTotal}
            </p>

            <hr>

        </div>

        `).join("")
    }

</div>

    ${
        recentOrders.length === 0
        ? "<p>No Orders Yet</p>"
        : recentOrders.map(order => `
        <div>

            <p>
                Status:
                ${order.status}
            </p>

            <p>
                Total:
                ₹${order.total}
            </p>

            <hr>

        </div>
        `).join("")
    }

</div>

<br>

<div class="card">

    <h2>
        Reward Transactions
    </h2>

    <br>

    ${
        rewardHistory.length === 0
        ? "<p>No Reward Activity</p>"
        : rewardHistory
        .slice(-10)
        .reverse()
        .map(item => `

        <div>

            <p>

                Type:
                ${item.type}

            </p>

            <p>

                Points:
                ${item.points}

            </p>

            <p>

                Date:
                ${item.createdAt}

            </p>

            <hr>

        </div>

        `).join("")
    }

</div>

`;

}

onAuthStateChanged(
    auth,
    (user) => {

        if(user){

            loadDashboard();

        }

    }
);