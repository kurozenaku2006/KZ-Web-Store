import {
collection,
addDoc,
getDocs,
getDoc,
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

import {
logActivity
}
from "./activity.js";

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

usedCount:0,

createdAt:
new Date().toISOString()
}
    );

    await logActivity({

module:"coupons",

action:"Coupon Created",

targetName:coupon.code,

metadata:coupon

});

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

await logActivity({

module:"coupons",

action:"Coupon Updated",

targetId:id,

metadata:data

});

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

await logActivity({

module:"coupons",

action:"Coupon Deleted",

targetId:id

});

}

export async function recordCouponUsage(
couponId,
uid,
orderId=""
){

const couponRef=
doc(
db,
"coupons",
couponId
);

const snapshot=
await getDoc(
couponRef
);

if(
!snapshot.exists()
){

throw new Error(
"Coupon not found."
);

}

const coupon=
snapshot.data();

await updateDoc(
couponRef,
{
usedCount:
Number(
coupon.usedCount||0
)+1
}
);

await addDoc(

collection(
db,
"couponHistory"
),

{
couponId,
uid,
orderId,
usedAt:
new Date().toISOString()
}

);

}

export async function getCouponHistory(){

const snapshot=
await getDocs(

collection(
db,
"couponHistory"
)

);

return snapshot.docs.map(doc=>({

id:doc.id,

...doc.data()

}));

}

export async function getCouponStatistics(){

const coupons=
await getCoupons();

return{

total:
coupons.length,

active:
coupons.filter(
c=>c.status==="active"
).length,

expired:
coupons.filter(c=>

c.expiry &&

new Date(c.expiry)<new Date()

).length,

totalUses:
coupons.reduce(

(a,b)=>

a+
Number(
b.usedCount||0
),

0

)

};

}