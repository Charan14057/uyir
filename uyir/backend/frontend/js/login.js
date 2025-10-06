const form = document.querySelector("form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = form.querySelector('input[type="text"]').value;
  const phone = form.querySelector('input[type="tel"]').value;
  const role = form.querySelector('select').value;
  const language = form.querySelectorAll('select')[1].value;

  const res = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, phone, role, language }),
  });
  const data = await res.json();

  localStorage.setItem("user", JSON.stringify(data)); // store logged-in user

  if (role === "Patient") location.href = "user-dashboard.html";
  else if (role === "Doctor") location.href = "doctor-dashboard.html";
  else location.href = "volunteer-dashboard.html";
});
