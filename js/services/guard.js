import { auth } from "../config/firebase.js";
import { getUserData } from "./auth.js";

export async function requireAdmin() {

    return new Promise((resolve) => {

        auth.onAuthStateChanged(async (user) => {

            if (!user) {
                window.location.href = "/login.html";
                return;
            }

            const userData =
                await getUserData(user.uid);

            if (!userData) {
                window.location.href = "/login.html";
                return;
            }

            if (userData.role !== "admin") {
                window.location.href =
                    "/customer/dashboard.html";
                return;
            }

            resolve(userData);

        });

    });

}

export async function requireCustomer() {

    return new Promise((resolve) => {

        auth.onAuthStateChanged(async (user) => {

            if (!user) {
                window.location.href = "/login.html";
                return;
            }

            const userData =
                await getUserData(user.uid);

            if (!userData) {
                window.location.href = "/login.html";
                return;
            }

            resolve(userData);

        });

    });

}