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

),

mostUsed:

coupons
.slice()
.sort(
(a,b)=>

Number(b.usedCount||0)-

Number(a.usedCount||0)

)
.slice(0,5)

};

}

export async function validateCoupon(
code,
uid,
email
){

const snapshot=
await getDocs(

query(

couponsRef,

where(
"code",
"==",
code
)

)

);

if(snapshot.empty){

return{

valid:false,

message:"Invalid coupon."

};

}

const coupon={

id:snapshot.docs[0].id,

...snapshot.docs[0].data()

};

if(coupon.status!=="active"){

return{

valid:false,

message:"Coupon inactive."

};

}

if(

coupon.expiry &&

new Date(coupon.expiry)<new Date()

){

return{

valid:false,

message:"Coupon expired."

};

}

if(

Number(coupon.usedCount||0)>=

Number(coupon.limit||0)

){

return{

valid:false,

message:"Coupon exhausted."

};

}

if(

coupon.allowedCustomer &&

coupon.allowedCustomer!==uid

){

return{

valid:false,

message:"Coupon restricted."

};

}

if(

coupon.allowedEmail &&

coupon.allowedEmail.toLowerCase()!==

email.toLowerCase()

){

return{

valid:false,

message:"Coupon restricted."

};

}

if(coupon.oneTimeUse){

const history=

await getCouponHistory();

const used=

history.find(h=>

h.couponId===coupon.id &&

h.uid===uid

);

if(used){

return{

valid:false,

message:"Already used."

};

}

}

if(

coupon.maxPerCustomer>0

){

const history=

await getCouponHistory();

const count=

history.filter(h=>

h.couponId===coupon.id &&

h.uid===uid

).length;

if(

count>=coupon.maxPerCustomer

){

return{

valid:false,

message:"Usage limit reached."

};

}

}

return{

valid:true,

...coupon

};

}