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
const showMoreBtn = document.getElementById("show-more-btn");
const hideReviewsBtn = document.getElementById("hide-reviews-btn");

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
      uid: user.uid,                 // ubah dari userId ke uid
      name: user.displayName || "Anonymous",
      comment: comment,              // ubah dari text ke comment
      rating: selectedRating,
      timestamp: new Date(),         // ubah dari createdAt ke timestamp
    });

    commentInput.value = "";
    selectedRating = 0;
    loadReviews(user);
  }
});

async function loadReviews(user = null) {
  reviewList.innerHTML = "";
  if (showMoreBtn) showMoreBtn.style.display = "none";
  if (hideReviewsBtn) hideReviewsBtn.style.display = "none";

  const q = query(collection(db, "reviews"), orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);

  const reviews = [];
  snapshot.forEach((docSnap) => {
    reviews.push({ id: docSnap.id, data: docSnap.data() });
  });

  const maxVisible = 6;
  const initialReviews = reviews.slice(0, maxVisible);

  renderReviews(initialReviews, user);

  if (reviews.length > maxVisible && showMoreBtn && hideReviewsBtn) {
    showMoreBtn.style.display = "inline-block";

    showMoreBtn.onclick = () => {
      renderReviews(reviews, user);
      showMoreBtn.style.display = "none";
      hideReviewsBtn.style.display = "inline-block";
    };

    hideReviewsBtn.onclick = () => {
      renderReviews(initialReviews, user);
      hideReviewsBtn.style.display = "none";
      showMoreBtn.style.display = "inline-block";
    };
  }
}

function renderReviews(reviewsToRender, user) {
  reviewList.innerHTML = "";

  reviewsToRender.forEach(({ id, data }) => {
    const div = document.createElement("div");
    div.className = "border p-3 mb-3";

    const stars = "★".repeat(data.rating) + "☆".repeat(5 - data.rating);
    div.innerHTML = `
      <strong>${data.name}</strong><br/>
      <small>${stars}</small><br/>
      <p>${data.comment}</p>
    `;

    // Hanya ownerUID yang bisa hapus review
    if (user?.uid === ownerUID) {
      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.className = "btn btn-sm btn-danger";
      delBtn.onclick = async () => {
        await deleteDoc(doc(db, "reviews", id));
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
