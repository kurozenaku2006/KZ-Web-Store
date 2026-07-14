import {
doc,
getDoc,
setDoc
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

const SETTINGS_DOC="store";

const settingsRef=
doc(
db,
"settings",
SETTINGS_DOC
);

const defaults={

storeName:"KZ HOBBIES",

storeLogo:"",

currency:"₹",

lowStock:5,

tax:18,

shipping:0,

rewardRate:1,

orderPrefix:"KZ",

autoApproveOrders:false,

maintenance:"off"

};

export async function
getStoreSettings(){

const snapshot=
await getDoc(
settingsRef
);

if(!snapshot.exists()){

await setDoc(
settingsRef,
defaults
);

return defaults;

}

return{

...defaults,

...snapshot.data()

};

}

export async function
saveStoreSettings(data){

await setDoc(

settingsRef,

{

...defaults,

...data

}

);

await logActivity({

module:"settings",

action:"Store Settings Updated"

});

}