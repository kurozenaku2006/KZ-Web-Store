import{
collection,
getDocs,
updateDoc,
doc,
addDoc,
query,
where
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import{
auth,
db
}
from "../config/firebase.js";

import{
logActivity
}
from "./activity.js";

const supportRef=
collection(
db,
"support"
);

export async function
createSupportTicket(data){

const user=
auth.currentUser;

await addDoc(
supportRef,
{

uid:user.uid,

email:user.email,

subject:data.subject,

message:data.message,

status:"open",

priority:"Medium",

createdAt:
new Date().toISOString()

}

);

await logActivity({

module:"support",

action:"Ticket Created",

targetName:user.email

});

}

export async function getSupportTickets(){

const snapshot=
await getDocs(
supportRef
);

return snapshot.docs.map(doc=>({

id:doc.id,

...doc.data()

}));

}

export async function
getCustomerSupportTickets(){

const user=
auth.currentUser;

const q=
query(

supportRef,

where(
"uid",
"==",
user.uid
)

);

const snapshot=
await getDocs(q);

return snapshot.docs.map(doc=>({

id:doc.id,

...doc.data()

}));

}

export async function updateSupportStatus(
id,
status
){

await updateDoc(

doc(
db,
"support",
id
),

{

status,

updatedAt:
new Date().toISOString()

}

);

await logActivity({

module:"support",

action:
status==="closed"
?
"Ticket Closed"
:
"Ticket Reopened",

targetId:id,

metadata:{
status
}

});

}

export async function
assignSupportTicket(
id,
admin
){

await updateDoc(

doc(
db,
"support",
id
),

{

assignedTo:admin

}

);

await logActivity({

module:"support",

action:"Ticket Assigned",

targetId:id,

metadata:{
admin
}

});

}