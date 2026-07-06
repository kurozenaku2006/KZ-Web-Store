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

const actionFilter=
document.getElementById(
"actionFilter"
);

const dateFilter=
document.getElementById(
"dateFilter"
);

const pagination=
document.getElementById(
"activityPagination"
);

let page=1;

const perPage=25;

let logs=[];

async function load(){

logs=
await getActivity();

page=1;

const actions=[

...new Set(

logs.map(log=>

log.action

)

)

].sort();

actionFilter.innerHTML=

'<option value="all">All Actions</option>'+

actions.map(action=>

`<option value="${action}">${action}</option>`

).join("");

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

    (log.module||"")

.toLowerCase()

.includes(keyword)

||

(log.action||"")
.toLowerCase()
.includes(keyword)

||

(log.targetName||"")
.toLowerCase()
.includes(keyword)

||

(log.performedBy||"")

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

if(
actionFilter.value!=="all"
){

data=data.filter(

log=>

log.action===

actionFilter.value

);

}

if(
dateFilter.value
){

data=data.filter(log=>

(log.createdAt||"")

.startsWith(

dateFilter.value

)

);

}

const pages=

Math.max(

1,

Math.ceil(

data.length/

perPage

)

);

if(page>pages){

page=pages;

}

const current=

data.slice(

(page-1)*perPage,

page*perPage

);

activityList.innerHTML=

data.length===0

?

"<p>No Activity</p>"

:

current.map(log=>`

<div class="activity-item">

<b>

${log.action}

</b>

<br>

Module :

${log.module}

<br>

Target :

${log.targetName||"-"}

<br>

Performed By :

${log.performedBy||"-"}

<br>

${new Date(log.createdAt).toLocaleString()}

</div>

`).join("");

pagination.innerHTML=`

<button

${page===1?"disabled":""}

onclick="previousPage()">

Previous

</button>

Page

${page}

/

${pages}

<button

${page===pages?"disabled":""}

onclick="nextPage()">

Next

</button>

`;

}

searchInput.oninput=
render;

moduleFilter.onchange=
render;

actionFilter.onchange=
render;

dateFilter.onchange=
render;

window.previousPage=()=>{

if(page>1){

page--;

render();

}

};

window.nextPage=()=>{

const pages=

Math.max(

1,

Math.ceil(

logs.filter(log=>{

return true;

}).length

/

perPage

)

);

if(page<pages){

page++;

render();

}

};

window.exportActivity=()=>{

const csv=[

"Module,Action,Target,Performed By,Date,Target ID"

];

logs.forEach(log=>{

csv.push(

`"${log.module}","${log.action}","${log.targetName}","${log.performedBy}","${log.createdAt}","${log.targetId}"`

);

});

const blob=

new Blob(

[csv.join("\n")],

{

type:"text/csv"

}

);

const url=

URL.createObjectURL(blob);

const a=

document.createElement("a");

a.href=url;

a.download="activity.csv";

a.click();

URL.revokeObjectURL(url);

};

async function renderStats(){

if(!statsBox){

return;

}

const stats =
await getActivityStatistics();

statsBox.innerHTML=

Object.entries(stats)

.map(

([title,value])=>`

<div class="card">

<h3>

${title.replace("_"," ").toUpperCase()}

</h3>

<div class="card-value">

${value}

</div>

</div>

`

).join("");

}

refreshBtn.onclick =
load;

load();

setInterval(

()=>{

const scroll=

window.scrollY;

load().then(()=>{

window.scrollTo(

0,

scroll

);

});

},

30000

);