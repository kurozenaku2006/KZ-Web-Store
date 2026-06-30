import {
    getProducts
}
from "../services/products.js";

import {
    downloadInventoryCSV,
    getInventoryLogs
}
from "../services/inventoryLogs.js";

import {
    bulkUpdateStock
}
from "../services/inventory.js";

const cards =
document.getElementById(
    "cards"
);

const inventoryProducts =
document.getElementById(
    "inventoryProducts"
);

const searchInput =
document.getElementById(
    "searchInput"
);

const statusFilter =
document.getElementById(
    "statusFilter"
);

const stockFilter =
document.getElementById(
    "stockFilter"
);

const sortFilter =
document.getElementById(
    "sortFilter"
);

const exportBtn =
document.getElementById(
    "exportInventoryCSV"
);

const bulkUpdateBtn =
document.getElementById(
    "bulkUpdateBtn"
);

async function loadInventory(){

    const products =
    await getProducts();

    const totalProducts =
    products.length;

    const activeProducts =
    products.filter(
        p => p.status === "active"
    ).length;

    const inactiveProducts =
    products.filter(
        p => p.status === "inactive"
    ).length;

    const lowStock =
    products.filter(
        p => Number(p.stock) > 0 &&
        Number(p.stock) <= 5
    ).length;

    const outOfStock =
    products.filter(
        p => Number(p.stock) === 0
    ).length;

    let inventoryValue = 0;

    products.forEach(product => {

        inventoryValue +=
        Number(product.price || 0) *
        Number(product.stock || 0);

    });

    cards.innerHTML = `

<div class="card">

<h3>Total Products</h3>

<div class="card-value">

${totalProducts}

</div>

</div>

<div class="card">

<h3>Active Products</h3>

<div class="card-value">

${activeProducts}

</div>

</div>

<div class="card">

<h3>Inactive Products</h3>

<div class="card-value">

${inactiveProducts}

</div>

</div>

<div class="card">

<h3>Low Stock</h3>

<div class="card-value">

${lowStock}

</div>

</div>

<div class="card">

<h3>Out Of Stock</h3>

<div class="card-value">

${outOfStock}

</div>

</div>

<div class="card">

<h3>Total Inventory Value</h3>

<div class="card-value">

₹${inventoryValue}

</div>

</div>

`;

let filteredProducts =
[...products];

const keyword =
searchInput.value
.toLowerCase();

if(keyword){

filteredProducts =
filteredProducts.filter(
product =>
product.name
.toLowerCase()
.includes(keyword)
);

}

if(
statusFilter.value !==
"all"
){

filteredProducts =
filteredProducts.filter(
product =>
product.status ===
statusFilter.value
);

}

if(
stockFilter.value ===
"low"
){

filteredProducts =
filteredProducts.filter(
product =>
product.stock > 0 &&
product.stock <= 5
);

}

if(
stockFilter.value ===
"out"
){

filteredProducts =
filteredProducts.filter(
product =>
product.stock == 0
);

}

if(
sortFilter.value ===
"name"
){

filteredProducts.sort(
(a,b)=>
a.name.localeCompare(
b.name
)
);

}

if(
sortFilter.value ===
"price"
){

filteredProducts.sort(
(a,b)=>
a.price-b.price
);

}

if(
sortFilter.value ===
"stock"
){

filteredProducts.sort(
(a,b)=>
a.stock-b.stock
);

}

    inventoryProducts.innerHTML = `

<h2>

Inventory Products

</h2>

<br>

${
filteredProducts.length === 0

?

"<p>No Products Found</p>"

:

filteredProducts.map(product => `

<div class="activity-item">

<strong>

${product.name}

</strong>

<br>

Price :
₹${product.price}

<br>

Stock :
${product.stock}

<br>

Status :
${product.status}

</div>

`).join("")
}

`;

}

async function exportCSV(){

    exportBtn.disabled = true;

    exportBtn.textContent =
    "Exporting...";

    try{

        const logs =
        await getInventoryLogs();

        downloadInventoryCSV(
            logs,
            "inventory-history.csv"
        );

    }
    catch(error){

        console.error(error);

        alert(
            "Failed to export inventory history."
        );

    }

    exportBtn.disabled = false;

    exportBtn.textContent =
    "Export CSV";

}

async function runBulkUpdate(){

    const ids =
    prompt(
        "Format:\nproductId:stock,productId:stock"
    );

    if(!ids){

        return;

    }

    const updates =
    ids.split(",")
    .map(item=>{

        const parts =
        item.split(":");

        return{
            productId:
            parts[0].trim(),
            stock:
            Number(parts[1])
        };

    })
    .filter(
        item=>
        item.productId &&
        !isNaN(item.stock)
    );

    if(updates.length===0){

        alert(
            "Invalid format."
        );

        return;

    }

    await bulkUpdateStock(
        updates
    );

    alert(
        "Bulk update completed."
    );

    loadInventory();

}

loadInventory();

searchInput.oninput =
loadInventory;

statusFilter.onchange =
loadInventory;

stockFilter.onchange =
loadInventory;

exportBtn.onclick =
exportCSV;

bulkUpdateBtn.onclick =
runBulkUpdate;

sortFilter.onchange =
loadInventory;