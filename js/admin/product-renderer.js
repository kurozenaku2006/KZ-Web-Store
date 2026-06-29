export function renderProducts(
    products,
    container
){

    container.innerHTML = "";

    if(products.length === 0){

        container.innerHTML = `
        <div class="card">
            <h3>No Products Found</h3>
        </div>
        `;

        return;

    }

    products.forEach(product=>{

        let stockStatus = "";

        if(Number(product.stock) === 0){

            stockStatus = "❌ OUT OF STOCK";

        }
        else if(Number(product.stock) <= 5){

            stockStatus = "⚠ LOW STOCK";

        }
        else{

            stockStatus = "✅ IN STOCK";

        }

        container.innerHTML += `

<div class="card">

<h3>${product.name}</h3>

<p>
<strong>Price:</strong>
₹${product.price}
</p>

<p>
<strong>Stock:</strong>
${product.stock}
</p>

<p>
${stockStatus}
</p>

<p>
<strong>Status:</strong>
${product.status}
</p>

<p>
<strong>Last Updated</strong><br>
${product.lastUpdated || "-"}
</p>

<hr>

<div class="product-actions">

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
onclick="restockProduct(
'${product.id}',
10
)">
+10
</button>

<button
onclick="restockProduct(
'${product.id}',
50
)">
+50
</button>

<button
onclick="restockProduct(
'${product.id}',
100
)">
+100
</button>

<button
onclick="reduceStock(
'${product.id}'
)">
Reduce
</button>

<button
onclick="showInventoryHistory(
'${product.id}'
)">
History
</button>

<button
onclick="removeProduct(
'${product.id}'
)">
Delete
</button>

</div>

</div>

`;

    });

}