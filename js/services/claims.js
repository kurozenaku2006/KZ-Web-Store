import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    query,
    where,
    doc,
    updateDoc,
    deleteDoc,
    orderBy
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    auth,
    db
}
from "../config/firebase.js";

import {
    logActivity
}
from "./activity.js";

const claimsRef =
collection(
    db,
    "claims"
);

const claimNotesRef =
collection(
    db,
    "claimNotes"
);

const claimTimelineRef =
collection(
    db,
    "claimTimeline"
);

function getCurrentUser(){

    return new Promise(resolve=>{

        const unsubscribe =
        onAuthStateChanged(
            auth,
            user=>{

                unsubscribe();
                resolve(user);

            }
        );

    });

}

export async function createClaim(claim){

    const user =
    await getCurrentUser();

    if(!user){

        alert("Please Login");
        return;

    }

    const createdAt =
new Date().toISOString();

const claimRef =
await addDoc(
claimsRef,
{
...claim,
uid:user.uid,
status:"pending",
createdAt
}
);

await addTimelineEvent(

claimRef.id,

"Claim Created",

user.uid,

{

status:"pending"

}

);

await logActivity({

module:"claims",

action:"Claim Created",

targetId:claimRef.id,

targetName:user.uid,

metadata:claim

});

}

export async function getUserClaims(){

    const user =
    await getCurrentUser();

    if(!user){

        return [];

    }

    const q =
    query(
        claimsRef,
        where(
            "uid",
            "==",
            user.uid
        )
    );

    const snapshot =
    await getDocs(q);

    return snapshot.docs.map(doc=>({

        id:doc.id,

        ...doc.data()

    }));

}

export async function getAllClaims(){

    const snapshot =
    await getDocs(
        claimsRef
    );

    return snapshot.docs.map(doc=>({

        id:doc.id,

        ...doc.data()

    }));

}

export async function updateClaimStatus(
    id,
    status
){

    const claimRef =
    doc(
        db,
        "claims",
        id
    );

    const snapshot =
    await getDoc(
        claimRef
    );

    if(
        !snapshot.exists()
    ){

        throw new Error(
            "Claim not found."
        );

    }

    const claim =
    snapshot.data();

    if(
        claim.status !==
        "pending"
    ){

        throw new Error(
            "Claim already processed."
        );

    }

    const updatedAt=
new Date().toISOString();

await updateDoc(

claimRef,

{

status,

updatedAt

}

);

await addTimelineEvent(

id,

status==="approved"

?

"Claim Approved"

:

"Claim Rejected",

"Administrator",

{

status

}

);

    await logActivity({

    module:"claims",

    action:
    status==="approved"
    ?
    "Claim Approved"
    :
    status==="rejected"
    ?
    "Claim Rejected"
    :
    "Claim Updated",

    targetId:id,

    targetName:claim.uid,

    metadata:{
        status
    }

});

}

export async function addTimelineEvent(

claimId,

action,

performedBy="Admin",

metadata={}

){

await addDoc(

claimTimelineRef,

{

claimId,

action,

performedBy,

metadata,

createdAt:
new Date().toISOString()

}

);

}

export async function getClaimTimeline(
claimId
){

const snapshot=
await getDocs(

query(

claimTimelineRef,

where(
"claimId",
"==",
claimId
)

)

);

return snapshot.docs
.map(doc=>({

id:doc.id,

...doc.data()

}))
.sort(
(a,b)=>

new Date(a.createdAt)-
new Date(b.createdAt)

);

}

export async function getClaimNotes(
claimId
){

const snapshot=
await getDocs(

query(

claimNotesRef,

where(
"claimId",
"==",
claimId
)

)

);

return snapshot.docs
.map(doc=>({

id:doc.id,

...doc.data()

}))
.sort(
(a,b)=>

new Date(b.createdAt)-
new Date(a.createdAt)

);

}

export async function addClaimNote(

claimId,

note,

admin="Administrator"

){

if(
!note.trim()
){

return;

}

await addDoc(

claimNotesRef,

{

claimId,

note,

admin,

createdAt:
new Date().toISOString()

}

);

await addTimelineEvent(

claimId,

"Note Added",

admin,

{

note

}

);

await logActivity({

module:"claims",

action:"Claim Note Added",

targetId:claimId,

targetName:claimId,

metadata:{
note,
admin
}

});

}

export async function deleteClaimNote(
id
){

const noteRef =
doc(
db,
"claimNotes",
id
);

const snapshot =
await getDoc(
noteRef
);

if(
!snapshot.exists()
){

return;

}

const note =
snapshot.data();

await deleteDoc(
noteRef
);

await addTimelineEvent(

note.claimId,

"Note Deleted",

note.admin || "Administrator",

{

note:
note.note

}

);

await logActivity({

module:"claims",

action:"Claim Note Deleted",

targetId:id,

targetName:note.claimId,

metadata:{

claimId:
note.claimId,

note:
note.note

}

});

}