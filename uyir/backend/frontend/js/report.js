const user = JSON.parse(localStorage.getItem("user") || "null");

if (!user?.id) {
  window.location.href = "index.html";
}

const reportButtons = document.querySelectorAll(".report-btn");
const emergencyButtons = document.querySelectorAll(".emergency-btn");
const descriptionEl = document.querySelector("#description");
const submitBtn = document.querySelector("#submitReport");

let selectedType = document.querySelector(".report-btn[data-type]")?.dataset.type || "";
let emergencyLevel = document.querySelector(".emergency-btn[data-level]")?.dataset.level || "";

reportButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedType = button.dataset.type;
    reportButtons.forEach((item) => item.classList.remove("bg-primary", "text-white"));
    button.classList.add("bg-primary", "text-white");
  });
});

emergencyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    emergencyLevel = button.dataset.level;
    emergencyButtons.forEach((item) => item.classList.remove("ring-2", "ring-primary"));
    button.classList.add("ring-2", "ring-primary");
  });
});

if (submitBtn) {
  submitBtn.addEventListener("click", async () => {
    const description = descriptionEl?.value.trim();
    if (!selectedType || !emergencyLevel || !description) {
      alert("Please fill out all fields before submitting.");
      return;
    }

    try {
      const response = await fetch("/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          type: selectedType,
          description,
          urgency: emergencyLevel,
          location: "Auto-detected location",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit report");
      }

      alert("Report submitted successfully.");
      window.location.href = "user-dashboard.html";
    } catch (error) {
      alert("Unable to submit report. Please try again.");
    }
  });
}
