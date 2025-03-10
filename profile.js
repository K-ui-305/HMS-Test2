let userInfo;
let user;
let allBData = [];
let allInHData = [];
let allArchData = [];
let allCashData = [];
let allCashArchData = [];
let navBrand = document.querySelector(".navbar-brand");
let logoutBtn = document.querySelector('.logout-btn');
let bookingForm = document.querySelector(".booking-form");
let allBInput = bookingForm.querySelectorAll("input");
let bTextarea = bookingForm.querySelector("textarea");
let inHouseForm = document.querySelector(".inhouse-form");
let allInHInput = inHouseForm.querySelectorAll("input");
let InHTextarea = inHouseForm.querySelector("textarea");
let modalCBtn = document.querySelectorAll(".btn-close");
let bListTBody = document.querySelector(".booking-list");
let inHListTBody = document.querySelector(".inhouse-list");
let archListTBody = document.querySelector(".archive-list");
let bRegBtn = document.querySelector(".b-register-btn");
let inHRegBtn = document.querySelector(".in-house-reg-btn");
let allTabBtn = document.querySelectorAll(".tab-btn");
let searchEl = document.querySelector(".search-input");
let cashierBtn = document.querySelector(".cashier-tab");
let cashierTab = document.querySelector("#cashier");
let bookingTab = document.querySelector("#booking");
let cashierForm = document.querySelector(".cashier-form");
let allCInput = cashierForm.querySelectorAll("input");
let cashBtn = document.querySelector(".cash-btn");
let cashierTbody = document.querySelector(".cashier-list");
let cashTotal = document.querySelector(".total");
let closeCashierBtn = document.querySelector(".close-cashier-btn");
let cashierArchTbody = document.querySelector(".cashier-arch-list");
let archTotal = document.querySelector(".arch-total");
let allPrintBtn = document.querySelectorAll(".print-btn");
let archPrintBtn = document.querySelector(".arch-print-btn");
let cashierTabPane = document.querySelector(".cashier-tab-pane");
let allTotalBtn = document.querySelectorAll(".total-btn");
let showBRoomsEl = document.querySelector(".show-booking-rooms");
let showHRoomsEl = document.querySelector(".show-inhouse-rooms");
// Profile.js - Updated with Backend Integration, Error Handling, and Loading States

document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Fetch user info
        const response = await fetch("/api/user/profile");
        if (!response.ok) throw new Error("Failed to fetch user info");
        userInfo = await response.json();
        user = userInfo.user;
        updateUI();
    } catch (error) {
        console.error("Error loading user info:", error);
    }

    // Fetch all data
    await fetchBookings();
    await fetchInHouseData();
    await fetchCashierData();
});

async function fetchBookings() {
    try {
        const response = await fetch("/api/booking/allBData");
        if (!response.ok) throw new Error("Failed to fetch bookings");
        allBData = await response.json();
        renderBookings();
    } catch (error) {
        console.error("Error fetching bookings:", error);
    }
}

async function fetchInHouseData() {
    try {
        const response = await fetch("/api/inhouse/allInHData");
        if (!response.ok) throw new Error("Failed to fetch in-house data");
        allInHData = await response.json();
        renderInHouseData();
    } catch (error) {
        console.error("Error fetching in-house data:", error);
    }
}

async function fetchCashierData() {
    try {
        const response = await fetch("/api/cashier/allCashData");//endpoint not found
        if (!response.ok) throw new Error("Failed to fetch cashier data");
        allCashData = await response.json();
        renderCashierData();
    } catch (error) {
        console.error("Error fetching cashier data:", error);
    }
}

// Event Listener for Booking Form Submission
bookingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
        const formData = new FormData(bookingForm);
        const bookingData = Object.fromEntries(formData.entries());
        
        // Validate dates
        const checkIn = new Date(bookingData.checkInDate);
        const checkOut = new Date(bookingData.checkOutDate);
        if (checkOut <= checkIn) {
            throw new Error("Check-out date must be after check-in date");
        }
        
        const response = await fetch("/api/booking/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookingData)
        });
        if (!response.ok) throw new Error("Booking registration failed");
        await fetchBookings();
    } catch (error) {
        console.error("Error registering booking:", error);
        alert(error.message);
    }
});

// Event Listener for In-House Form Submission
inHouseForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
        const formData = new FormData(inHouseForm);
        const inHouseData = Object.fromEntries(formData.entries());
        
        const response = await fetch("/api/inhouse/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(inHouseData)
        });
        if (!response.ok) throw new Error("In-House registration failed");
        await fetchInHouseData();
    } catch (error) {
        console.error("Error registering in-house data:", error);
        alert(error.message);
    }
});

// Event Listener for Cashier Form Submission
cashierForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
        const formData = new FormData(cashierForm);
        const cashierData = Object.fromEntries(formData.entries());
        
        const response = await fetch("/api/cashier/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cashierData)
        });
        if (!response.ok) throw new Error("Cashier registration failed");
        await fetchCashierData();
    } catch (error) {
        console.error("Error registering cashier data:", error);
        alert(error.message);
    }
});

function updateUI() {
    document.getElementById("username").textContent = user.username;
    document.getElementById("userRole").textContent = user.role;
}

function renderBookings() {
    bListTBody.innerHTML = allBData.map(booking => `
        <tr>
            <td>${booking.fullname}</td>
            <td>${booking.location}</td>
            <td>${booking.roomNo}</td>
            <td>${booking.checkInDate}</td>
            <td>${booking.checkOutDate}</td>
            <td>${booking.price}</td>
        </tr>
    `).join('');
}

function renderInHouseData() {
    inHListTBody.innerHTML = allInHData.map(data => `
        <tr>
            <td>${data.fullname}</td>
            <td>${data.roomNo}</td>
            <td>${data.checkInDate}</td>
            <td>${data.status}</td>
        </tr>
    `).join('');
}

function renderCashierData() {
    cashierTbody.innerHTML = allCashData.map(data => `
        <tr>
            <td>${data.transactionId}</td>
            <td>${data.amount}</td>
            <td>${data.paymentMethod}</td>
            <td>${data.date}</td>
        </tr>
    `).join('');
}
