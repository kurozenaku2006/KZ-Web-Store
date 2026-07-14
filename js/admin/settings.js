import{

getStoreSettings,

saveStoreSettings

}
from "../services/settings.js";

let settings={};

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

Store Logo URL

</label>

<br>

<input
id="storeLogo"
value="${settings.storeLogo||""}">

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

Order Prefix

</label>

<br>

<input
id="orderPrefix"
value="${settings.orderPrefix||"KZ"}">

<br><br>

<label>

Auto Approve Orders

</label>

<br>

<input
type="checkbox"
id="autoApproveOrders"
${settings.autoApproveOrders?"checked":""}>

<br><br>

<label>

Maintenance Mode

</label>

<br>

<select id="maintenance">

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

async function save(){

settings={

storeName:
document.getElementById(
"storeName"
).value,

storeLogo:
document.getElementById(
"storeLogo"
).value,

currency:
document.getElementById(
"currency"
).value,

lowStock:Number(
document.getElementById(
"lowStock"
).value
),

tax:Number(
document.getElementById(
"tax"
).value
),

shipping:Number(
document.getElementById(
"shipping"
).value
),

rewardRate:Number(
document.getElementById(
"rewardRate"
).value
),

orderPrefix:
document.getElementById(
"orderPrefix"
).value,

autoApproveOrders:
document.getElementById(
"autoApproveOrders"
).checked,

maintenance:
document.getElementById(
"maintenance"
).value

};

await saveStoreSettings(
settings
);

alert(
"Settings Saved"
);

}

async function init(){

settings=
await getStoreSettings();

render();

}

init();