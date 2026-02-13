// ===============================
// TRUCK INSURANCE QUESTIONNAIRE – Refactored compact version
// ===============================

document.addEventListener("DOMContentLoaded", () => {
    // Button listeners
    document.getElementById("addDriverBtn")?.addEventListener("click", addDriver);
    document.getElementById("addTruckBtn")?.addEventListener("click", addTruck);
    document.getElementById("addTrailerBtn")?.addEventListener("click", addTrailer);
    document.getElementById("addCargoBtn")?.addEventListener("click", addCargo);

    initializeCoverages();

    // Add one default entry per section
    addDriver();
    addTruck();
    addTrailer();
    addCargo();

    document.getElementById("mainForm")?.addEventListener("submit", validateForm);
});

// ========================
// Shared helper – focus after remove
// ========================
function focusAfterRemove(containerId, addButtonId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const lastItem = container.lastElementChild;
    if (lastItem) {
        const firstInput = lastItem.querySelector("input, select");
        firstInput?.focus();
    } else {
        document.getElementById(addButtonId)?.focus();
    }
}

// ========================
// DRIVERS (one owner only)
// ========================
let ownerSelected = false;

function addDriver() {
    const container = document.getElementById("drivers");
    if (!container) return;

    const row = document.createElement("div");
    row.className = "row-item";

    row.innerHTML = `
        <label>Driver Type
            <select name="Driver Type" onchange="handleOwnerSelection(this)" required>
                <option value="Driver" selected>Driver</option>
                <option value="Owner">Owner</option>
            </select>
        </label>
        <label>Name
            <input name="Driver Full Name" placeholder="Name" required>
        </label>
        <label>DOB
            <input type="date" name="Driver DOB" required>
        </label>
        <label>License #
            <input name="License Number" placeholder="License #" required>
        </label>
        <label>State
            <input name="License State" placeholder="State" required>
        </label>
        <label>Hired
            <input type="date" name="Date Hired" required>
        </label>
        <button type="button" class="remove-btn" onclick="removeItem(this, 'drivers', 'addDriverBtn')">Remove</button>
    `;

    container.appendChild(row);
}

function handleOwnerSelection(select) {
    if (select.value === "Owner") {
        if (ownerSelected) {
            alert("Only one Owner allowed.");
            select.value = "Driver";
            return;
        }
        ownerSelected = true;
        document.querySelectorAll("#drivers select").forEach(s => {
            if (s !== select) {
                s.querySelector('option[value="Owner"]').disabled = true;
            }
        });
    } else {
        ownerSelected = false;
        document.querySelectorAll("#drivers select option[value='Owner']").forEach(o => o.disabled = false);
    }
}

// ========================
// TRUCKS
// ========================
function addTruck() {
    const container = document.getElementById("trucks");
    if (!container) return;

    const row = document.createElement("div");
    row.className = "row-item";

    row.innerHTML = `
        <label>Year
            <input type="number" name="Truck Year" placeholder="Year" required>
        </label>
        <label>Make
            <input name="Truck Make" placeholder="Make" required>
        </label>
        <label>Type
            <select name="Truck Type" required>
                <option value="">Type</option>
                <option>Tractor</option>
                <option>Box</option>
                <option>Flatbed</option>
                <option>Reefer</option>
                <option>Tanker</option>
                <option>Other</option>
            </select>
        </label>
        <label>GVW
            <input type="number" name="GVW" placeholder="GVW" required>
        </label>
        <label>VIN
            <input name="Truck VIN" placeholder="VIN" required>
        </label>
        <button type="button" class="remove-btn" onclick="removeItem(this, 'trucks', 'addTruckBtn')">Remove</button>
    `;

    container.appendChild(row);
}

// ========================
// TRAILERS
// ========================
function addTrailer() {
    const container = document.getElementById("trailers");
    if (!container) return;

    const row = document.createElement("div");
    row.className = "row-item";

    row.innerHTML = `
        <label>Year
            <input type="number" name="Trailer Year" placeholder="Year" required>
        </label>
        <label>Make
            <input name="Trailer Make" placeholder="Make" required>
        </label>
        <label>Type
            <select name="Trailer Type" required>
                <option value="">Type</option>
                <option>Dry Van</option>
                <option>Reefer</option>
                <option>Flatbed</option>
                <option>Tanker</option>
                <option>Other</option>
            </select>
        </label>
        <label>VIN
            <input name="Trailer VIN" placeholder="VIN" required>
        </label>
        <button type="button" class="remove-btn" onclick="removeItem(this, 'trailers', 'addTrailerBtn')">Remove</button>
    `;

    container.appendChild(row);
}

