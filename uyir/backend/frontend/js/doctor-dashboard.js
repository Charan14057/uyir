const container = document.querySelector("#casesContainer");
const urgentBanner = document.querySelector("#urgentBanner");

async function updateStatus(reportId, status) {
  const response = await fetch(`/reports/${reportId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error("Unable to update report");
  }
}

async function loadCases() {
  if (!container) {
    return;
  }

  try {
    const response = await fetch("/reports");
    const reports = await response.json();

    if (!Array.isArray(reports) || reports.length === 0) {
      container.innerHTML = "<p class='text-gray-500 text-center py-10'>No active cases yet.</p>";
      urgentBanner?.classList.add("hidden");
      return;
    }

    urgentBanner?.classList.toggle("hidden", !reports.some((item) => item.urgency === "High" && item.status !== "Completed"));
    container.innerHTML = "";

    reports.forEach((report) => {
      const card = document.createElement("div");
      card.className = "bg-white rounded-xl shadow-md border border-gray-100 p-5 flex flex-col";
      card.innerHTML = `
        <div class="flex justify-between items-start mb-4 gap-3">
          <h4 class="text-xl font-bold">${report.type}</h4>
          <span class="inline-block px-4 py-1 text-sm font-semibold rounded-full ${report.status === "Raised" ? "status-raised" : report.status === "Assigned" ? "status-assigned" : "status-completed"}">${report.status}</span>
        </div>
        <p class="text-text-secondary mb-4 text-sm">${report.description}</p>
        <button class="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg text-base assist-btn">${report.status === "Completed" ? "Completed" : "Mark Completed"}</button>
      `;

      const actionButton = card.querySelector(".assist-btn");
      if (report.status === "Completed") {
        actionButton.disabled = true;
        actionButton.classList.add("opacity-50", "cursor-not-allowed");
      } else {
        actionButton.addEventListener("click", async () => {
          try {
            await updateStatus(report.id, "Completed");
            await loadCases();
          } catch (error) {
            alert("Unable to update report status.");
          }
        });
      }

      container.appendChild(card);
    });
  } catch (error) {
    container.innerHTML = "<p class='text-red-500 text-center py-10'>Unable to load cases.</p>";
  }
}

loadCases();
