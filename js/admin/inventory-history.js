import {
    getInventoryLogs,
    downloadInventoryCSV
}
from "../services/inventoryLogs.js";

const cards =
document.getElementById(
    "cards"
);

const historyTable =
document.getElementById(
    "historyTable"
);

const searchInput =
document.getElementById(
    "searchInput"
);

const movementFilter =
document.getElementById(
    "movementFilter"
);

const startDate =
document.getElementById(
    "startDate"
);

const endDate =
document.getElementById(
    "endDate"
);

const sortOrder =
document.getElementById(
    "sortOrder"
);

const exportBtn =
document.getElementById(
    "exportBtn"
);

const todayBtn =
document.getElementById(
    "todayBtn"
);

const weekBtn =
document.getElementById(
    "weekBtn"
);

const monthBtn =
document.getElementById(
    "monthBtn"
);

const allBtn =
document.getElementById(
    "allBtn"
);

let inventoryLogs = [];

async function loadInventoryHistory(){

    inventoryLogs =
    await getInventoryLogs();

    renderDashboard();

    renderTable();

}

function renderDashboard(){

    const total =
    inventoryLogs.length;

    const restocks =
    inventoryLogs.filter(
        log =>
        log.movementType ===
        "increase"
    ).length;

    const reductions =
    inventoryLogs.filter(
        log =>
        log.movementType ===
        "decrease"
    ).length;

    const adjustments =
    inventoryLogs.filter(
        log =>
        log.movementType ===
        "adjustment"
    ).length;

    const today =
    new Date()
    .toDateString();

    const todayMovements =
    inventoryLogs.filter(
        log =>
        new Date(
            log.createdAt
        ).toDateString()
        === today
    ).length;

    cards.innerHTML = `

<div class="card">

<h3>

Total Movements

</h3>

<div class="card-value">

${total}

</div>

</div>

<div class="card">

<h3>

Restocks

</h3>

<div class="card-value">

${restocks}

</div>

</div>

<div class="card">

<h3>

Reductions

</h3>

<div class="card-value">

${reductions}

</div>

</div>

<div class="card">

<h3>

Adjustments

</h3>

<div class="card-value">

${adjustments}

</div>

</div>

<div class="card">

<h3>

Today's Activity

</h3>

<div class="card-value">

${todayMovements}

</div>

</div>

`;

}

function renderTable(){

    let logs =
    [...inventoryLogs];

    const keyword =
    searchInput.value
    .toLowerCase();

    if(keyword){

        logs =
        logs.filter(log =>
        log.productName
        .toLowerCase()
        .includes(keyword)
        );

    }

    if(
        movementFilter.value !==
        "all"
    ){

        logs =
        logs.filter(
            log =>
            log.movementType ===
            movementFilter.value
        );

    }

    if(startDate.value){

        logs =
        logs.filter(
            log =>
            new Date(
                log.createdAt
            ) >=
            new Date(
                startDate.value
            )
        );

    }

    if(endDate.value){

        const end =
        new Date(
            endDate.value
        );

        end.setHours(
            23,
            59,
            59,
            999
        );

        logs =
        logs.filter(
            log =>
            new Date(
                log.createdAt
            ) <= end
        );

    }

    logs.sort((a,b)=>{

        if(
            sortOrder.value ===
            "asc"
        ){

            return new Date(
                a.createdAt
            ) -
            new Date(
                b.createdAt
            );

        }

        return new Date(
            b.createdAt
        ) -
        new Date(
            a.createdAt
        );

    });

    historyTable.innerHTML =

    logs.length === 0

    ?

    "<p>No Inventory Records Found.</p>"

    :

    logs.map(log=>{

        let badge =
        "";

        if(
            log.movementType ===
            "increase"
        ){

            badge =
            "🟢 Restock";

        }

        else if(
            log.movementType ===
            "decrease"
        ){

            badge =
            "🔴 Reduction";

        }

        else{

            badge =
            "🟡 Adjustment";

        }

        return `

<div class="activity-item">

<p>

<b>

${log.productName}

</b>

</p>

<p>

${badge}

</p>

<p>

Previous :
${log.previousStock}

</p>

<p>

New :
${log.newStock}

</p>

<p>

Quantity :
${log.quantity}

</p>

<p>

Reason :
${log.reason}

</p>

<p>

Performed By :
${log.performedBy}

</p>

<p>

${new Date(
log.createdAt
).toLocaleString()}

</p>

</div>

`;

    }).join("");

}

function setQuickFilter(days){

    startDate.value = "";

    endDate.value = "";

    if(days !== null){

        const start =
        new Date();

        start.setDate(
            start.getDate()
            - days
        );

        startDate.value =
        start
        .toISOString()
        .split("T")[0];

        endDate.value =
        new Date()
        .toISOString()
        .split("T")[0];

    }

    renderTable();

}

searchInput.oninput =
renderTable;

movementFilter.onchange =
renderTable;

startDate.onchange =
renderTable;

endDate.onchange =
renderTable;

sortOrder.onchange =
renderTable;

todayBtn.onclick =
()=>setQuickFilter(0);

weekBtn.onclick =
()=>setQuickFilter(7);

monthBtn.onclick =
()=>setQuickFilter(30);

allBtn.onclick =
()=>setQuickFilter(null);

exportBtn.onclick =
()=>downloadInventoryCSV(
    inventoryLogs,
    "inventory-history.csv"
);

loadInventoryHistory();