// ========================
// CARGO
// ========================
function addCargo() {
    const container = document.getElementById("cargo");
    if (!container) return;

    const row = document.createElement("div");
    row.className = "row-item";

    row.innerHTML = `
        <label>Commodity
            <input name="Commodity" placeholder="Commodity" required>
        </label>
        <label>%
            <input type="number" name="Commodity Percentage" placeholder="%" min="0" max="100" oninput="updateCargoTotal()" required>
        </label>
        <button type="button" class="remove-btn" onclick="removeCargo(this)">Remove</button>
    `;

    container.appendChild(row);
    updateCargoTotal();
}

// ========================
// SHARED REMOVE FUNCTION (used by trucks, trailers, drivers)
// ========================
function removeItem(button, containerId, addButtonId) {
    button.parentElement.remove();
    focusAfterRemove(containerId, addButtonId);
}

function removeCargo(button) {
    button.parentElement.remove();
    updateCargoTotal();
    focusAfterRemove("cargo", "addCargoBtn");
}

// ========================
// CARGO TOTAL
// ========================
function updateCargoTotal() {
    let total = 0;
    document.querySelectorAll("input[name='Commodity Percentage']").forEach(input => {
        total += Number(input.value) || 0;
    });

    const indicator = document.getElementById("cargoTotal");
    if (indicator) {
        indicator.textContent = `Total: ${total}%`;
        indicator.style.color = total > 100 ? "#dc3545" : total < 100 ? "#fd7e14" : "#28a745";
    }
}

// ========================
// COVERAGE
// ========================
const coverageList = [
    "Auto Liability", "Uninsured Motorist", "Cargo", "Reefer Breakdown",
    "Physical Damage", "Trailer Interchange", "General Liability",
    "Hired Auto", "Non-Trucking Liability"
];

function initializeCoverages() {
    const container = document.getElementById("coverages");
    if (!container) return;

    coverageList.forEach(name => {
        const div = document.createElement("div");
        div.className = "coverage-row";

        div.innerHTML = `
            <strong>${name}</strong>
            <label><input type="radio" name="${name}" value="Yes" onchange="toggleCoverage(this, '${name}')"> Yes</label>
            <label><input type="radio" name="${name}" value="No" checked onchange="toggleCoverage(this, '${name}')"> No</label>

            <div class="coverage-fields" id="${name}-fields" style="display:none;">
                <label>Limit ($)
                    <input type="number" name="${name} Limit" placeholder="Limit" min="0">
                </label>
                <label>Deductible ($)
                    <input type="number" name="${name} Deductible" placeholder="Deductible" min="0">
                </label>
            </div>
        `;
        container.appendChild(div);
    });
}

function toggleCoverage(radio, name) {
    const fields = document.getElementById(`${name}-fields`);
    if (!fields) return;

    const inputs = fields.querySelectorAll("input");

    if (radio.value === "Yes") {
        fields.style.display = "flex";
        fields.style.flexWrap = "wrap";
        fields.style.gap = "16px";
        inputs.forEach(i => i.required = true);
    } else {
        fields.style.display = "none";
        inputs.forEach(i => {
            i.value = "";
            i.required = false;
        });
    }
}

// ========================
// FORM VALIDATION
// ========================
function validateForm(e) {
    let total = 0;
    document.querySelectorAll("input[name='Commodity Percentage']").forEach(input => {
        total += Number(input.value) || 0;
    });

    if (total !== 100) {
        e.preventDefault();
        alert("Cargo percentages must equal exactly 100%.");

        const totalEl = document.getElementById("cargoTotal");
        if (totalEl) {
            totalEl.scrollIntoView({ behavior: "smooth", block: "center" });
            totalEl.style.backgroundColor = "#ffebee";
            setTimeout(() => { totalEl.style.backgroundColor = ""; }, 1500);
        }
        return false;
    }

    // Optional: disable submit button briefly to prevent double-submit
    const submitBtn = document.querySelector(".submit-btn");
    if (submitBtn) {
        submitBtn.disabled = true;
        setTimeout(() => { submitBtn.disabled = false; }, 4000);
    }
}