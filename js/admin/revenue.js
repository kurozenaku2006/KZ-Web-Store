import {
    getAllOrders
}
from "../services/orders.js";

const container =
document.getElementById(
"revenueContainer"
);

async function loadRevenue(){

    const orders =
    await getAllOrders();

    let revenue = 0;

    let totalOrders = orders.length;

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
                revenue += order.total;
                break;

            case "shipped":
                shipped++;
                revenue += order.total;
                break;

            case "delivered":
                delivered++;
                revenue += order.total;
                break;

            case "cancelled":
                cancelled++;
                break;

        }

    });

    container.innerHTML = `

        <div class="card">

            <h2>
                Total Revenue
            </h2>

            <h1>
                ₹${revenue}
            </h1>

        </div>

        <br>

        <div class="card">

            <p>
                Total Orders:
                ${totalOrders}
            </p>

            <p>
                Pending:
                ${pending}
            </p>

            <p>
                Approved:
                ${approved}
            </p>

            <p>
                Shipped:
                ${shipped}
            </p>

            <p>
                Delivered:
                ${delivered}
            </p>

            <p>
                Cancelled:
                ${cancelled}
            </p>

        </div>

    `;

}

loadRevenue();