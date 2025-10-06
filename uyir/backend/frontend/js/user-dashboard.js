const user = JSON.parse(localStorage.getItem("user"));
const historySection = document.querySelector("main section");

// Fetch all reports for this user
async function loadReports() {
  const res = await fetch("http://localhost:3000/reports");
  const reports = await res.json();

  const userReports = reports.filter(r => r.userId === user.id);

  historySection.innerHTML = `<h2 class="text-xl font-bold mb-4">History of Reports</h2>`;

  userReports.forEach(r => {
    const statusColor = r.status === "Completed" ? "green" : r.status === "Assigned" ? "yellow" : "red";

    const div = document.createElement("div");
    div.classList.add("bg-white", "dark:bg-gray-800", "p-4", "rounded-lg", "shadow-md", "flex", "items-center", "justify-between", "mb-3");
    div.innerHTML = `
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-${statusColor}-100 dark:bg-${statusColor}-900/50 rounded-lg flex items-center justify-center">
          <span class="material-symbols-outlined text-${statusColor}-500 dark:text-${statusColor}-400">check_circle</span>
        </div>
        <div>
          <p class="font-bold text-gray-800 dark:text-gray-100">${r.type}</p>
          <p class="text-sm text-${statusColor}-600 dark:text-${statusColor}-400 font-medium">${r.status}</p>
        </div>
      </div>
      <span class="material-symbols-outlined text-gray-400 dark:text-gray-500">chevron_right</span>
    `;
    historySection.appendChild(div);
  });
}

loadReports();
