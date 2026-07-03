import {
collection,
getDocs,
doc,
updateDoc,
deleteDoc,
addDoc,
query,
where,
orderBy,
deleteDoc as removeDoc
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
db
}
from "../config/firebase.js";

export async function getCustomers(){

const users=
await getDocs(
collection(
db,
"users"
)
);

const orders=
await getDocs(
collection(
db,
"orders"
)
);

const claims=
await getDocs(
collection(
db,
"claims"
)
);

const orderList=
orders.docs.map(doc=>doc.data());

const claimList=
claims.docs.map(doc=>doc.data());

return users.docs
.map(doc=>({

id:doc.id,

...doc.data()

}))
.filter(user=>
user.role==="customer"
)
.map(user=>{

const customerOrders=
orderList.filter(
order=>
order.uid===user.uid
);

const customerClaims=
claimList.filter(
claim=>
claim.uid===user.uid
);

const spend=
customerOrders.reduce(
(total,order)=>
total+
Number(
order.total||0
),
0
);

const deliveredOrders=
customerOrders.filter(
order=>
order.status==="delivered"
);

const pendingOrders=
customerOrders.filter(
order=>
order.status==="pending"
);

const cancelledOrders=
customerOrders.filter(
order=>

order.status==="cancelled"

||

order.status==="rejected"
);

const largestOrder=

customerOrders.length

?

Math.max(

...customerOrders.map(order=>

Number(order.total||0)

)

)

:

0;

const averageOrder=

customerOrders.length

?

Math.round(

spend/

customerOrders.length

)

:

0;

const firstOrder=

customerOrders.length

?

customerOrders
.slice()
.sort(

(a,b)=>

new Date(a.createdAt)-

new Date(b.createdAt)

)[0].createdAt

:

null;

const lastOrder=

customerOrders.length

?

customerOrders
.slice()
.sort(

(a,b)=>

new Date(b.createdAt)-

new Date(a.createdAt)

)[0].createdAt

:

null;

let customerTier="Bronze";

let customerRisk="Low";

if(
cancelledOrders.length>=3
){

customerRisk="High";

}
else if(
cancelledOrders.length>=1
){

customerRisk="Medium";

}

if(spend>=5000){

customerTier="Silver";

}

if(spend>=15000){

customerTier="Gold";

}

if(spend>=50000){

customerTier="Platinum";

}

return{

...user,

totalOrders:
customerOrders.length,

totalSpend:
spend,

totalClaims:
customerClaims.length,

averageOrder,

largestOrder,

pendingOrders:
pendingOrders.length,

deliveredOrders:
deliveredOrders.length,

cancelledOrders:
cancelledOrders.length,

firstOrder,

lastOrder,

customerTier,

customerRisk

};

});

}

export async function getCustomerStatistics(){

const customers=
await getCustomers();

let totalSpend=0;
let totalOrders=0;
let totalClaims=0;
let totalRewardPoints=0;

let highestSpend=0;
let highestRewardPoints=0;

let activeCustomers=0;
let disabledCustomers=0;

let customersWithOrders=0;
let customersWithoutOrders=0;

let totalRewardBalance=0;

customers.forEach(customer=>{

const spend=
Number(
customer.totalSpend||0
);

const rewards=
Number(
customer.rewardPoints||0
);

totalRewardBalance+=rewards;

if(
(customer.status||"active")==="active"
){

activeCustomers++;

}
else{

disabledCustomers++;

}

if(
customer.totalOrders>0
){

customersWithOrders++;

}
else{

customersWithoutOrders++;

}

totalSpend+=spend;

totalOrders+=
Number(
customer.totalOrders||0
);

totalClaims+=
Number(
customer.totalClaims||0
);

totalRewardPoints+=
rewards;

if(
customer.status==="disabled"
){

disabledCustomers++;

}
else{

activeCustomers++;

}

if(
spend>
highestSpend
){

highestSpend=
spend;

}

if(
rewards>
highestRewardPoints
){

highestRewardPoints=
rewards;

}

});

const activeCustomers =
customers.filter(
customer=>
(customer.status||"active")==="active"
).length;

const disabledCustomers =
customers.filter(
customer=>
customer.status==="disabled"
).length;

return{

totalCustomers:
customers.length,

activeCustomers,

disabledCustomers,

customersWithOrders,

customersWithoutOrders,

totalOrders,

totalClaims,

totalSpend,

totalRewardPoints,

totalRewardBalance,

highestSpend,

highestRewardPoints,

averageSpend:

customers.length

?

Math.round(
totalSpend/
customers.length
)

:

0

};

}

