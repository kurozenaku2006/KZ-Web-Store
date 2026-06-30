const settings = {

storeName:
localStorage.getItem(
"storeName"
) || "KZ HOBBIES",

currency:
localStorage.getItem(
"currency"
) || "₹",

lowStock:
localStorage.getItem(
"lowStock"
) || "5"

};

const container =
document.getElementById(
"settingsContainer"
);

function render(){

container.innerHTML = `

<div class="card">

<label>

Store Name

</label>

<br>

<input
id="storeName"
value="${settings.storeName}">

<br><br>

<label>

Currency

</label>

<br>

<input
id="currency"
value="${settings.currency}">

<br><br>

<label>

Low Stock Alert

</label>

<br>

<input
id="lowStock"
type="number"
value="${settings.lowStock}">

<br><br>

<button id="saveSettings">

Save Settings

</button>

</div>

`;

document.getElementById(
"saveSettings"
).onclick =
save;

}

function save(){

localStorage.setItem(
"storeName",
document.getElementById(
"storeName"
).value
);

localStorage.setItem(
"currency",
document.getElementById(
"currency"
).value
);

localStorage.setItem(
"lowStock",
document.getElementById(
"lowStock"
).value
);

alert(
"Settings Saved"
);

}

render();