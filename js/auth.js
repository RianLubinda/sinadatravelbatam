// import { auth, provider } from "./firebase-config.js";
// import {
//   signInWithPopup,
//   signOut,
//   onAuthStateChanged,
// } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// const loginBtn = document.getElementById("loginBtn");
// const logoutBtn = document.getElementById("logoutBtn");
// const userInfo = document.getElementById("userInfo");

// // Login
// loginBtn.addEventListener("click", () => {
//   signInWithPopup(auth, provider).catch((error) => {
//     console.error("Login gagal:", error.message);
//     alert("Login gagal. Silakan coba lagi.");
//   });
// });

// // Logout
// logoutBtn.addEventListener("click", () => {
//   signOut(auth);
// });

// // Update UI login/logout
// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     loginBtn.style.display = "none";
//     logoutBtn.style.display = "inline-block";
//     userInfo.textContent = `Logged in as ${user.displayName || user.email}`;
//   } else {
//     loginBtn.style.display = "inline-block";
//     logoutBtn.style.display = "none";
//     userInfo.textContent = "";
//   }
// });
