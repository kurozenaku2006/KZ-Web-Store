export function rewardAnalyticsWidget(data){

return `

<h2>

Reward Analytics

</h2>

<br>

<div class="activity-item">

<p>

Reward Balance

</p>

<h3>

${data.rewardUsage}

</h3>

</div>

<div class="activity-item">

<p>

Top Holder

</p>

<h3>

${data.topRewardPoints}

</h3>

<small>

${data.topRewardUid}

</small>

</div>

`;

}