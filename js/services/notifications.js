import {
collection,
addDoc,
getDocs,
doc,
updateDoc,
deleteDoc,
query,
orderBy
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
auth,
db
}
from "../config/firebase.js";

import {
logActivity
}
from "./activity.js";

const notificationsRef =
collection(
db,
"notifications"
);

export async function createNotification(
    data
){

    if(
        !data.title?.trim() ||
        !data.message?.trim()
    ){

        throw new Error(
            "Invalid notification."
        );

    }

    if(

data.channel==="email"

&&

!data.customerUid

){

// ready for bulk email

}

if(

data.channel==="sms"

&&

!data.customerUid

){

// ready for bulk sms

}

if(

data.channel==="push"

&&

!data.customerUid

){

// ready for push service

}

    await addDoc(
        notificationsRef,
        {
            title:
            data.title.trim(),

            message:
            data.message.trim(),

            type:
            data.type ||
            "general",

            target:
            data.target ||
            "all",

            customerUid:
data.customerUid || "",

channel:

data.channel ||

"inapp",

priority:

data.priority ||

"normal",

deliveryStatus:

"pending",

deliveryAttempts:

0,

lastDeliveryAttempt:

"",

emailReady:

data.channel==="email"

||

data.channel==="all",

smsReady:

data.channel==="sms"

||

data.channel==="all",

pushReady:

data.channel==="push"

||

data.channel==="all",

scheduleAt:
data.scheduleAt || "",

read:false,

archived:false,

            status:
            "active",

            createdAt:
            new Date().toISOString()
        }
    );



    await logActivity({

module:"notifications",

action:"Notification Sent",

targetName:
data.target,

metadata:{

title:data.title,

customerUid:
data.customerUid || "",

scheduleAt:
data.scheduleAt || ""

}

});

}

export async function getNotifications(){

const q =
query(
notificationsRef,
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

export async function
getCustomerNotifications(){

const snapshot=
await getDocs(
notificationsRef
);

const uid=
auth.currentUser?.uid;

return snapshot.docs
.map(doc=>({

id:doc.id,

...doc.data()

}))
.filter(item=>

!item.archived

&&

(

item.target==="all"

||

item.target==="customers"

||

item.customerUid===uid

)

);

}

export async function updateNotification(
id,
data
){

await updateDoc(
doc(
db,
"notifications",
id
),
{
...data
}
);

}

export async function markNotificationDelivered(

id,

channel

){

await updateNotification(

id,

{

deliveryStatus:

"delivered",

deliveryChannel:

channel,

deliveryAttempts:1,

lastDeliveryAttempt:

new Date().toISOString()

}

);

}

export async function markNotificationFailed(

id,

reason

){

const notifications=

await getNotifications();

const notification=

notifications.find(

item=>

item.id===id

);

await updateNotification(

id,

{

deliveryStatus:

"failed",

failureReason:

reason,

deliveryAttempts:

Number(

notification?.deliveryAttempts||0

)+1,

lastDeliveryAttempt:

new Date().toISOString()

}

);

}

export async function deleteNotification(
id
){

await deleteDoc(
doc(
db,
"notifications",
id
)
);

await logActivity({

module:"notifications",

action:"Notification Deleted",

targetId:id

});

}

const notificationPreferencesRef=
collection(
db,
"notificationPreferences"
);

export async function saveNotificationPreferences(

uid,

preferences

){

const snapshot=
await getDocs(
notificationPreferencesRef
);

const existing=
snapshot.docs.find(doc=>

doc.data().uid===uid

);

if(existing){

await updateDoc(

doc(
db,
"notificationPreferences",
existing.id
),

preferences

);

return;

}

await addDoc(

notificationPreferencesRef,

{

uid,

...preferences,

updatedAt:
new Date().toISOString()

}

);

}

export async function getNotificationPreferences(uid){

const snapshot=
await getDocs(
notificationPreferencesRef
);

const item=
snapshot.docs.find(doc=>

doc.data().uid===uid

);

if(!item){

return{

inApp:true,

email:false,

sms:false,

push:false

};

}

return item.data();

}