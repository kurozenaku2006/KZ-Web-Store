import{
collection,
getDocs,
updateDoc,
doc
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import{
db
}
from "../config/firebase.js";

const supportRef=
collection(
db,
"support"
);

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
status
}

);

}