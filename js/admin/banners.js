import {

addBanner,

getBanners,

updateBanner,

deleteBanner

}
from "../services/banners.js";

const list =
document.getElementById(
"bannerList"
);

const addBtn =
document.getElementById(
"addBtn"
);

async function load(){

const banners =
await getBanners();

list.innerHTML="";

banners.forEach(banner=>{

list.innerHTML+=`

<div class="card">

<img
src="${banner.image}"
style="
width:100%;
max-height:150px;
object-fit:cover;
">

<h3>

${banner.title}

</h3>

<p>

Priority :

${banner.priority}

</p>

<p>

Status :

${banner.status}

</p>

<button
onclick="toggleBanner('${banner.id}','${banner.status}')">

Toggle

</button>

<button
onclick="removeBanner('${banner.id}')">

Delete

</button>

</div>

`;

});

}

window.toggleBanner=
async function(
id,
status
){

await updateBanner(
id,
{
status:
status==="active"
?
"inactive"
:
"active"
}
);

load();

};

window.removeBanner=
async function(id){

if(
!confirm(
"Delete banner?"
)
)return;

await deleteBanner(
id
);

load();

};

addBtn.onclick=
async()=>{

await addBanner({

title:
document
.getElementById(
"title"
).value,

image:
document
.getElementById(
"image"
).value,

link:
document
.getElementById(
"link"
).value,

priority:
document
.getElementById(
"priority"
).value

});

document
.getElementById(
"title"
).value="";

document
.getElementById(
"image"
).value="";

document
.getElementById(
"link"
).value="";

document
.getElementById(
"priority"
).value="";

load();

};

load();