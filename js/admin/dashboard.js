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

const rewardActivityBox =
document.getElementById(
"rewardActivity"
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

    const claimsSnapshot =
    await getDocs(
        collection(db,"claims")
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

    const claims =
    claimsSnapshot.docs.map(
        doc => doc.data()
        );

        const rewardHistorySnapshot =
await getDocs(
    collection(
        db,
        "rewardHistory"
    )
);

const rewardHistory =
rewardHistorySnapshot.docs.map(
    doc => doc.data()
);

        const pendingClaims =
claims.filter(
    claim =>
    claim.status === "pending"
).length;

    let revenue = 0;

    orders.forEach(order => {

        revenue +=
        Number(
            order.total || 0
        );

    });

    let highestOrder = 0;
let lowestOrder = 0;
let averageOrder = 0;

if(orders.length > 0){

    const totals =
    orders.map(
        order =>
        Number(
            order.total || 0
        )
    );

    highestOrder =
    Math.max(...totals);

    lowestOrder =
    Math.min(...totals);

    averageOrder =
    Math.round(
        revenue /
        orders.length
    );

}

    const lowStockItems =
    products.filter(
        product =>
        product.stock <= 5
    ).length;

    const approvedClaims =
claims.filter(
    claim =>
    claim.status === "approved"
).length;

const rejectedClaims =
claims.filter(
    claim =>
    claim.status === "rejected"
).length;

let totalRewardIssued = 0;

rewardHistory.forEach(
    reward => {

        totalRewardIssued +=
        Number(
            reward.points || 0
        );

    }
);

let bronzeMembers = 0;
let silverMembers = 0;
let goldMembers = 0;
let platinumMembers = 0;

let totalRewardRedeemed = 0;

let topCustomerUid = "-";
let topCustomerSpend = 0;

let mostActiveUid = "-";
let mostActiveOrders = 0;

let topRewardUid = "-";
let topRewardPoints = 0;

const customerStats = {};

users.forEach(
    user => {

        let points =
        Number(
            user.rewardPoints || 0
        );

        if(points >= 1000){

            platinumMembers++;

        }
        else if(points >= 500){

            goldMembers++;

        }
        else if(points >= 100){

            silverMembers++;

        }
        else{

            bronzeMembers++;

        }

        const currentPoints =
        Number(
            user.rewardPoints || 0
        );

        totalRewardRedeemed +=
        Math.max(
            0,
            totalRewardIssued -
            currentPoints
        );

    }
);

orders.forEach(order => {

    if(
        !customerStats[
            order.uid
        ]
    ){

        customerStats[
            order.uid
        ] = {

            spend:0,
            orders:0

        };

    }

    customerStats[
        order.uid
    ].spend +=
    Number(
        order.total || 0
    );

    customerStats[
        order.uid
    ].orders++;

});

users.forEach(user => {

    const uid =
    user.uid || "-";

    const points =
    Number(
        user.rewardPoints || 0
    );

    if(
        points >
        topRewardPoints
    ){

        topRewardPoints =
        points;

        topRewardUid =
        uid;

    }

});

Object.entries(
    customerStats
).forEach(
([uid,data]) => {

    if(
        data.spend >
        topCustomerSpend
    ){

        topCustomerSpend =
        data.spend;

        topCustomerUid =
        uid;

    }

    if(
        data.orders >
        mostActiveOrders
    ){

        mostActiveOrders =
        data.orders;

        mostActiveUid =
        uid;

    }

});

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

                ${pendingClaims}

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

        <div class="card">

    <h3>
        Reward Points Issued
    </h3>

    <div class="card-value">

        ${totalRewardIssued}

    </div>

</div>

<div class="card">

    <h3>
        Reward Points Redeemed
    </h3>

    <div class="card-value">

        ${totalRewardRedeemed}

    </div>

</div>

<div class="card">

    <h3>
        Claims Approved
    </h3>

    <div class="card-value">

        ${approvedClaims}

    </div>

</div>

<div class="card">

    <h3>
        Claims Rejected
    </h3>

    <div class="card-value">

        ${rejectedClaims}

    </div>

</div>

<div class="card">

    <h3>
        Bronze Members
    </h3>

    <div class="card-value">

        ${bronzeMembers}

    </div>

</div>

<div class="card">

    <h3>
        Silver Members
    </h3>

    <div class="card-value">

        ${silverMembers}

    </div>

</div>

<div class="card">

    <h3>
        Gold Members
    </h3>

    <div class="card-value">

        ${goldMembers}

    </div>

</div>

<div class="card">

    <h3>
        Platinum Members
    </h3>

    <div class="card-value">

        ${platinumMembers}

    </div>

</div>

<div class="card">

    <h3>
        Average Order
    </h3>

    <div class="card-value">

        ₹${averageOrder}

    </div>

</div>

<div class="card">

    <h3>
        Highest Order
    </h3>

    <div class="card-value">

        ₹${highestOrder}

    </div>

</div>

<div class="card">

    <h3>
        Lowest Order
    </h3>

    <div class="card-value">

        ₹${lowestOrder}

    </div>

</div>

<div class="card">

    <h3>
        Top Customer
    </h3>

    <div class="card-value">

        ₹${topCustomerSpend}

    </div>

    <small>
        ${topCustomerUid}
    </small>

</div>

<div class="card">

    <h3>
        Most Active Customer
    </h3>

    <div class="card-value">

        ${mostActiveOrders}
    </div>

    <small>
        ${mostActiveUid}
    </small>

</div>

<div class="card">

    <h3>
        Top Reward Holder
    </h3>

    <div class="card-value">

        ${topRewardPoints}
    </div>

    <small>
        ${topRewardUid}
    </small>

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

const recentRewards =
rewardHistory
.slice(-10)
.reverse();

rewardActivityBox.innerHTML = `

<h2>
Recent Reward Activity
</h2>

<br>

${
recentRewards.length === 0
? "<p>No Reward Activity</p>"
: recentRewards.map(reward => `

<div class="activity-item">

    <p>
        Points:
        ${reward.points}
    </p>

    <p>
        Order Total:
        ₹${reward.orderTotal}
    </p>

</div>

`).join("")
}

`;

}

loadDashboard();

