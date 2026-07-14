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

priority:
data.priority ||
"Medium",

createdAt:
new Date().toISOString()

}

);

const snapshot=
await getDocs(
query(
supportRef,
where(
"uid",
"==",
user.uid
)
)
);

const newest=
snapshot.docs
.at(-1);

if(newest){

await addSupportTimeline(
newest.id,
"Ticket Created"
);

}

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

await addSupportTimeline(

id,

status==="closed"
?
"Ticket Closed"
:
"Ticket Reopened"

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

await addSupportTimeline(

id,

"Assigned to "+admin

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

export async function
updateSupportPriority(
id,
priority
){

await updateDoc(

doc(
db,
"support",
id
),

{

priority,

updatedAt:
new Date().toISOString()

}

);

await addSupportTimeline(

id,

"Priority changed to "+priority

);

await logActivity({

module:"support",

action:"Priority Changed",

targetId:id,

metadata:{
priority
}

});

}

export async function
addSupportReply(
id,
reply
){

const tickets=
await getSupportTickets();

const ticket=
tickets.find(
t=>t.id===id
);

if(!ticket){

return;

}

const replies=
ticket.replies||[];

replies.push({

message:reply,

sender:
auth.currentUser?.email||"Customer",

createdAt:
new Date().toISOString()

});

await updateDoc(

doc(
db,
"support",
id
),

{

replies,

updatedAt:
new Date().toISOString()

}

);

await addSupportTimeline(

id,

"Reply Added"

);

await logActivity({

module:"support",

action:"Reply Added",

targetId:id

});

}

export async function
addSupportNote(
id,
note
){

const tickets=
await getSupportTickets();

const ticket=
tickets.find(
t=>t.id===id
);

if(!ticket){

return;

}

const notes=
ticket.adminNotes||[];

notes.push({

note,

admin:
auth.currentUser?.email||"Admin",

createdAt:
new Date().toISOString()

});

await updateDoc(

doc(
db,
"support",
id
),

{

adminNotes:notes,

updatedAt:
new Date().toISOString()

}

);

await addSupportTimeline(

id,

"Internal Note Added"

);

await logActivity({

module:"support",

action:"Admin Note Added",

targetId:id

});

}

export async function
addSupportTimeline(
id,
event
){

const tickets=
await getSupportTickets();

const ticket=
tickets.find(
t=>t.id===id
);

if(!ticket){

return;

}

const timeline=
ticket.timeline||[];

timeline.push({

event,

user:
auth.currentUser?.email||"System",

createdAt:
new Date().toISOString()

});

await updateDoc(

doc(
db,
"support",
id
),

{

timeline,

updatedAt:
new Date().toISOString()

}

);

}