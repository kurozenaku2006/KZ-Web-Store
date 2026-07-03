import {
collection,
addDoc,
getDocs,
query,
orderBy,
where
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
db
}
from "../config/firebase.js";

const activityRef =
collection(
db,
"activity"
);

export async function logActivity({

module,

action,

targetId = "",

targetName = "",

performedBy = "Admin",

metadata = {}

}){

await addDoc(
activityRef,
{

module,

action,

targetId,

targetName,

performedBy,

metadata,

createdAt:
new Date().toISOString(),

day:
new Date().toISOString().split("T")[0],

time:
new Date().toLocaleTimeString()

}
);

}

export async function getActivity(){

const q =
query(
activityRef,
orderBy(
"createdAt",
"desc"
)
);

const snapshot =
await getDocs(q);

return snapshot.docs.map(
doc=>({

id:doc.id,

...doc.data()

})
);

}

export async function getActivityByModule(
module
){

const q =
query(
activityRef,
where(
"module",
"==",
module
),
orderBy(
"createdAt",
"desc"
)
);

const snapshot =
await getDocs(q);

return snapshot.docs.map(
doc=>({

id:doc.id,

...doc.data()

})
);

}

export async function getActivityByUser(
performedBy
){

const q =
query(
activityRef,
where(
"performedBy",
"==",
performedBy
),
orderBy(
"createdAt",
"desc"
)
);

const snapshot =
await getDocs(q);

return snapshot.docs.map(
doc=>({

id:doc.id,

...doc.data()

})
);

}

export async function getRecentActivity(
limitCount = 50
){

const activity =
await getActivity();

return activity.slice(
0,
limitCount
);

}

export async function searchActivity(
keyword
){

const activity =
await getActivity();

const search =
keyword.toLowerCase();

return activity.filter(item=>

(item.module||"")
.toLowerCase()
.includes(search)

||

(item.action||"")
.toLowerCase()
.includes(search)

||

(item.targetName||"")
.toLowerCase()
.includes(search)

||

(item.performedBy||"")
.toLowerCase()
.includes(search)

);

}

export async function getActivityStatistics(){

const activity =
await getActivity();

const stats={};

activity.forEach(item=>{

stats[item.module]??=0;

stats[item.module]++;

});

return stats;

}