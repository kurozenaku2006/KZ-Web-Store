import {
authListener,
getUserData
}
from "../services/auth.js";

import {
getRewardHistory
}
from "../services/rewards.js";

const summary=
document.getElementById(
"rewardSummary"
);

const history=
document.getElementById(
"rewardHistory"
);

authListener(async user=>{

if(!user){

summary.innerHTML="<p>Please login.</p>";
return;

}

const profile=
await getUserData(
user.uid
);

const logs=
await getRewardHistory(
user.uid
);

summary.innerHTML=`

<div class="card">

<h2>

Reward Points

</h2>

<div class="card-value">

${profile.rewardPoints||0}

</div>

</div>

`;

history.innerHTML=`

<h2>

Reward History

</h2>

<br>

${
logs.length===0

?

"<p>No Reward History</p>"

:

logs.map(log=>`

<div class="card">

<p>

${log.type}

</p>

<p>

${log.points}

Points

</p>

<p>

₹${log.orderTotal}

</p>

<p>

${new Date(
log.createdAt
).toLocaleString()}

</p>

</div>

<br>

`).join("")

}

`;

});