import {
    addProduct,
    getProducts,
    deleteProduct,
    updateProduct
}
from "../services/products.js";

const addBtn =
document.getElementById("addBtn");

const productsList =
document.getElementById("productsList");

async function loadProducts(){

    const products =
    await getProducts();

    productsList.innerHTML = "";

    products.forEach(product => {

        const lowStock =
        product.stock <= 5
        ? "⚠ LOW STOCK"
        : "";

        productsList.innerHTML += `

        <div class="card">

            <h3>
                ${product.name}
            </h3>

            <p>
                ₹${product.price}
            </p>

            <p>
                Stock:
                ${product.stock}
                ${lowStock}
            </p>

            <p>
                Status:
                ${product.status}
            </p>

            <button
            onclick="editProduct('${product.id}')">

                Edit

            </button>

            <button
            onclick="toggleStatus(
                '${product.id}',
                '${product.status}'
            )">

                Toggle Status

            </button>

            <button
            onclick="removeProduct('${product.id}')">

                Delete

            </button>

        </div>

        `;

    });

}

window.removeProduct =
async function(id){

    const confirmDelete =
    confirm("Delete Product?");

    if(!confirmDelete) return;

    await deleteProduct(id);

    loadProducts();

}

window.editProduct =
async function(id){

    const newName =
    prompt(
        "Enter New Product Name"
    );

    if(!newName) return;

    await updateProduct(id,{
        name:newName
    });

    loadProducts();

}

window.toggleStatus =
async function(
    id,
    currentStatus
){

    const newStatus =
    currentStatus === "active"
    ? "inactive"
    : "active";

    await updateProduct(id,{
        status:newStatus
    });

    loadProducts();

}

addBtn.addEventListener(
"click",
async ()=>{

    const name =
    document.getElementById("name").value;

    const price =
    Number(
    document.getElementById("price").value
    );

    const stock =
    Number(
    document.getElementById("stock").value
    );

    if(
        !name ||
        !price ||
        stock < 0
    ){
        alert(
            "Please fill all fields"
        );
        return;
    }

    await addProduct({

        name,
        price,
        stock,

        status:"active"

    });

    document.getElementById(
        "name"
    ).value = "";

    document.getElementById(
        "price"
    ).value = "";

    document.getElementById(
        "stock"
    ).value = "";

    loadProducts();

});

loadProducts();