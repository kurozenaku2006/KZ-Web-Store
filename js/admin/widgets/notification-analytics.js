export function notificationAnalyticsWidget(data){

return `

<h2>

Notification Analytics

</h2>

<br>

<div class="activity-item">

<p>

Total

</p>

<h3>

${data.totalNotifications}

</h3>

</div>

<div class="activity-item">

<p>

Unread

</p>

<h3>

${data.unreadNotifications}

</h3>

</div>

<div class="activity-item">

<p>

Scheduled

</p>

<h3>

${data.scheduledNotifications}

</h3>

</div>

<div class="activity-item">

<p>

Archived

</p>

<h3>

${data.archivedNotifications}

</h3>

</div>

`;

}