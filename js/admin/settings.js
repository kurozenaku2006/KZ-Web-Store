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

,

tax:
localStorage.getItem(
"tax"
)||"18",

shipping:
localStorage.getItem(
"shipping"
)||"0",

rewardRate:
localStorage.getItem(
"rewardRate"
)||"1",

maintenance:
localStorage.getItem(
"maintenance"
)||"off"

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

<label>

Tax (%)

</label>

<br>

<input
id="tax"
type="number">

<br><br>

<label>

Shipping Charge

</label>

<br>

<input
id="shipping"
type="number">

<br><br>

<label>

Reward Points per ₹100

</label>

<br>

<input
id="rewardRate"
type="number">

<br><br>

<label>

Maintenance Mode

</label>

<br>

<select
id="maintenance">

<option value="off">

Off

</option>

<option value="on">

On

</option>

</select>

<br><br>

<button id="saveSettings">

Save Settings

</button>

</div>

`;

document.getElementById(
"tax"
).value=
settings.tax;

document.getElementById(
"shipping"
).value=
settings.shipping;

document.getElementById(
"rewardRate"
).value=
settings.rewardRate;

document.getElementById(
"maintenance"
).value=
settings.maintenance;

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

localStorage.setItem(
"tax",
document.getElementById(
"tax"
).value
);

localStorage.setItem(
"shipping",
document.getElementById(
"shipping"
).value
);

localStorage.setItem(
"rewardRate",
document.getElementById(
"rewardRate"
).value
);

localStorage.setItem(
"maintenance",
document.getElementById(
"maintenance"
).value
);

alert(
"Settings Saved"
);

}

render();