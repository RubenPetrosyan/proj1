// ===============================
// TRUCK INSURANCE QUESTIONNAIRE - JavaScript
// Improved version: Better accessibility, labels, focus management,
// cleaner code, and polished UX
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    // Button listeners
    document.getElementById("addDriverBtn").addEventListener("click", addDriver);
    document.getElementById("addTruckBtn").addEventListener("click", addTruck);
    document.getElementById("addTrailerBtn").addEventListener("click", addTrailer);
    document.getElementById("addCargoBtn").addEventListener("click", addCargo);

    // Initialize sections
    initializeCoverages();

    // Add one default row to each dynamic section
    addDriver();
    addTruck();
    addTrailer();
    addCargo();

    // Form submission
    document.getElementById("mainForm").addEventListener("submit", validateForm);
});

// ===============================
// HELPER: Focus management after removal
// ===============================
function focusAfterRemove(containerId, addButtonId) {
    const container = document.getElementById(containerId);
    const lastCard = container.lastElementChild;

    if (lastCard) {
        // Focus first input/select inside the last remaining card
        const firstField = lastCard.querySelector("input, select");
        if (firstField) firstField.focus();
    } else {
        // No cards left → focus the "Add" button
        document.getElementById(addButtonId).focus();
    }
}

// ===============================
// DRIVER SECTION (Single Owner Rule)
// ===============================
let ownerSelected = false;

function addDriver() {
    const container = document.getElementById("drivers");
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
        <label>Driver Type
            <select name="Driver Type" onchange="handleOwnerSelection(this)" required>
                <option value="Driver" selected>Driver</option>
                <option value="Owner">Owner</option>
            </select>
        </label>

        <label>Full Name
            <input name="Driver Full Name" placeholder="Full Name" required>
        </label>

        <label>Date of Birth
            <input type="date" name="Driver DOB" required>
        </label>

        <label>License Number
            <input name="License Number" placeholder="License Number" required>
        </label>

        <label>License State
            <input name="License State" placeholder="License State" required>
        </label>

        <label>Date Hired
            <input type="date" name="Date Hired" required>
        </label>

        <button type="button" class="remove-btn" onclick="removeDriver(this)">Remove</button>
    `;

    container.appendChild(div);
}

function handleOwnerSelection(select) {
    if (select.value === "Owner") {
        if (ownerSelected) {
            alert("Only one Owner is allowed.");
            select.value = "Driver";
            return;
        }
        ownerSelected = true;

        // Disable Owner option in all other driver selects
        document.querySelectorAll("#drivers select").forEach(s => {
            if (s !== select) {
                s.querySelector('option[value="Owner"]').disabled = true;
            }
        });
    } else {
        ownerSelected = false;

        // Re-enable Owner option everywhere
        document.querySelectorAll("#drivers select option[value='Owner']")
            .forEach(o => o.disabled = false);
    }
}

function removeDriver(button) {
    const card = button.parentElement;
    const wasOwner = card.querySelector("select").value === "Owner";

    card.remove();

    if (wasOwner) {
        ownerSelected = false;
        document.querySelectorAll("#drivers select option[value='Owner']")
            .forEach(o => o.disabled = false);
    }

    focusAfterRemove("drivers", "addDriverBtn");
}

// ===============================
// TRUCK SECTION
// ===============================
function addTruck() {
    const container = document.getElementById("trucks");
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
        <label>Year
            <input type="number" name="Truck Year" placeholder="Year" required>
        </label>

        <label>Make
            <input name="Truck Make" placeholder="Make" required>
        </label>

        <label>Type
            <select name="Truck Type" required>
                <option value="">Select Type</option>
                <option>Tractor</option>
                <option>Box Truck</option>
                <option>Flatbed</option>
                <option>Refrigerated</option>
                <option>Tanker</option>
                <option>Other</option>
            </select>
        </label>

        <label>GVW (Gross Vehicle Weight)
            <input type="number" name="GVW" placeholder="GVW" required>
        </label>

        <label>VIN
            <input name="Truck VIN" placeholder="VIN" required>
        </label>

        <button type="button" class="remove-btn" onclick="removeTruck(this)">Remove</button>
    `;

    container.appendChild(div);
}

