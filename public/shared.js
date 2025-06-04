const token = localStorage.getItem("shatova_token");
if (!token) window.location.href = "/login.html";

let currentUserPhone = null;

async function fetchUser() {
  try {
    const res = await fetch("https://shatova.onrender.com/api/shatova/V1/dashboard", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!data.success) throw new Error("Invalid token");

    const user = data.user;
    currentUserPhone = user.phone;

    // If profile elements exist on the page, fill them
    document.getElementById("userName")?.textContent = user.first_name;
    document.getElementById("userEmail")?.textContent = user.email;
    document.getElementById("userPhone")?.textContent = user.phone;
    document.getElementById("userBalance")?.textContent = parseFloat(user.balance).toFixed(2);
    document.getElementById("created_at")?.textContent = new Date(user.created_at).toLocaleDateString();
  } catch (err) {
    alert("Session expired");
    logout();
  }
}

function logout() {
  localStorage.removeItem("shatova_token");
  window.location.href = "/login.html";
}
