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