function removeTruck(button) {
    button.parentElement.remove();
    focusAfterRemove("trucks", "addTruckBtn");
}

// ===============================
// TRAILER SECTION
// ===============================
function addTrailer() {
    const container = document.getElementById("trailers");
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
        <label>Year
            <input type="number" name="Trailer Year" placeholder="Year" required>
        </label>

        <label>Make
            <input name="Trailer Make" placeholder="Make" required>
        </label>

        <label>Type
            <select name="Trailer Type" required>
                <option value="">Select Type</option>
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

        <button type="button" class="remove-btn" onclick="removeTrailer(this)">Remove</button>
    `;

    container.appendChild(div);
}

function removeTrailer(button) {
    button.parentElement.remove();
    focusAfterRemove("trailers", "addTrailerBtn");
}

// ===============================
// CARGO SECTION
// ===============================
function addCargo() {
    const container = document.getElementById("cargo");
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
        <label>Commodity Transported
            <input name="Commodity" placeholder="Commodity Transported" required>
        </label>

        <label>Percentage of Total Revenue (%)
            <input type="number" name="Commodity Percentage"
                   placeholder="% of Total Revenue"
                   min="0" max="100"
                   oninput="updateCargoTotal()" required>
        </label>

        <button type="button" class="remove-btn"
                onclick="removeCargo(this)">Remove</button>
    `;

    container.appendChild(div);
    updateCargoTotal();   // Refresh total after adding
}

function removeCargo(button) {
    button.parentElement.remove();
    updateCargoTotal();
    focusAfterRemove("cargo", "addCargoBtn");
}

function updateCargoTotal() {
    let total = 0;

    document.querySelectorAll("input[name='Commodity Percentage']").forEach(input => {
        const value = parseFloat(input.value) || 0;
        total += value;
    });

    const indicator = document.getElementById("cargoTotal");
    indicator.textContent = `Total: ${total}%`;

    if (total > 100) {
        indicator.style.color = "#dc3545";
    } else if (total < 100) {
        indicator.style.color = "#fd7e14";
    } else {
        indicator.style.color = "#28a745";
    }
}

// ===============================
// COVERAGE SECTION
// ===============================
const coverageList = [
    "Auto Liability",
    "Uninsured Motorist",
    "Cargo",
    "Reefer Breakdown",
    "Physical Damage",
    "Trailer Interchange",
    "General Liability",
    "Hired Auto",
    "Non-Trucking Liability"
];

function initializeCoverages() {
    const container = document.getElementById("coverages");

    coverageList.forEach(name => {
        const div = document.createElement("div");
        div.className = "coverage-row";

        div.innerHTML = `
            <strong>${name}</strong>

            <label>
                <input type="radio" name="${name}" value="Yes"
                       onchange="toggleCoverage(this, '${name}')">
                Yes
            </label>

            <label>
                <input type="radio" name="${name}" value="No"
                       checked onchange="toggleCoverage(this, '${name}')">
                No
            </label>

            <div class="coverage-fields" id="${name}-fields">
                <label>Limit ($)
                    <input type="number" name="${name} Limit"
                           placeholder="Limit ($)" min="0">
                </label>

                <label>Deductible ($)
                    <input type="number" name="${name} Deductible"
                           placeholder="Deductible ($)" min="0">
                </label>
            </div>
        `;

        container.appendChild(div);
    });
}

function toggleCoverage(radio, name) {
    const fields = document.getElementById(name + "-fields");
    const inputs = fields.querySelectorAll("input");

    if (radio.value === "Yes") {
        fields.style.display = "block";
        inputs.forEach(i => i.required = true);
    } else {
        fields.style.display = "none";
        inputs.forEach(i => {
            i.value = "";
            i.required = false;
        });
    }
}

// ===============================
// FORM VALIDATION
// ===============================
function validateForm(e) {
    let total = 0;

    document.querySelectorAll("input[name='Commodity Percentage']").forEach(input => {
        total += parseFloat(input.value) || 0;
    });

    if (total !== 100) {
        alert("Cargo percentages must add up to exactly 100%.");
        e.preventDefault();
        document.getElementById("cargoTotal").scrollIntoView({ behavior: "smooth" });
        return false;
    }

    // You can add more validations here in the future
}