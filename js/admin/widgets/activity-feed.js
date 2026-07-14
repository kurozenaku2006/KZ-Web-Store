export function activityFeedWidget(

activity

){

return `

<h2>

Recent Activity

</h2>

<br>

${

activity.length===0

?

"<p>No Activity</p>"

:

activity.map(log=>`

<div class="activity-item">

<p>

${log.action||"-"}

</p>

<small>

${log.module||"-"}

</small>

</div>

`).join("")

}

`;

}