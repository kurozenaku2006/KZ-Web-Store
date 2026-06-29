import {
collection,
getDocs,
doc,
updateDoc
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

export async function getUsersWithRoles(){

const snapshot =
await getDocs(
usersRef
);

return snapshot.docs.map(doc=>({

id:doc.id,

...doc.data()

}));

}

export async function updateUserRole(
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
role
}
);

}