import {
collection,
addDoc,
getDocs,
updateDoc,
deleteDoc,
doc,
query,
orderBy,
where
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
db
}
from "../config/firebase.js";

const couponsRef =
collection(
db,
"coupons"
);

export async function addCoupon(
    coupon
){

    const q =
    query(
        couponsRef,
        where(
            "code",
            "==",
            coupon.code
        )
    );

    const snapshot =
    await getDocs(q);

    if(
        !snapshot.empty
    ){

        throw new Error(
            "Coupon already exists."
        );

    }

    await addDoc(
        couponsRef,
        {
            ...coupon,
            createdAt:
            new Date().toISOString()
        }
    );

}

export async function getCoupons(){

const q =
query(
couponsRef,
orderBy(
"createdAt",
"desc"
)
);

const snapshot =
await getDocs(q);

return snapshot.docs.map(doc=>({

id:doc.id,

...doc.data()

}));

}

export async function updateCoupon(
id,
data
){

await updateDoc(
doc(
db,
"coupons",
id
),
data
);

}

export async function deleteCoupon(
id
){

await deleteDoc(
doc(
db,
"coupons",
id
)
);

}