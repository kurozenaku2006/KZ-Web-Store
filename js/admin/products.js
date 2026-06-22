import {
addProduct,
getProducts
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
            </p>

        </div>

        `;

    });

}

addBtn.addEventListener(
"click",
async ()=>{

    await addProduct({

        name:
        document.getElementById("name").value,

        price:
        Number(
        document.getElementById("price").value
        ),

        stock:
        Number(
        document.getElementById("stock").value
        ),

        status:"active"

    });

    loadProducts();

});

loadProducts();