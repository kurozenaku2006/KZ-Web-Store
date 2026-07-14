import {
    addProduct
}
from "../services/products.js";

import {
    logActivity
}
from "../services/activity.js";

export function registerProductForm(
    refreshProducts
){

    const addBtn =
    document.getElementById(
        "addBtn"
    );

    addBtn.addEventListener(
        "click",
        async ()=>{

            const name =
            document
            .getElementById(
                "name"
            )
            .value
            .trim();

            const price =
            Number(
                document
                .getElementById(
                    "price"
                )
                .value
            );

            const stock =
            Number(
                document
                .getElementById(
                    "stock"
                )
                .value
            );

            if(
                !name ||
                isNaN(price) ||
                isNaN(stock) ||
                stock < 0
            ){

                alert(
                    "Please fill all fields correctly."
                );

                return;

            }

            const product = {

    name,

    price,

    stock,

    category:
    document.getElementById(
        "category"
    ).value.trim(),

    brand:
    document.getElementById(
        "brand"
    ).value.trim(),

    status:"active",

    flashSale:
    document.getElementById(
        "flashEnabled"
    ).checked,

    flashDiscount:
    Number(
        document.getElementById(
            "flashDiscount"
        ).value
    )||0,

    flashSaleStart:
    document.getElementById(
        "flashStart"
    ).value||"",

    flashSaleEnd:
    document.getElementById(
        "flashEnd"
    ).value||""

};

await addProduct(
    product
);

await logActivity({

    module:"Products",

    action:"Added Product",

    targetName:name,

    metadata:product

});

            document.getElementById(
                "name"
            ).value = "";

            document.getElementById(
                "price"
            ).value = "";

            document.getElementById(
                "stock"
            ).value = "";

            document.getElementById(
    "category"
).value="";

document.getElementById(
    "brand"
).value="";

            document.getElementById(
    "flashDiscount"
).value="";

document.getElementById(
    "flashStart"
).value="";

document.getElementById(
    "flashEnd"
).value="";

document.getElementById(
    "flashEnabled"
).checked=false;

            await refreshProducts();

        }
    );

}