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

export async function createNotification(data){

await addDoc(
notificationsRef,
{
title:data.title,
message:data.message,
type:data.type || "general",
target:data.target || "all",
status:"active",
createdAt:new Date().toISOString()
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