import{

getProducts,

getSearchSuggestions,

getCategories,

getBrands

}
from "../services/products.js";

import {
requireMaintenanceOff
}
from "../services/guard.js";

const grid=
document.getElementById(
"productGrid"
);

let products=[];

let visibleProducts=8;

const featuredContainer=
document.getElementById(
"featuredProducts"
);

const recentContainer=
document.getElementById(
"recentProducts"
);

const popularContainer=
document.getElementById(
"popularProducts"
);

function getSearchHistory(){

return JSON.parse(

localStorage.getItem(
"searchHistory"
)

||

"[]"

);

}

function saveSearch(keyword){

keyword=

(keyword||"")

.trim();

if(!keyword){

return;

}

let history=

getSearchHistory();

history=

history.filter(

item=>

item!==keyword

);

history.unshift(keyword);

history=

history.slice(0,10);

localStorage.setItem(

"searchHistory",

JSON.stringify(history)

);

renderSearchHistory();

renderTrending();

}

function clearSearchHistory(){

localStorage.removeItem(
"searchHistory"
);

renderSearchHistory();

renderTrending();

}

function renderSearchHistory(){

const container=

document.getElementById(
"recentSearches"
);

const history=

getSearchHistory();

if(history.length===0){

container.innerHTML="";

return;

}

container.innerHTML=`

<h3>

Recent Searches

</h3>

${history.map(keyword=>`

<button

onclick="repeatSearch('${keyword}')"

>

${keyword}

</button>

`).join(" ")}

<br><br>

<button
onclick="clearSearchHistory()">

Clear History

</button>

`;

}

function renderTrending(){

const container=

document.getElementById(
"trendingSearches"
);

const history=

getSearchHistory();

const counts={};

history.forEach(keyword=>{

counts[keyword]=

(counts[keyword]||0)+1;

});

const trending=

Object.entries(counts)

.sort(

(a,b)=>

b[1]-a[1]

)

.slice(0,5);

if(trending.length===0){

container.innerHTML="";

return;

}

container.innerHTML=`

<h3>

Trending Searches

</h3>

${trending.map(item=>`

<button

onclick="repeatSearch('${item[0]}')"

>

🔥 ${item[0]}

</button>

`).join(" ")}

`;

}

async function load(){

    await requireMaintenanceOff();

products=
await getProducts();

renderSearchHistory();

renderTrending();

populateFilters();

render(
products.slice(
0,
visibleProducts
)
);

renderFeatured();

renderRecent();

renderPopular();

document.getElementById(
"searchInput"
).oninput=()=>{

filterProducts();

renderSuggestions();

};

document.getElementById(
"sortProducts"
).onchange=
filterProducts;

document.getElementById(
"stockFilter"
).onchange=
filterProducts;

document.getElementById(
"loadMore"
).onclick=()=>{

visibleProducts+=8;

filterProducts();

};

document.getElementById(
"applyPrice"
).onclick=
filterProducts;

}

function renderSuggestions(){

const keyword=

document
.getElementById(
"searchInput"
)
.value;

const container=

document
.getElementById(
"searchSuggestions"
);

const suggestions=

getSearchSuggestions(

products,

keyword

);

if(

suggestions.length===0||

keyword.trim()===""

){

container.style.display="none";

container.innerHTML="";

return;

}

container.style.display="block";

container.innerHTML=

suggestions.map(product=>`

<div

style="
padding:10px;
cursor:pointer;
border-bottom:1px solid #333;
"

onclick="goToProduct('${product.id}')"

>

${product.name}

</div>

`).join("");

}

function populateFilters(){

const categories=

getCategories(products);

const brands=

getBrands(products);

const categorySelect=

document.getElementById(
"categoryFilter"
);

const brandSelect=

document.getElementById(
"brandFilter"
);

categorySelect.innerHTML=

'<option value="all">All Categories</option>';

brands.length;

categories.forEach(category=>{

categorySelect.innerHTML+=`

<option value="${category}">

${category}

</option>

`;

});

brandSelect.innerHTML=

'<option value="all">All Brands</option>';

brands.forEach(brand=>{

brandSelect.innerHTML+=`

<option value="${brand}">

${brand}

</option>

`;

});

categorySelect.onchange=

filterProducts;

brandSelect.onchange=

filterProducts;

}

