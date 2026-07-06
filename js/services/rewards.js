import {
    doc,
    query,
    where,
    getDoc,
    getDocs,
    updateDoc,
    addDoc,
    collection
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    db
}
from "../config/firebase.js";

import {
logActivity
}
from "./activity.js";

const rewardHistoryRef =
collection(
    db,
    "rewardHistory"
);

export async function addRewardPoints(
    uid,
    points,
    orderTotal
){

    const userRef =
    doc(
        db,
        "users",
        uid
    );

    const snapshot =
    await getDoc(
        userRef
    );

    if(!snapshot.exists()){

        return;

    }

    const userData =
    snapshot.data();

    const currentPoints =
    Number(
        userData.rewardPoints || 0
    );

    await updateDoc(
        userRef,
        {
            rewardPoints:
            currentPoints + points
        }
    );

    await addDoc(
        rewardHistoryRef,
       {
    uid,
    points,
    orderTotal,
    type: "earned",
    createdAt:
    new Date().toISOString()
}
    );

    await logActivity({

module:"rewards",

action:"Reward Added",

targetId:uid,

metadata:{
points,
orderTotal
}

});

}

export async function getRewardHistory(uid){

    const q =
    query(
        rewardHistoryRef,
        where(
            "uid",
            "==",
            uid
        )
    );

    const snapshot =
    await getDocs(q);

    return snapshot.docs.map(
        doc => ({
            id:doc.id,
            ...doc.data()
        })
    );

}

export async function redeemRewardPoints(
    uid,
    points
){

    const userRef =
    doc(
        db,
        "users",
        uid
    );

    const snapshot =
    await getDoc(
        userRef
    );

    if(!snapshot.exists()){

        return false;

    }

    const userData =
    snapshot.data();

    const currentPoints =
    Number(
        userData.rewardPoints || 0
    );

    if(
    points <= 0
){

    return false;

}

if(
    currentPoints < points
){

    alert(
        "Not enough reward points"
    );

    return false;

}

    await updateDoc(
    userRef,
    {
        rewardPoints:
        currentPoints - points
    }
);

await addDoc(
    rewardHistoryRef,
    {
        uid,
        points: -points,
        orderTotal: 0,
        type: "redeemed",
        createdAt:
        new Date().toISOString()
    }
);

await logActivity({

module:"rewards",

action:"Reward Redeemed",

targetId:uid,

metadata:{
points
}

});

return true;

}