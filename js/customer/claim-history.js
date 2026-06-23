import {
    createClaim,
    getUserClaims
}
from "../services/claims.js";

const submitBtn =
document.getElementById(
"submitClaimBtn"
);

const container =
document.getElementById(
"claimsContainer"
);

async function loadClaims(){

    const claims =
    await getUserClaims();

    if(claims.length === 0){

        container.innerHTML =
        "<p>No Claims Found</p>";

        return;

    }

    container.innerHTML = "";

    claims.forEach(claim => {

        container.innerHTML += `

        <div class="card">

            <p>
                Order:
                ${claim.orderId}
            </p>

            <p>
                Product:
                ${claim.productId}
            </p>

            <p>
                Reason:
                ${claim.reason}
            </p>

            <p>
                Status:
                ${claim.status}
            </p>

        </div>

        <br>

        `;

    });

}

submitBtn.addEventListener(
"click",
async ()=>{

    await createClaim({

        orderId:
        document.getElementById(
        "orderId"
        ).value,

        productId:
        document.getElementById(
        "productId"
        ).value,

        reason:
        document.getElementById(
        "reason"
        ).value,

        description:
        document.getElementById(
        "description"
        ).value

    });

    alert(
        "Claim Submitted"
    );

    loadClaims();

});

loadClaims();