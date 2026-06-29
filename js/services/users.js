import {
collection,
getDocs,
doc,
updateDoc,
deleteDoc
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
db
}
from "../config/firebase.js";

const usersRef =
collection(
db,
"users"
);

export async function getUsers(){

const snapshot =
await getDocs(
usersRef
);

return snapshot.docs.map(doc=>({

id:doc.id,

...doc.data()

}));

}

export async function updateUser(
id,
data
){

await updateDoc(
doc(
db,
"users",
id
),
data
);

}

export async function toggleUserStatus(
id,
active
){

await updateDoc(
doc(
db,
"users",
id
),
{
active
}
);

}

export async function deleteUser(
id
){

await deleteDoc(
doc(
db,
"users",
id
));

}