export async function getCustomerDetails(uid){

const customers=
await getCustomers();

const customer=
customers.find(
user=>
user.uid===uid
);

if(!customer){

return null;

}

const orders=
await getDocs(
collection(
db,
"orders"
)
);

const claims=
await getDocs(
collection(
db,
"claims"
)
);

const rewardHistory=
await getDocs(
collection(
db,
"rewardHistory"
)
);

const customerOrders=
orders.docs
.map(doc=>({

id:doc.id,

...doc.data()

}))
.filter(
order=>
order.uid===uid
);

const customerClaims=
claims.docs
.map(doc=>({

id:doc.id,

...doc.data()

}))
.filter(
claim=>
claim.uid===uid
);

const rewards=
rewardHistory.docs
.map(doc=>({

id:doc.id,

...doc.data()

}))
.filter(
reward=>
reward.uid===uid
);

const activity=[];

customerOrders.forEach(order=>{

activity.push({

type:"order",

status:order.status,

amount:Number(order.total||0),

date:order.createdAt

});

});

customerClaims.forEach(claim=>{

activity.push({

type:"claim",

status:claim.status,

date:claim.createdAt

});

});

rewards.forEach(reward=>{

activity.push({

type:"reward",

rewardType:reward.type,

points:Number(reward.points||0),

date:reward.createdAt

});

});

activity.sort(

(a,b)=>

new Date(b.date)-

new Date(a.date)

);

const activity=[

...customerOrders.map(order=>({

type:"order",

date:order.createdAt,

status:order.status,

amount:order.total

})),

...customerClaims.map(claim=>({

type:"claim",

date:claim.createdAt,

status:claim.status

})),

...rewards.map(reward=>({

type:"reward",

date:reward.createdAt,

points:reward.points,

rewardType:reward.type

}))

].sort(

(a,b)=>

new Date(b.date)-

new Date(a.date)

);

const activity = [

...customerOrders.map(order=>({

type:"order",

status:order.status,

amount:order.total,

date:order.createdAt

})),

...customerClaims.map(claim=>({

type:"claim",

status:claim.status,

date:claim.createdAt

})),

...rewards.map(reward=>({

type:"reward",

rewardType:reward.type,

points:reward.points,

date:reward.createdAt

}))

].sort(

(a,b)=>

new Date(b.date)-new Date(a.date)

);

return{

customer,

orders:customerOrders,

claims:customerClaims,

rewards,

activity

};

}

export async function updateCustomerStatus(
id,
status
){

await updateDoc(

doc(
db,
"users",
id
),

{
status
}

);

}

export async function deleteCustomer(
id
){

await deleteDoc(

doc(
db,
"users",
id
)

);

}

export async function updateCustomer(
id,
data
){

await updateDoc(

doc(
db,
"users",
id
),

{

...data,

updatedAt:
new Date().toISOString()

}

);

}

export async function updateCustomerRole(
id,
role
){

await updateDoc(

doc(
db,
"users",
id
),

{

role,

updatedAt:
new Date().toISOString()

}

);

}

export async function getCustomerNotes(uid){

const snapshot=
await getDocs(

query(

customerNotesRef,

where(
"uid",
"==",
uid
),

orderBy(
"createdAt",
"desc"
)

)

);

return snapshot.docs.map(doc=>({

id:doc.id,

...doc.data()

}));

}

export async function addCustomerNote(
uid,
note
){

if(
!note.trim()
){

return;

}

await addDoc(

customerNotesRef,

{

uid,

note,

createdAt:
new Date().toISOString()

}

);

}

export async function deleteCustomerNote(
id
){

await removeDoc(

doc(
db,
"customerNotes",
id
)

);

}

export async function getCustomerNotes(uid){

const snapshot=
await getDocs(

query(

collection(
db,
"customerNotes"
),

where(
"uid",
"==",
uid
)

)

);

return snapshot.docs
.map(doc=>({

id:doc.id,

...doc.data()

}))
.sort(

(a,b)=>

new Date(b.createdAt)-

new Date(a.createdAt)

);

}

export async function addCustomerNote(

uid,
note

){

if(!note.trim()){

return;

}

await addDoc(

collection(
db,
"customerNotes"
),

{

uid,

note,

createdAt:
new Date().toISOString()

}

);

}

const customerNotesRef=
collection(
db,
"customerNotes"
);