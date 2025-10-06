async function loadRequests() {
    // Dummy data for testing
    const reports = [
        { type: "Urgent Blood Donation", status: "Raised" },
        { type: "Medical Supplies Delivery", status: "Assigned" },
        { type: "Patient Transport", status: "Completed" }
    ];

    const main = document.querySelector("main");
    main.innerHTML = ''; // Clear existing cards

    reports.forEach(r => {
        const div = document.createElement("div");
        div.classList.add("flex", "flex-col", "gap-4", "rounded-xl", "bg-white", "dark:bg-gray-800", "p-4", "shadow-card", "font-bold");

        const statusClass = r.status === "Raised" ? "status-raised" : r.status === "Assigned" ? "status-assigned" : "status-completed";
        const statusIcon = r.status === "Completed" ? "check_circle" : "assignment_ind";

        div.innerHTML = `
            <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                    <p class="font-bold text-gray-900 dark:text-white text-lg">${r.type}</p>
                    <div class="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400 font-normal">
                        <div class="flex items-center gap-1">
                            <span class="material-symbols-outlined text-base">info</span>
                            <span>Request Type</span>
                        </div>
                        <div class="status-badge ${statusClass}">
                            <span class="material-symbols-outlined text-base">${statusIcon}</span>
                            <span>${r.status}</span>
                        </div>
                    </div>
                </div>
            </div>
            <button class="w-full bg-primary text-white font-bold py-3.5 px-4 rounded-lg text-lg help-btn transition-opacity hover:opacity-90">
                Help Now
            </button>
        `;

        main.appendChild(div);

        div.querySelector(".help-btn").addEventListener("click", () => {
            alert(`You are assigned to this request: ${r.type}`);
            r.status = "Assigned"; // Simulate status update
            loadRequests(); // Reload cards
        });
    });
}

loadRequests();