function filterProducts(){

let list=
[...products];

const keyword=

document.getElementById(
"searchInput"
).value
.toLowerCase();

if(keyword.trim()!==""){

saveSearch(keyword);

}

list=
list.filter(product=>

(product.name||"")

.toLowerCase()

.includes(keyword)

);

const maxPrice=

Number(

document.getElementById(
"maxPrice"
).value

||

0

);

if(maxPrice>0){

list=list.filter(

product=>

Number(
product.price
)<=maxPrice

);

}

const stock=

document.getElementById(
"stockFilter"
).value;

if(stock==="in"){

list=list.filter(
product=>
Number(product.stock)>0
);

}

if(stock==="out"){

list=list.filter(
product=>
Number(product.stock)<=0
);

}

const category=

document.getElementById(
"categoryFilter"
).value;

if(category!=="all"){

list=list.filter(

product=>

(product.category||"")

===category

);

}

const brand=

document.getElementById(
"brandFilter"
).value;

if(brand!=="all"){

list=list.filter(

product=>

(product.brand||"")

===brand

);

}

switch(

document.getElementById(
"sortProducts"
).value

){

case"priceLow":

list.sort(
(a,b)=>
a.price-b.price
);

break;

case"priceHigh":

list.sort(
(a,b)=>
b.price-a.price
);

break;

case"stock":

list.sort(
(a,b)=>
b.stock-a.stock
);

break;

default:

list.sort(

(a,b)=>

new Date(
b.createdAt||0
)-

new Date(
a.createdAt||0
)

);

}

render(

list.slice(

0,

visibleProducts

)

);

document
.getElementById(
"searchSuggestions"
)
.style.display="none";

}

function getFlashPrice(product){

const now=
new Date();

const active=

product.flashSale===true&&
product.flashSaleStart&&
product.flashSaleEnd&&
now>=new Date(product.flashSaleStart)&&
now<=new Date(product.flashSaleEnd);

if(!active){

return{

active:false,

price:Number(product.price)

};

}

const discount=

Number(
product.flashDiscount||0
);

return{

active:true,

price:

Number(product.price)-

(
Number(product.price)
*
discount
/100
)

};

}

function render(list){

    document.getElementById(
"loadMore"
).style.display=

list.length>=products.length

?

"none"

:

"inline-block";

document.getElementById(
"productCount"
).textContent=

`${list.length} Product(s) Found`;

grid.innerHTML=

list.length===0

?

"<p>No Products Found</p>"

:

list.map(product=>{

const flash=
getFlashPrice(product);

return`

<div class="card">

<h3>

${product.name}

</h3>

<br>

${
flash.active

?

`

<div style="color:red;font-weight:bold;">

⚡ FLASH SALE

</div>

<s>

₹${product.price}

</s>

<br>

<b>

₹${flash.price.toFixed(2)}

</b>

`

:

`

₹${product.price}

`

}

<br><br>

Stock :

${product.stock}

<br><br>

<a
onclick="saveRecentlyViewed('${product.id}')"
href="/product.html?id=${product.id}">

View Product

</a>

</div>

`;

}).join("");

}

function renderFeatured(){

const featured=

[...products]

.sort(

(a,b)=>

Number(b.stock||0)-

Number(a.stock||0)

)

.slice(0,4);

featuredContainer.innerHTML=

featured.length===0

?

"<p>No Featured Products</p>"

:

featured.map(product=>`

<div class="card">

<h3>

${product.name}

</h3>

<br>

₹${product.price}

<br><br>

<a
onclick="saveRecentlyViewed('${product.id}')"
href="/product.html?id=${product.id}">

View Product

</a>

</div>

`).join("");

}

function renderRecent(){

const latest=

[...products]

.sort(

(a,b)=>

new Date(
b.createdAt||0
)-

new Date(
a.createdAt||0
)

)

.slice(0,4);

recentContainer.innerHTML=

latest.map(product=>`

<div class="card">

<h3>

${product.name}

</h3>

<br>

₹${product.price}

<br><br>

<a
onclick="saveRecentlyViewed('${product.id}')"
href="/product.html?id=${product.id}">

View Product

</a>

</div>

`).join("");

}

function renderPopular(){

const popular=

[...products]

.sort(

(a,b)=>

Number(b.stock||0)-

Number(a.stock||0)

)

.slice(0,8);

popularContainer.innerHTML=

popular.map(product=>`

<div class="card">

<h3>

${product.name}

</h3>

<br>

₹${product.price}

<br><br>

<a
onclick="saveRecentlyViewed('${product.id}')"
href="/product.html?id=${product.id}">

View Product

</a>

</div>

`).join("");

}

window.saveRecentlyViewed=
function(id){

let viewed=

JSON.parse(

localStorage.getItem(
"recentProducts"
)

||

"[]"

);

viewed=

viewed.filter(

productId=>

productId!==id

);

viewed.unshift(id);

viewed=viewed.slice(0,12);

localStorage.setItem(

"recentProducts",

JSON.stringify(viewed)

);

};

window.goToProduct=
function(id){

location.href=

"/product.html?id="+id;

};

window.repeatSearch=
function(keyword){

document.getElementById(
"searchInput"
).value=keyword;

filterProducts();

renderSuggestions();

};

window.clearSearchHistory=
clearSearchHistory;

load();