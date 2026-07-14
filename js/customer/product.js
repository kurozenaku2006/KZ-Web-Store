import {
    getProductById,
    getRelatedProducts
}
from "../services/products.js";

import {
    addToWishlist
}
from "../services/wishlist.js";

import {
    addToCart
}
from "../services/cart.js";

import{
addReview,
getProductReviews,
askQuestion,
getQuestions
}
from "../services/reviews.js";

import{
requireMaintenanceOff
}
from "../services/guard.js";

const params =
new URLSearchParams(
window.location.search
);

const productId =
params.get("id");

const container =
document.getElementById(
"productContainer"
);

async function loadReviews(){

const reviews=
await getProductReviews(

productId,

document.getElementById(
"reviewSort"
)?.value
||
"newest"

);

const average=

reviews.length

?

(

reviews.reduce(

(sum,review)=>

sum+review.rating,

0

)

/

reviews.length

).toFixed(1)

:

0;

document.getElementById(

"ratingSummary"

).innerHTML=`

<b>

Average Rating

</b>

:

${average}

★

(

${reviews.length}

Reviews

)

`;

const questions=
await getQuestions(
productId
);

document.getElementById(
"reviewsContainer"
).innerHTML=

reviews.length===0

?

"<p>No Reviews Yet</p>"

:

reviews.map(review=>`

<div class="card">

<p>

${"★".repeat(review.rating)}${"☆".repeat(5-review.rating)}

</p>

<p>

${review.review}

</p>

${
review.adminReply
?
`<small>Admin : ${review.adminReply}</small>`
:
""
}

</div>

`).join("");

document.getElementById(
"questionsContainer"
).innerHTML=

questions.length===0

?

"<p>No Questions</p>"

:

questions.map(question=>`

<div class="card">

<b>Q :</b>

${question.question}

<br><br>

<b>A :</b>

${question.answer||"Waiting for admin"}

</div>

`).join("");

}

window.addProductToCart =
async function(){

    const product =
    await getProductById(
        productId
    );

    await addToCart({

        productId:
        product.id,

        name:
        product.name,

        price:
        product.price

    });

    alert(
        "Product Added To Cart ✅"
    );

}

async function loadProduct(){

    const product =
    await getProductById(
        productId
    );

    const now=
new Date();

const flashActive=

product.flashSale===true&&
product.flashSaleStart&&
product.flashSaleEnd&&
now>=new Date(product.flashSaleStart)&&
now<=new Date(product.flashSaleEnd);

const flashPrice=

flashActive

?

Number(product.price)-

(
Number(product.price)
*
Number(product.flashDiscount||0)
/100
)

:

Number(product.price);

const flashEnds=

flashActive

?

new Date(
product.flashSaleEnd
).toLocaleString()

:

"";

    if(!product){

        container.innerHTML =
        "<h2>Product Not Found</h2>";

        return;

    }

    container.innerHTML = `

<div class="card">

    <h1>
        ${product.name}
    </h1>

    <br>

    <p>

Price:

${

flashActive

?

`

<span style="color:red;">

⚡ FLASH SALE

</span>

<br>

<s>

₹${product.price}

</s>

<br>

<b>

₹${flashPrice.toFixed(2)}

</b>

<br>

Ends :

${flashEnds}

`

:

`

₹${product.price}

`

}

</p>

    <br>

    <p>
        Stock:
        ${product.stock}
    </p>

    <br>

    <p>
        Status:
        ${product.status}
    </p>

    <br>

    <button
    onclick="addCurrentProductToWishlist()">

        Add To Wishlist

    </button>

    <br><br>

    ${
        product.stock > 0

        ?

        `

        <button
        onclick="addProductToCart()">

            Add To Cart

        </button>

        `

        :

        `

        <button disabled>

            Out Of Stock

        </button>

        `

    }

<hr>

<h2>

Reviews

</h2>

<br>

<select id="reviewSort">

<option value="newest">

Newest

</option>

<option value="highest">

Highest Rating

</option>

<option value="lowest">

Lowest Rating

</option>

</select>

<br><br>

<div id="ratingSummary">

</div>

<select id="rating">

<option value="5">5 Stars</option>
<option value="4">4 Stars</option>
<option value="3">3 Stars</option>
<option value="2">2 Stars</option>
<option value="1">1 Star</option>

</select>

<br><br>

<textarea
id="reviewText"
placeholder="Write your review">
</textarea>

<br><br>

<button
onclick="submitReview()">

Submit Review

</button>

<br><br>

<div id="reviewsContainer">

Loading Reviews...

</div>

<hr>

<h2>

Questions & Answers

</h2>

<textarea
id="questionText"
placeholder="Ask a question">
</textarea>

<br><br>

<button
onclick="submitQuestion()">

Ask Question

</button>

<br><br>

<div
id="questionsContainer">

Loading Questions...

</div>

<hr>

<h2>

Related Products

</h2>

<div
id="relatedProducts">

Loading...

</div>

</div>

`;

}

window.addCurrentProductToWishlist =
async function(){

    await addToWishlist(
        productId
    );

    alert(
        "Added To Wishlist"
    );

}

window.submitReview=
async()=>{

await addReview({

productId,

rating:
document.getElementById(
"rating"
).value,

review:
document.getElementById(
"reviewText"
).value

});

document.getElementById(
"reviewText"
).value="";

alert(
"Review submitted."
);

loadReviews();

};

async function loadRelatedProducts(){

const products=

await getRelatedProducts(
productId
);

document.getElementById(

"relatedProducts"

).innerHTML=

products.length===0

?

"<p>No Related Products</p>"

:

products.map(product=>`

<div class="card">

<b>

${product.name}

</b>

<br>

₹${product.price}

<br><br>

<a href="/product.html?id=${product.id}">

View Product

</a>

</div>

`).join("");

}

window.submitQuestion=
async()=>{

await askQuestion({

productId,

question:
document.getElementById(
"questionText"
).value

});

document.getElementById(
"questionText"
).value="";

loadReviews();

};

(async()=>{

await requireMaintenanceOff();

await loadProduct();

await loadReviews();

await loadRelatedProducts();

document.getElementById(
"reviewSort"
).onchange=
loadReviews;

})();