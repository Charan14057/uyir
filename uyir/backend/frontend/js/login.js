const form = document.querySelector("#loginForm");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = {
      username: document.querySelector("#username")?.value.trim(),
      phone: document.querySelector("#phone")?.value.trim(),
      role: document.querySelector("#role")?.value,
      language: document.querySelector("#language")?.value,
    };

    if (!payload.username || !payload.phone || !payload.role || !payload.language) {
      alert("Please complete all fields.");
      return;
    }

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const user = await response.json();
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "patient") {
        window.location.href = "user-dashboard.html";
      } else if (user.role === "doctor") {
        window.location.href = "doctor-dashboard.html";
      } else {
        window.location.href = "volunteer-dashboard.html";
      }
    } catch (error) {
      alert("Unable to login. Please try again.");
    }
  });
}
