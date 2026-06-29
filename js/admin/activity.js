import {

getActivity,

getActivityStatistics

}
from "../services/activity.js";

const activityList =
document.getElementById(
"activityList"
);

const searchInput =
document.getElementById(
"searchInput"
);

const moduleFilter =
document.getElementById(
"moduleFilter"
);

const refreshBtn =
document.getElementById(
"refreshActivity"
);

const statsBox =
document.getElementById(
"activityStats"
);

let logs=[];

async function load(){

logs =
await getActivity();

render();

await renderStats();

}

function render(){

let data=[...logs];

const keyword=
searchInput.value
.toLowerCase();

if(keyword){

data=data.filter(
log=>

(log.action||"")
.toLowerCase()
.includes(keyword)

||

(log.targetName||"")
.toLowerCase()
.includes(keyword)

);

}

if(
moduleFilter.value!=="all"
){

data=data.filter(
log=>
log.module===
moduleFilter.value
);

}

activityList.innerHTML=

data.length===0

?

"<p>No Activity</p>"

:

data.map(log=>`

<div class="activity-item">

<b>

${log.module}

</b>

<br>

${log.action}

<br>

${log.targetName}

<br>

${log.performedBy}

<br>

${new Date(
log.createdAt
).toLocaleString()}

</div>

`).join("");

}

searchInput.oninput=
render;

moduleFilter.onchange=
render;

async function renderStats(){

if(!statsBox){

return;

}

const stats =
await getActivityStatistics();

statsBox.innerHTML =

Object.keys(stats).length===0

?

"<p>No Statistics</p>"

:

Object.entries(stats)

.map(

([module,count])=>`

<div class="card">

<h3>

${module}

</h3>

<div class="card-value">

${count}

</div>

</div>

`

)

.join("");

}

refreshBtn.onclick =
load;

load();

setInterval(

load,

30000

);