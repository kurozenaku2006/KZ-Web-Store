import { revenueCard }
from "./widgets/revenue-card.js";

import { ordersCard }
from "./widgets/order-card.js";

import { claimsCard }
from "./widgets/claims-card.js";

import { customersCard }
from "./widgets/customers-card.js";

import { lowStockCard }
from "./widgets/low-stock-card.js";

document.getElementById("cards").innerHTML =

revenueCard() +
ordersCard() +
claimsCard() +
customersCard() +
lowStockCard();