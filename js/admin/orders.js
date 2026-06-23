import {
    getAllOrders,
    updateOrderStatus
}
from "../services/orders.js";

const container =
document.getElementById(
"ordersContainer"
);

window.changeStatus =
async function(
    orderId,
    status
){

    await updateOrderStatus(
        orderId,
        status
    );

    loadOrders();

}

async function loadOrders(){

    const orders =
    await getAllOrders();

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
                Customer UID:
                ${order.uid}
            </p>

            <p>
                Status:
                ${order.status}
            </p>

            <p>
                Total:
                ₹${order.total}
            </p>

            <p>
                Items:
                ${order.items.length}
            </p>

            <p>
                Created:
                ${order.createdAt}
            </p>

            <br>

            <button
            onclick="
            changeStatus(
            '${order.id}',
            'approved'
            )">

                Approve

            </button>

            <button
            onclick="
            changeStatus(
            '${order.id}',
            'shipped'
            )">

                Ship

            </button>

            <button
            onclick="
            changeStatus(
            '${order.id}',
            'delivered'
            )">

                Deliver

            </button>

            <button
            onclick="
            changeStatus(
            '${order.id}',
            'cancelled'
            )">

                Cancel

            </button>

        </div>

        <br>

        `;

    });

}

loadOrders();