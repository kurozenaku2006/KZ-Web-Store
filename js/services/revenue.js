import {
    getAllOrders
}
from "./orders.js";

export async function getRevenueSummary(){

    const orders =
    await getAllOrders();

    let revenue = 0;

    let pending = 0;
    let approved = 0;
    let shipped = 0;
    let delivered = 0;
    let cancelled = 0;
    let rejected = 0;

    const monthly = {};
    const daily = {};

    orders.forEach(order=>{

        const total =
        Number(order.total || 0);

        switch(order.status){

            case "pending":
                pending++;
                break;

            case "approved":
                approved++;
                revenue += total;
                break;

            case "shipped":
                shipped++;
                revenue += total;
                break;

            case "delivered":
                delivered++;
                revenue += total;
                break;

            case "cancelled":
                cancelled++;
                break;

            case "rejected":
                rejected++;
                break;

        }

        if(
            order.status==="approved" ||
            order.status==="shipped" ||
            order.status==="delivered"
        ){

            const date =
            new Date(order.createdAt);

            const month =
            `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}`;

            const day =
            date.toISOString().split("T")[0];

            monthly[month] =
            (monthly[month]||0)+total;

            daily[day] =
            (daily[day]||0)+total;

        }

    });

    return{

        revenue,

        totalOrders:
        orders.length,

        pending,

        approved,

        shipped,

        delivered,

        cancelled,

        rejected,

        averageOrder:

        orders.length
        ?
        Math.round(
            revenue/orders.length
        )
        :
        0,

        monthly,

        daily,

        orders

    };

}

export async function getMonthlyRevenue(){

    const data =
    await getRevenueSummary();

    return data.monthly;

}

export async function getDailyRevenue(){

    const data =
    await getRevenueSummary();

    return data.daily;

}

export async function getTopRevenueOrders(limit=10){

    const data =
    await getRevenueSummary();

    return [...data.orders]

    .sort(
        (a,b)=>
        Number(b.total||0)-
        Number(a.total||0)
    )

    .slice(0,limit);

}

export function revenueCSV(orders){

    let csv =
    "Order ID,UID,Status,Total,Created At\n";

    orders.forEach(order=>{

        csv+=
`${order.id},${order.uid},${order.status},${order.total},${order.createdAt}\n`;

    });

    return csv;

}

export function downloadRevenueCSV(
orders
){

    const blob =
    new Blob(
        [
            revenueCSV(orders)
        ],
        {
            type:"text/csv"
        }
    );

    const url =
    URL.createObjectURL(blob);

    const a =
    document.createElement("a");

    a.href=url;

    a.download=
    "revenue-report.csv";

    a.click();

    URL.revokeObjectURL(url);

}