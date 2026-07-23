const main = document.querySelector("main");

async function assignReport(reportId) {
  const response = await fetch(`/reports/${reportId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "Assigned" }),
  });

  if (!response.ok) {
    throw new Error("Unable to assign request");
  }
}

async function loadRequests() {
  if (!main) {
    return;
  }

  try {
    const response = await fetch("/reports");
    const reports = await response.json();
    main.innerHTML = "";

    if (!Array.isArray(reports) || reports.length === 0) {
      main.innerHTML = "<p class='text-gray-500 text-center'>No requests available.</p>";
      return;
    }

    reports.forEach((report) => {
      const card = document.createElement("div");
      card.className = "flex flex-col gap-4 rounded-xl bg-white dark:bg-gray-800 p-4 shadow-card font-bold";

      const statusClass =
        report.status === "Raised" ? "status-raised" : report.status === "Assigned" ? "status-assigned" : "status-completed";
      const statusIcon = report.status === "Completed" ? "check_circle" : "assignment_ind";

      card.innerHTML = `
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1">
            <p class="font-bold text-gray-900 dark:text-white text-lg">${report.type}</p>
            <div class="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400 font-normal">
              <div class="flex items-center gap-1">
                <span class="material-symbols-outlined text-base">info</span>
                <span>Request Type</span>
              </div>
              <div class="status-badge ${statusClass}">
                <span class="material-symbols-outlined text-base">${statusIcon}</span>
                <span>${report.status}</span>
              </div>
            </div>
          </div>
        </div>
        <button class="w-full bg-primary text-white font-bold py-3.5 px-4 rounded-lg text-lg help-btn transition-opacity hover:opacity-90">${report.status === "Raised" ? "Help Now" : "View"}</button>
      `;

      const helpBtn = card.querySelector(".help-btn");
      if (report.status === "Raised") {
        helpBtn.addEventListener("click", async () => {
          try {
            await assignReport(report.id);
            alert("You are assigned to this request.");
            await loadRequests();
          } catch (error) {
            alert("Unable to assign request.");
          }
        });
      } else {
        helpBtn.disabled = true;
        helpBtn.classList.add("opacity-50", "cursor-not-allowed");
      }

      main.appendChild(card);
    });
  } catch (error) {
    main.innerHTML = "<p class='text-red-500 text-center'>Unable to load requests.</p>";
  }
}

loadRequests();
