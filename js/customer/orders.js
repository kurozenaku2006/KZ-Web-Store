import {
    getOrders
}
from "../services/orders.js";

import {
requireMaintenanceOff
}
from "../services/guard.js";

const container =
document.getElementById(
"ordersContainer"
);

async function loadOrders(){

        await requireMaintenanceOff();


    const orders =
    await getOrders();

    if(orders.length === 0){

        container.innerHTML =

        "<h3>No Orders Found</h3>";

        return;

    }

    container.innerHTML = "";

    orders.forEach(order => {

        container.innerHTML += `

        <div class="card">

            <h2>
                Order
            </h2>

            <p>
                Status:
                ${order.status}
            </p>

            <p>
                Total:
                ₹${order.total}
            </p>

            <p>
                Created:
                ${order.createdAt}
            </p>

            <p>
                Items:
                ${order.items.length}
            </p>

        </div>

        <br>

        `;

    });

}

loadOrders();