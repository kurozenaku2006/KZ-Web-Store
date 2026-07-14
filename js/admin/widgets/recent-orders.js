export function recentOrdersWidget(
orders,
currency
){

return `

<h2>

Recent Orders

</h2>

<br>

${

orders.length===0

?

"<p>No Orders Found</p>"

:

orders.map(order=>`

<div class="activity-item">

<p>

Status:
${order.status}

</p>

<p>

Total:
${currency}${order.total}

</p>

<p>

${order.createdAt}

</p>

</div>

`).join("")

}

`;

}