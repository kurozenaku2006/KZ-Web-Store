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
db
}
from "../config/firebase.js";

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

            status:
            "active",

            createdAt:
            new Date().toISOString()
        }
    );

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

}