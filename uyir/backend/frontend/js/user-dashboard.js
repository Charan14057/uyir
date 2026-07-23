const user = JSON.parse(localStorage.getItem("user") || "null");
const historyContainer = document.querySelector("#reportList");
const helpButton = document.querySelector("#helpButton");
const logoutLink = Array.from(document.querySelectorAll("footer a")).find((anchor) =>
  anchor.textContent?.toLowerCase().includes("log out")
);

if (!user?.id) {
  window.location.href = "index.html";
}

if (helpButton) {
  helpButton.addEventListener("click", () => {
    window.location.href = "report.html";
  });
}

if (logoutLink) {
  logoutLink.addEventListener("click", (event) => {
    event.preventDefault();
    localStorage.removeItem("user");
    window.location.href = "index.html";
  });
}

async function loadReports() {
  if (!historyContainer) {
    return;
  }

  try {
    const response = await fetch(`/reports?userId=${encodeURIComponent(user.id)}`);
    const reports = await response.json();

    if (!Array.isArray(reports) || reports.length === 0) {
      historyContainer.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-center">No reports yet.</p>';
      return;
    }

    historyContainer.innerHTML = "";
    reports.forEach((report) => {
      const statusTone = report.status === "Completed" ? "green" : report.status === "Assigned" ? "yellow" : "red";
      const card = document.createElement("div");
      card.className = "bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center justify-between";
      card.innerHTML = `
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-${statusTone}-100 dark:bg-${statusTone}-900/50 rounded-lg flex items-center justify-center">
            <span class="material-symbols-outlined text-${statusTone}-500 dark:text-${statusTone}-400">check_circle</span>
          </div>
          <div>
            <p class="font-bold text-gray-800 dark:text-gray-100">${report.type}</p>
            <p class="text-sm text-${statusTone}-600 dark:text-${statusTone}-400 font-medium">${report.status}</p>
          </div>
        </div>
        <span class="material-symbols-outlined text-gray-400 dark:text-gray-500">chevron_right</span>
      `;
      historyContainer.appendChild(card);
    });
  } catch (error) {
    historyContainer.innerHTML = '<p class="text-red-500 text-center">Unable to load reports.</p>';
  }
}

loadReports();
