async function loadCases() {
  const res = await fetch("http://localhost:3000/reports");
  const reports = await res.json();

  const main = document.querySelector("main");
  main.innerHTML = '';

  reports.forEach(r => {
    const div = document.createElement("div");
    div.classList.add("bg-white", "rounded-xl", "shadow-md", "border", "border-gray-100", "p-5", "flex", "flex-col", "mb-4");
    div.innerHTML = `
      <div class="flex justify-between items-start mb-4">
        <h4 class="text-2xl font-bold">${r.type}</h4>
        <span class="inline-block px-4 py-1 text-sm font-semibold rounded-full ${r.status === "Raised" ? "status-raised" : r.status === "Assigned" ? "status-assigned" : "status-completed"}">${r.status}</span>
      </div>
      <p class="text-text-secondary mb-4 text-sm">${r.description}</p>
      <button class="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg text-base assist-btn">${r.status === "Completed" ? "View Details" : "Assist"}</button>
    `;
    main.appendChild(div);

    div.querySelector(".assist-btn").addEventListener("click", async () => {
      if(r.status !== "Completed") {
        await fetch("http://localhost:3000/report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...r, status: "Completed" })
        });
        alert("Marked as Completed!");
        loadCases();
      }
    });
  });
}

loadCases();

