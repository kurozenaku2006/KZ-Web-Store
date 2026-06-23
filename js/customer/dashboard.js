import {
    auth
}
from "../config/firebase.js";

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

        <h3>Reward Points</h3>

        <h1>0</h1>

    </div>

    <div class="stat-card">

        <h3>Delivered</h3>

        <h1>
            ${delivered}
        </h1>

    </div>

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

`;

}

loadDashboard();