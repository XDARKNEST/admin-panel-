import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, doc, updateDoc, deleteDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// 🔹 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCnXwWJMS65N45KU-tFe6dbhOkqoLPjHek",
  authDomain: "gtpspaymentv1.firebaseapp.com",
  projectId: "gtpspaymentv1",
  storageBucket: "gtpspaymentv1.firebasestorage.app",
  messagingSenderId: "109225654371",
  appId: "1:109225654371:web:a7f3a05b97183e3f9ee056"
};

// 🔹 Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const validRoles = [
  "Premium WLS 1",
  "Premium WLS 5",
  "Premium WLS 10",
  "VIP 1DL",
  "SUPER VIP",
  "MODS 5DL",
  "ADMIN 8DL",
  "COMMUNITY MANAGER 13DL",
  "CREATOR"
];

const ordersTable = document.getElementById("ordersTable");

onSnapshot(collection(db, "orders"), (snapshot) => {
  ordersTable.innerHTML = "";
  if (snapshot.empty) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="6" style="text-align:center; color:#94a3b8; font-style:italic;">🚫 Belum ada order</td>`;
    ordersTable.appendChild(row);
    return;
  }
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const row = document.createElement("tr");
    let premium = validRoles.includes(data.order) ? data.order : "Tidak dipilih";
    const tanggal = data.date || new Date().toLocaleString("id-ID", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit"
    });
    const status = data.status || "pending";

    row.innerHTML = `
      <td>${data.username || "-"}</td>
      <td>${premium}</td>
      <td>${data.payment || "-"}</td>
      <td>${tanggal}</td>
      <td>${status}</td>
      <td>
        <button ${status === "sukses" ? "disabled" : ""} 
          onclick="markSukses('${docSnap.id}')">✅ Sukses</button>
      </td>
    `;
    ordersTable.appendChild(row);
  });
});

window.markSukses = async (id) => {
  const ref = doc(db, "orders", id);
  await updateDoc(ref, { status: "sukses" });
};

window.clearOrders = async () => {
  if (confirm("Apakah kamu yakin ingin menghapus semua orders?")) {
    const querySnapshot = await getDocs(collection(db, "orders"));
    querySnapshot.forEach(async (docSnap) => {
      await deleteDoc(doc(db, "orders", docSnap.id));
    });
  }
};
