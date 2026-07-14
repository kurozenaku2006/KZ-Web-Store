import{
getAllReviews,
updateReview,
getAllQuestions,
replyQuestion
}
from "../services/reviews.js";

const list=
document.getElementById(
"reviewsList"
);

const questionsList=
document.getElementById(
"questionsList"
);

async function load(){

const reviews=
await getAllReviews();

list.innerHTML=

reviews.map(review=>`

<div class="card">

<h3>

${review.productId}

</h3>

<p>

${review.review}

</p>

<p>

Rating :
${review.rating}

</p>

<p>

Status :
${review.status}

</p>

<input
id="reply-${review.id}"
placeholder="Admin Reply">

<br><br>

<button
onclick="approve('${review.id}')">

Approve

</button>

<button
onclick="reject('${review.id}')">

Reject

</button>

</div>

<br>

`).join("");

}

async function loadQuestions(){

const questions=
await getAllQuestions();

questionsList.innerHTML=

questions.length===0

?

"<p>No Questions</p>"

:

questions.map(question=>`

<div class="card">

<p>

${question.question}

</p>

<textarea
id="questionReply-${question.id}">

${question.answer||""}

</textarea>

<br><br>

<button
onclick="saveQuestionReply('${question.id}')">

Save Reply

</button>

</div>

<br>

`).join("");

}

window.saveQuestionReply=
async id=>{

await replyQuestion(

id,

document.getElementById(
`questionReply-${id}`
).value

);

loadQuestions();

};

window.approve=
async id=>{

await updateReview(
id,
{
status:"approved",
adminReply:
document.getElementById(
`reply-${id}`
).value
}
);

load();

};

window.reject=
async id=>{

await updateReview(
id,
{
status:"rejected"
}
);

load();

};

load();

loadQuestions();