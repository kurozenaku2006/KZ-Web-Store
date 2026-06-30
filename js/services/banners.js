import {
collection,
addDoc,
getDocs,
updateDoc,
deleteDoc,
doc,
query,
orderBy
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
db
}
from "../config/firebase.js";

const bannersRef =
collection(
db,
"banners"
);

export async function addBanner(
    data
){

    try{

        new URL(
            data.image
        );

    }
    catch{

        throw new Error(
            "Invalid image URL."
        );

    }

    if(data.link){

        try{

            new URL(
                data.link
            );

        }
        catch{

            throw new Error(
                "Invalid redirect URL."
            );

        }

    }

    await addDoc(
        bannersRef,
        {
            title:data.title,
            image:data.image,
            link:data.link,
            priority:Number(
                data.priority
            ),
            status:"active",
            createdAt:
            new Date().toISOString()
        }
    );

}

export async function getBanners(){

const q =
query(
bannersRef,
orderBy(
"priority"
)
);

const snapshot =
await getDocs(q);

return snapshot.docs.map(doc=>({

id:doc.id,

...doc.data()

}));

}

export async function updateBanner(
id,
data
){

await updateDoc(
doc(
db,
"banners",
id
),
data
);

}

export async function deleteBanner(
id
){

await deleteDoc(
doc(
db,
"banners",
id
)
);

}