import {
    addProduct
}
from "../services/products.js";

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

            await addProduct({

                name,

                price,

                stock,

                status:"active"

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

            await refreshProducts();

        }
    );

}