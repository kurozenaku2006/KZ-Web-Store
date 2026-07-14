export function rewardActivityWidget(

history,

currency

){

return `

<h2>

Recent Reward Activity

</h2>

<br>

${

history.length===0

?

"<p>No Reward Activity</p>"

:

history.map(item=>`

<div class="activity-item">

<p>

Points:
${item.points}

</p>

<p>

Order Total:
${currency}${item.orderTotal}

</p>

</div>

`).join("")

}

`;

}