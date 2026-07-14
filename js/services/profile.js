import{
collection,
getDocs,
doc,
updateDoc,
deleteField
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import{
getAuth
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import{
db
}
from "../config/firebase.js";

export async function getCustomerCenter(){

const auth=
getAuth();

const uid=
auth.currentUser?.uid;

if(!uid){

return null;

}

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

const products=
await getDocs(
collection(
db,
"products"
)
);

const user=
users.docs
.map(doc=>({

id:doc.id,
...doc.data()

}))
.find(user=>user.uid===uid);

const customerOrders=
orders.docs
.map(doc=>doc.data())
.filter(order=>order.uid===uid);

const customerClaims=
claims.docs
.map(doc=>doc.data())
.filter(claim=>claim.uid===uid);

const wishlist=
products.docs
.map(doc=>({

id:doc.id,
...doc.data()

}))
.filter(product=>

(product.wishlist||[])
.includes(uid)

);

return{

user,

orders:
customerOrders,

claims:
customerClaims,

wishlist,

addresses:
user?.addresses||[]

};

}

export async function updateProfileName(
name
){

const auth=
getAuth();

const uid=
auth.currentUser.uid;

const users=
await getDocs(
collection(
db,
"users"
)
);

const user=
users.docs.find(
doc=>
doc.data().uid===uid
);

if(!user){

return;

}

await updateDoc(

doc(
db,
"users",
user.id
),

{
name
}

);

}

export async function addAddress(
address
){

const auth=
getAuth();

const uid=
auth.currentUser.uid;

const users=
await getDocs(
collection(
db,
"users"
)
);

const user=
users.docs.find(
doc=>
doc.data().uid===uid
);

if(!user){

return;

}

const data=
user.data();

const addresses=
data.addresses||[];

addresses.push(
address
);

await updateDoc(

doc(
db,
"users",
user.id
),

{
addresses
}

);

}

export async function clearWishlist(){

const auth=
getAuth();

const uid=
auth.currentUser.uid;

const users=
await getDocs(
collection(
db,
"users"
)
);

const user=
users.docs.find(
doc=>
doc.data().uid===uid
);

if(!user){

return;

}

await updateDoc(

doc(
db,
"users",
user.id
),

{

wishlist:[]

}

);

}