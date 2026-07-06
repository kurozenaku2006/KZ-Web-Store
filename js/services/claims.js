import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    query,
    where,
    doc,
    updateDoc
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

    await addDoc(
        claimsRef,
        {
            ...claim,
            uid:user.uid,
            status:"pending",
            createdAt:
            new Date().toISOString()
        }
    );

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

    await updateDoc(
        claimRef,
        {
            status,
            updatedAt:
            new Date().toISOString()
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