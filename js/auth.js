import { auth, provider } from "./firebase-config.js";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

let currentUser = null;

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userInfo = document.getElementById("userInfo");

// Login
loginBtn.addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .catch((error) => {
      console.error("Login gagal:", error.message);
      alert("Login gagal. Silakan coba lagi.");
    });
});

// Logout
logoutBtn.addEventListener("click", () => {
  signOut(auth);
});

// Cek status login
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    userInfo.textContent = `Logged in as ${user.displayName}`;
  } else {
    currentUser = null;
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    userInfo.textContent = "";
  }

  // Jika ada fungsi loadReviews, panggil untuk refresh data
  if (typeof loadReviews === "function") loadReviews(currentUser);
});

export { currentUser };
