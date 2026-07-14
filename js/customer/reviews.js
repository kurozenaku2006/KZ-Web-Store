import{
getMyReviews
}
from "../services/reviews.js";

const container=
document.getElementById(
"reviewList"
);

async function load(){

const reviews=
await getMyReviews();

container.innerHTML=

reviews.length===0

?

"<p>No Reviews Yet</p>"

:

reviews.map(review=>`

<div class="card">

<h3>

${review.productName||review.productId}

</h3>

<p>

${"★".repeat(review.rating)}

</p>

<p>

${review.review}

</p>

<p>

Status :

${review.status}

</p>

${

review.status==="approved"

?

`<p style="color:lime;">

Approved

</p>`

:

review.status==="rejected"

?

`<p style="color:red;">

Rejected

</p>`

:

`<p style="color:orange;">

Pending Approval

</p>`

}

${
review.adminReply
?

`<small>

Admin :

${review.adminReply}

</small>`

:

""

}

</div>

`).join("");

}

load();