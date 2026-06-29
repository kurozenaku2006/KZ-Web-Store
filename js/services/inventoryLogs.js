import {
    collection,
    getDocs,
    query,
    where,
    orderBy
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    db
}
from "../config/firebase.js";

const inventoryLogsRef =
collection(
    db,
    "inventory_logs"
);

export async function getInventoryLogs(){

    const q =
    query(
        inventoryLogsRef,
        orderBy(
            "createdAt",
            "desc"
        )
    );

    const snapshot =
    await getDocs(
        q
    );

    return snapshot.docs.map(doc => ({
        id:doc.id,
        ...doc.data()
    }));

}

export async function getProductInventoryHistory(
    productId
){

    const q =
    query(
        inventoryLogsRef,
        where(
            "productId",
            "==",
            productId
        ),
        orderBy(
            "createdAt",
            "desc"
        )
    );

    const snapshot =
    await getDocs(
        q
    );

    return snapshot.docs.map(doc => ({
        id:doc.id,
        ...doc.data()
    }));

}

export async function getMovementTypeHistory(
    movementType
){

    const q =
    query(
        inventoryLogsRef,
        where(
            "movementType",
            "==",
            movementType
        ),
        orderBy(
            "createdAt",
            "desc"
        )
    );

    const snapshot =
    await getDocs(
        q
    );

    return snapshot.docs.map(doc => ({
        id:doc.id,
        ...doc.data()
    }));

}

export async function getLogsByDateRange(
    startDate,
    endDate
){

    const logs =
    await getInventoryLogs();

    return logs.filter(log => {

        const created =
        new Date(
            log.createdAt
        );

        return (
            created >= new Date(startDate) &&
            created <= new Date(endDate)
        );

    });

}

export async function getLowStockReport(
    threshold = 5
){

    const productsSnapshot =
    await getDocs(
        collection(
            db,
            "products"
        )
    );

    return productsSnapshot.docs
    .map(doc => ({
        id:doc.id,
        ...doc.data()
    }))
    .filter(product =>
        Number(
            product.stock || 0
        ) <= threshold
    );

}

export async function getOutOfStockReport(){

    const productsSnapshot =
    await getDocs(
        collection(
            db,
            "products"
        )
    );

    return productsSnapshot.docs
    .map(doc => ({
        id:doc.id,
        ...doc.data()
    }))
    .filter(product =>
        Number(
            product.stock || 0
        ) === 0
    );

}

export function convertInventoryLogsToCSV(
    logs
){

    const header = [
        "Date",
        "Product",
        "Movement",
        "Previous Stock",
        "New Stock",
        "Quantity",
        "Reason",
        "Performed By"
    ];

    const rows =
    logs.map(log => [

        log.createdAt,

        log.productName,

        log.movementType,

        log.previousStock,

        log.newStock,

        log.quantity,

        log.reason,

        log.performedBy

    ]);

    return [

        header.join(","),

        ...rows.map(
            row =>
            row.join(",")
        )

    ].join("\n");

}

export function downloadInventoryCSV(
    logs,
    filename = "inventory-report.csv"
){

    const csv =
    convertInventoryLogsToCSV(
        logs
    );

    const blob =
    new Blob(
        [csv],
        {
            type:
            "text/csv"
        }
    );

    const url =
    URL.createObjectURL(
        blob
    );

    const link =
    document.createElement(
        "a"
    );

    link.href =
    url;

    link.download =
    filename;

    link.click();

    URL.revokeObjectURL(
        url
    );

}