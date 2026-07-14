import{
collection,
addDoc,
getDocs,
query,
where,
doc,
updateDoc,
orderBy
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import{
db,
auth
}
from "../config/firebase.js";

const reviewsRef=
collection(
db,
"reviews"
);

const questionsRef=
collection(
db,
"productQuestions"
);

export async function addReview(data){

const user=
auth.currentUser;

if(!user){

throw new Error(
"Login required."
);

}

await addDoc(
reviewsRef,
{
uid:user.uid,
productId:data.productId,
rating:Number(data.rating),
review:data.review.trim(),
status:"pending",
adminReply:"",
createdAt:new Date().toISOString()
}
);

}

export async function getProductReviews(
productId,
sort="newest"
){

const snapshot=
await getDocs(
query(
reviewsRef,
where(
"productId",
"==",
productId
)
)
);

const reviews=

snapshot.docs
.map(doc=>({

id:doc.id,

...doc.data()

}))
.filter(
review=>
review.status==="approved"
);

if(sort==="highest"){

reviews.sort(
(a,b)=>
b.rating-a.rating
);

}

else if(sort==="lowest"){

reviews.sort(
(a,b)=>
a.rating-b.rating
);

}

else{

reviews.sort(
(a,b)=>

new Date(b.createdAt)-new Date(a.createdAt)

);

}

return reviews;

}

export async function getAllReviews(){

const snapshot=
await getDocs(
query(
reviewsRef,
orderBy(
"createdAt",
"desc"
)
)
);

return snapshot.docs.map(doc=>({

id:doc.id,

...doc.data()

}));

}

export async function updateReview(
id,
data
){

await updateDoc(
doc(
db,
"reviews",
id
),
data
);

}

export async function askQuestion(data){

const user=
auth.currentUser;

if(!user){

throw new Error(
"Login required."
);

}

await addDoc(
questionsRef,
{
uid:user.uid,
productId:data.productId,
question:data.question,
answer:"",
status:"open",
createdAt:new Date().toISOString()
}
);

}

export async function getQuestions(
productId
){

const snapshot=
await getDocs(
query(
questionsRef,
where(
"productId",
"==",
productId
)
)
);

return snapshot.docs.map(doc=>({

id:doc.id,

...doc.data()

}));

}

export async function answerQuestion(
id,
answer
){

await updateDoc(
doc(
db,
"productQuestions",
id
),
{
answer,
status:"answered"
}
);

}

export async function getAllQuestions(){

const snapshot=
await getDocs(
query(
questionsRef,
orderBy(
"createdAt",
"desc"
)
)
);

return snapshot.docs.map(doc=>({

id:doc.id,

...doc.data()

}));

}

export async function replyQuestion(
id,
answer
){

await updateDoc(
doc(
db,
"productQuestions",
id
),
{
answer,
status:"answered"
}
);

}

export async function getMyReviews(){

const user=
await getCurrentUser();

const snapshot=
await getDocs(
query(
reviewsRef,
where(
"uid",
"==",
user.uid
)
)
);

return snapshot.docs.map(doc=>({

id:doc.id,

...doc.data()

}));

}