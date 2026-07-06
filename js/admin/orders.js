import {
    getAllOrders,
    updateOrderStatus
}
from "../services/orders.js";

let allOrders = [];

let currentFilter =
"all";

let searchText = "";

const container =
document.getElementById(
"ordersContainer"
);

const statsBox =
document.getElementById(
"orderStats"
);

const searchBox =
document.getElementById(
"orderSearch"
);

const paymentFilter =
document.getElementById(
"paymentFilter"
);

const dateFilter =
document.getElementById(
"orderDateFilter"
);

const modal =
document.getElementById(
"orderModal"
);

const modalContent =
document.getElementById(
"orderModalContent"
);

window.changeStatus =
async function(
    orderId,
    status
){

    const confirmChange =
    confirm(
        `Change order status to ${status}?`
    );

    if(!confirmChange){
        return;
    }

    await updateOrderStatus(
        orderId,
        status
    );

    loadOrders();

};

window.filterOrders =
function(status){

    currentFilter =
    status;

    renderOrders();

};

window.exportOrders =
function(){

    let csv =
"Order ID,UID,Status,Payment,Total,Created\n";

    allOrders.forEach(order => {

       csv +=

`${order.id},

${order.uid},

${order.status},

${order.paymentStatus||"pending"},

${order.total},

${order.createdAt}

\n`;

    });

    const blob =
    new Blob(
        [csv],
        {
            type:
            "text/csv"
        }
    );

    const url =
    URL.createObjectURL(
        blob
    );

    const a =
    document.createElement("a");

    a.href = url;

    a.download =
    "orders.csv";

    a.click();

};

searchBox.oninput=
renderOrders;

paymentFilter.onchange=
renderOrders;

dateFilter.onchange=
renderOrders;

function renderOrders(){

    let orders =
    allOrders;

    if(
        currentFilter !==
        "all"
    ){

        orders =
        orders.filter(
            order =>
            order.status ===
            currentFilter
        );

    }

    if(searchText){

    orders =
    orders.filter(order =>

        String(
            order.uid || ""
        )
        .toLowerCase()
        .includes(searchText)

        ||

        String(
            order.id || ""
        )
        .toLowerCase()
        .includes(searchText)

    );

}

if(
paymentFilter.value!=="all"
){

orders =
orders.filter(order=>

(order.paymentStatus||"pending")

===

paymentFilter.value

);

}

if(
dateFilter.value
){

orders =
orders.filter(order=>

(order.createdAt||"")

.startsWith(

dateFilter.value

)

);

}

    if(
        orders.length === 0
    ){

        container.innerHTML =
        "<h3>No Orders Found</h3>";

        return;

    }

    container.innerHTML = "";

    orders.forEach(order => {

        const completed =
        order.status === "delivered" ||
        order.status === "cancelled" ||
        order.status === "rejected";

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
                ${order.items?.length || 0}
            </p>

            <p>

Created :

${

order.createdAt

?

new Date(
order.createdAt
).toLocaleString()

:

"-"

}

</p>

<p>

Payment :

${order.paymentStatus||"pending"}

</p>

            <br>

            <button
onclick="viewOrder('${order.id}')">

View Details

</button>

<br><br>

            ${
                completed
                ?
                `<strong>
                    Order Closed
                </strong>`
                :
                `
                <button onclick="changeStatus('${order.id}','approved')">
                    Approve
                </button>

                <button onclick="changeStatus('${order.id}','rejected')">
                    Reject
                </button>

                <button onclick="changeStatus('${order.id}','shipped')">
                    Ship
                </button>

                <button onclick="changeStatus('${order.id}','delivered')">
                    Deliver
                </button>

                <button onclick="changeStatus('${order.id}','cancelled')">
                    Cancel
                </button>
                `
            }

        </div>

        <br>

        `;

    });

}

async function loadOrders(){

   allOrders =
await getAllOrders();

const pending =
allOrders.filter(
o => o.status === "pending"
).length;

const approved =
allOrders.filter(
o => o.status === "approved"
).length;

const shipped =
allOrders.filter(
o => o.status === "shipped"
).length;

const delivered =
allOrders.filter(
o => o.status === "delivered"
).length;

const cancelled =
allOrders.filter(
o => o.status === "cancelled"
).length;

let revenue = 0;

allOrders.forEach(order => {

    if(
        order.status === "delivered"
    ){

        revenue += Number(
            order.total || 0
        );

    }

});

const averageOrderValue =
allOrders.length > 0
?
Math.round(
    revenue /
    allOrders.length
)
:
0;

statsBox.innerHTML = `

<div class="card">
<h3>Total</h3>
<div class="card-value">
${allOrders.length}
</div>
</div>

<div class="card">
<h3>Pending</h3>
<div class="card-value">
${pending}
</div>
</div>

<div class="card">
<h3>Approved</h3>
<div class="card-value">
${approved}
</div>
</div>

<div class="card">
<h3>Shipped</h3>
<div class="card-value">
${shipped}
</div>
</div>

<div class="card">
<h3>Delivered</h3>
<div class="card-value">
${delivered}
</div>
</div>

<div class="card">
<h3>Cancelled</h3>
<div class="card-value">
${cancelled}
</div>
</div>

<div class="card">
<h3>Revenue</h3>
<div class="card-value">
₹${revenue}
</div>
</div>

<div class="card">
<h3>Avg Order</h3>
<div class="card-value">
₹${averageOrderValue}
</div>
</div>

`;

renderOrders();

}

window.closeOrderModal=
function(){

modal.style.display="none";

};

window.viewOrder=
function(id){

const order=
allOrders.find(
o=>o.id===id
);

if(!order){

return;

}

modal.style.display=
"block";

modalContent.innerHTML=`

<p>

<b>

Order ID

</b>

</p>

<p>

${order.id}

</p>

<hr>

<p>

Customer

</p>

<p>

${order.uid}

</p>

<hr>

<p>

Status

</p>

<p>

${order.status}

</p>

<hr>

<p>

Payment

</p>

<p>

${order.paymentStatus||"pending"}

</p>

<hr>

<p>

Created

</p>

<p>

${

order.createdAt

?

new Date(
order.createdAt
).toLocaleString()

:

"-"

}

</p>

<hr>

<p>

Items

</p>

${

(order.items||[])

.map(item=>`

<div class="activity-item">

${item.name}

<br>

Qty :

${item.quantity}

<br>

₹${item.price}

</div>

`)

.join("")

}

<hr>

<p>

Timeline

</p>

<div class="activity-item">

Created

<br>

↓

<br>

${order.status}

</div>

`;

};

loadOrders();

setInterval(

loadOrders,

30000

);