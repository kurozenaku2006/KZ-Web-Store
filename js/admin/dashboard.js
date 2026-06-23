import {
    collection,
    getDocs
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    db
}
from "../config/firebase.js";

const cards =
document.getElementById(
"cards"
);

const recentOrdersBox =
document.getElementById(
"recentOrders"
);

const lowStockBox =
document.getElementById(
"lowStockProducts"
);

async function loadDashboard(){

    const usersSnapshot =
    await getDocs(
        collection(db,"users")
    );

    const productsSnapshot =
    await getDocs(
        collection(db,"products")
    );

    const ordersSnapshot =
    await getDocs(
        collection(db,"orders")
    );

    const users =
    usersSnapshot.docs.map(
        doc => doc.data()
    );

    const products =
    productsSnapshot.docs.map(
        doc => ({
            id:doc.id,
            ...doc.data()
        })
    );

    const orders =
    ordersSnapshot.docs.map(
        doc => doc.data()
    );

    let revenue = 0;

    orders.forEach(order => {

        revenue +=
        Number(
            order.total || 0
        );

    });

    const lowStockItems =
    products.filter(
        product =>
        product.stock <= 5
    ).length;

    cards.innerHTML = `

        <div class="card">

            <h3>
                Total Revenue
            </h3>

            <div class="card-value">

                ₹${revenue}

            </div>

        </div>

        <div class="card">

            <h3>
                Total Orders
            </h3>

            <div class="card-value">

                ${orders.length}

            </div>

        </div>

        <div class="card">

            <h3>
                Customers
            </h3>

            <div class="card-value">

                ${users.length}

            </div>

        </div>

        <div class="card">

            <h3>
                Pending Claims
            </h3>

            <div class="card-value">

                0

            </div>

        </div>

        <div class="card">

            <h3>
                Low Stock Items
            </h3>

            <div class="card-value">

                ${lowStockItems}

            </div>

        </div>

    `;

    const recentOrders =
orders.slice(-5).reverse();

recentOrdersBox.innerHTML = `

<h2>
Recent Orders
</h2>

<br>

${
recentOrders.length === 0
? "<p>No Orders Found</p>"
: recentOrders.map(order => `

<div class="activity-item">

    <p>
        Status:
        ${order.status}
    </p>

    <p>
        Total:
        ₹${order.total}
    </p>

    <p>
        ${order.createdAt}
    </p>

</div>

`).join("")
}

`;

const lowStockProducts =
products.filter(
product =>
product.stock <= 5
);

lowStockBox.innerHTML = `

<h2>
Low Stock Products
</h2>

<br>

${
lowStockProducts.length === 0
? "<p>No Low Stock Products</p>"
: lowStockProducts.map(product => `

<div class="activity-item">

    <p>
        ${product.name}
    </p>

    <p>
        Stock:
        ${product.stock}
    </p>

</div>

`).join("")
}

`;

}

loadDashboard();