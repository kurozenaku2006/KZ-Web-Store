import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    deleteDoc
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

const productsRef =
collection(
    db,
    "products"
);

export async function addProduct(product){

    const ref =
    await addDoc(
        productsRef,
        {
            name:product.name,
            price:Number(product.price),
            stock:Number(product.stock),
            status:product.status || "active",
            createdAt:new Date().toISOString(),
            lastUpdated:new Date().toISOString()
        }
    );

    await logActivity({

        module:"products",

        action:"Product Added",

        targetId:ref.id,

        targetName:product.name,

        metadata:product

    });

    return ref;

}

export async function getProducts(){

    const snapshot =
    await getDocs(
        productsRef
    );

    return snapshot.docs.map(doc => ({

        id:
        doc.id,

        ...doc.data()

    }));

}

export async function getProductById(id){

    const productRef =
    doc(
        db,
        "products",
        id
    );

    const snapshot =
    await getDoc(
        productRef
    );

    if(
        !snapshot.exists()
    ){

        return null;

    }

    return{

        id:
        snapshot.id,

        ...snapshot.data()

    };

}

export async function updateProduct(
    id,
    data
){

    const product =
    await getProductById(id);

    if(
        !product
    ){

        throw new Error(
            "Product not found."
        );

    }

    if(
        data.stock !== undefined &&
        Number(data.stock) < 0
    ){

        throw new Error(
            "Stock cannot be negative."
        );

    }

    await updateDoc(

        doc(
            db,
            "products",
            id
        ),

        {

            ...data,

            lastUpdated:
            new Date().toISOString()

        }

    );

    await logActivity({

module:"products",

action:"Product Updated",

targetId:id,

targetName:data.name||id,

metadata:data

});

}

export async function deleteProduct(id){

    await deleteDoc(

        doc(
            db,
            "products",
            id

        )

    );

    await logActivity({

module:"products",

action:"Product Deleted",

targetId:id,

targetName:id

});

}

export async function getRelatedProducts(productId){

const products=
await getProducts();

return products
.filter(product=>
product.id!==productId
)
.slice(0,4);

}

export async function searchProducts(keyword){

const products=
await getProducts();

return products.filter(product=>

(product.name||"")

.toLowerCase()

.includes(

keyword.toLowerCase()

)

);

}

export async function getFeaturedProducts(){

const products=
await getProducts();

return [...products]

.sort(

(a,b)=>

Number(b.stock||0)-

Number(a.stock||0)

)

.slice(0,4);

}

export async function getNewestProducts(){

const products=
await getProducts();

return [...products]

.sort(

(a,b)=>

new Date(
b.createdAt||0
)-

new Date(
a.createdAt||0
)

);

}

export async function getPopularProducts(){

const products=
await getProducts();

return [...products]

.sort(

(a,b)=>

Number(b.stock||0)-

Number(a.stock||0)

);

}

export function getFlashPrice(product){

const now=Date.now();

const start=

product.flashSaleStart
?

new Date(
product.flashSaleStart
).getTime()

:

0;

const end=

product.flashSaleEnd
?

new Date(
product.flashSaleEnd
).getTime()

:

0;

if(

product.flashSale===true &&

now>=start &&

now<=end

){

const discount=

Number(
product.flashDiscount||0
);

return Math.round(

Number(product.price)

-

(

Number(product.price)

*

discount

/

100

)

);

}

return Number(
product.price
);

}

export function isFlashSaleActive(product){

if(
!product.flashSale
){

return false;

}

const now=
Date.now();

return(

now>=new Date(
product.flashSaleStart
).getTime()

&&

now<=new Date(
product.flashSaleEnd
).getTime()

);

}

export function getSearchSuggestions(

products,
keyword

){

keyword=

(keyword||"")

.trim()

.toLowerCase();

if(!keyword){

return[];

}

return products

.filter(product=>

(product.name||"")

.toLowerCase()

.includes(keyword)

)

.sort(

(a,b)=>

a.name.localeCompare(
b.name
)

)

.slice(0,8);

}

export function getCategories(products){

return[

...new Set(

products

.map(

product=>

(product.category||"")

.trim()

)

.filter(Boolean)

)

]

.sort();

}

export function getBrands(products){

return[

...new Set(

products

.map(

product=>

(product.brand||"")

.trim()

)

.filter(Boolean)

)

]

.sort();

}