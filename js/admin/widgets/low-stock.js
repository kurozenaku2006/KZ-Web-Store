export function lowStockWidget(

products,

limit

){

return `

<h2>

Low Stock Products

</h2>

<br>

${

products.length===0

?

"<p>No Low Stock Products</p>"

:

products.map(product=>`

<div class="activity-item">

<p>

${product.name}

</p>

<p>

Stock:
${product.stock}

<small>

Alert:
${limit}

</small>

</p>

</div>

`).join("")

}

`;

}