const user = JSON.parse(localStorage.getItem("user"));
const submitBtn = document.querySelector("button.w-full");

submitBtn.addEventListener("click", async () => {
  const type = document.querySelector("div.grid button.active")?.innerText || "Other";
  const description = document.querySelector("textarea").value;
  const urgencyBtn = document.querySelector("div.flex button.active")?.innerText || "Low";

  // For simplicity, we mock location
  const location = "Auto-detected location";

  const res = await fetch("http://localhost:3000/report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: user.id,
      type,
      description,
      urgency: urgencyBtn,
      location,
    }),
  });

  const data = await res.json();
  alert("Report submitted!");
  window.location.href = "user-dashboard.html";
});

// Optional: add click toggling for urgency and type buttons
document.querySelectorAll("div.grid button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("div.grid button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

document.querySelectorAll("div.flex.justify-between button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("div.flex.justify-between button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

