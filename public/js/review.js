import { db, auth } from "./firebase-config.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const reviewForm = document.getElementById("review-form");
const commentInput = document.getElementById("comment");
const starContainer = document.getElementById("star-rating");
const reviewList = document.getElementById("review-list");

let selectedRating = 0;
const ownerUID = "SNjrJtuDirP1K57RqYaAKG7vPjs2";

starContainer.addEventListener("click", (e) => {
  if (e.target.dataset.value) {
    selectedRating = parseInt(e.target.dataset.value);
    Array.from(starContainer.children).forEach((star, index) => {
      star.classList.toggle("text-warning", index < selectedRating);
    });
  }
});

reviewForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = auth.currentUser;
  if (!user) {
    alert("Silakan login terlebih dahulu.");
    return;
  }

  const comment = commentInput.value.trim();
  if (comment && selectedRating) {
    await addDoc(collection(db, "reviews"), {
      uid: user.uid,
      name: user.displayName || "Anonymous",
      comment,
      rating: selectedRating,
      timestamp: new Date(),
    });

    commentInput.value = "";
    selectedRating = 0;
    loadReviews(user);
  }
});

async function loadReviews(user = null) {
  reviewList.innerHTML = "";
  const q = query(collection(db, "reviews"), orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const div = document.createElement("div");
    div.className = "border p-3 mb-3";

    const stars = "★".repeat(data.rating) + "☆".repeat(5 - data.rating);
    div.innerHTML = `
      <strong>${data.name}</strong><br/>
      <small>${stars}</small><br/>
      <p>${data.comment}</p>
    `;

    if (user?.uid === ownerUID) {
      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.className = "btn btn-sm btn-danger";
      delBtn.onclick = async () => {
        await deleteDoc(doc(db, "reviews", docSnap.id));
        loadReviews(user);
      };
      div.appendChild(delBtn);
    }

    reviewList.appendChild(div);
  });
}

onAuthStateChanged(auth, (user) => {
  loadReviews(user);
});
