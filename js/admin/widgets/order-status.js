export function orderStatusWidget(data){

return `

<h2>

Order Status Analytics

</h2>

<br>

<div class="activity-item">

<p>

Pending

</p>

<h3>

${data.pendingOrders}

</h3>

</div>

<div class="activity-item">

<p>

Approved

</p>

<h3>

${data.approvedOrders}

</h3>

</div>

<div class="activity-item">

<p>

Shipped

</p>

<h3>

${data.shippedOrders}

</h3>

</div>

<div class="activity-item">

<p>

Delivered

</p>

<h3>

${data.deliveredOrders}

</h3>

</div>

<div class="activity-item">

<p>

Cancelled

</p>

<h3>

${data.cancelledOrders}

</h3>

</div>

`;

}