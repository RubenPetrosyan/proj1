// ==========================================
// TRUCK INSURANCE QUESTIONNAIRE
// OPTIMIZED VERSION
// ==========================================

const GEOAPIFY_KEY = "7036f365f5d04562aea31633f8ffd7cc";

document.addEventListener("DOMContentLoaded", () => {

    // Buttons
    document.getElementById("addDriverBtn")?.addEventListener("click", addDriver);
    document.getElementById("addTruckBtn")?.addEventListener("click", addTruck);
    document.getElementById("addTrailerBtn")?.addEventListener("click", addTrailer);
    document.getElementById("addCargoBtn")?.addEventListener("click", addCargo);

    // Submit
    document.getElementById("mainForm")?.addEventListener("submit", validateForm);

    // Initialize
    initializeCoverages();
    initializeAddressAutocomplete();
    initializeFileUpload();

    // Default rows
    addDriver();
    addTruck();
    addTrailer();
    addCargo();
});


// ==========================================
// ADDRESS AUTOCOMPLETE
// ==========================================

function initializeAddressAutocomplete() {
    setupAutocomplete("mailingAddress");
    setupAutocomplete("garagingAddress");
}

function setupAutocomplete(inputId) {

    const input = document.getElementById(inputId);
    if (!input) return;

    const wrapper = input.parentElement;
    wrapper.style.position = "relative";

    const suggestionBox = document.createElement("div");
    suggestionBox.className = "suggestions-box";
    wrapper.appendChild(suggestionBox);

    let debounceTimer;

    input.addEventListener("input", function () {

        clearTimeout(debounceTimer);
        const value = input.value.trim();

        if (value.length < 3) {
            suggestionBox.innerHTML = "";
            return;
        }

        debounceTimer = setTimeout(() => {

            fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(value)}&limit=5&filter=countrycode:us&apiKey=${GEOAPIFY_KEY}`)
                .then(res => res.json())
                .then(data => {

                    suggestionBox.innerHTML = "";

                    data.features?.forEach(feature => {

                        const div = document.createElement("div");
                        div.className = "suggestion-item";
                        div.textContent = feature.properties.formatted;

                        div.addEventListener("click", function () {
                            input.value = feature.properties.formatted;
                            suggestionBox.innerHTML = "";
                        });

                        suggestionBox.appendChild(div);
                    });

                })
                .catch(() => suggestionBox.innerHTML = "");

        }, 300);
    });

    document.addEventListener("click", function (e) {
        if (!wrapper.contains(e.target)) {
            suggestionBox.innerHTML = "";
        }
    });
}


// ==========================================
// FILE UPLOAD
// ==========================================

function initializeFileUpload() {

    const fileInput = document.getElementById("fileInput");
    const fileNameDisplay = document.getElementById("fileName");
    const removeBtn = document.getElementById("removeFileBtn");

    if (!fileInput) return;

    fileInput.addEventListener("change", () => {

        const file = fileInput.files[0];

        if (!file) {
            resetFile();
            return;
        }

        // 25MB limit
        if (file.size > 25 * 1024 * 1024) {
            alert("File must be under 25MB.");
            resetFile();
            return;
        }

        fileNameDisplay.textContent =
            `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;

        removeBtn.style.display = "inline-block";
    });

    removeBtn.addEventListener("click", resetFile);

    function resetFile() {
        fileInput.value = "";
        fileNameDisplay.textContent = "";
        removeBtn.style.display = "none";
    }
}


// ==========================================
// SHARED REMOVE
// ==========================================

function removeItem(button) {
    button.closest(".row-item")?.remove();
}


// ==========================================
// DRIVERS (ONLY 1 OWNER)
// ==========================================

let ownerSelected = false;

function addDriver() {

    const container = document.getElementById("drivers");
    if (!container) return;

    const row = document.createElement("div");
    row.className = "row-item";

    row.innerHTML = `
        <label class="w-type">Type
            <select name="Driver Type">
                <option value="Driver" selected>Driver</option>
                <option value="Owner">Owner</option>
            </select>
        </label>

        <label class="w-name">Name
            <input name="Driver Full Name">
        </label>

        <label class="w-date">DOB
            <input type="date" name="Driver DOB">
        </label>

        <label class="w-license">License #
            <input name="License Number">
        </label>

        <label class="w-state">State
            <input name="License State" maxlength="2"
                oninput="this.value = this.value.toUpperCase()">
        </label>

        <label class="w-date">Hired
            <input type="date" name="Date Hired">
        </label>

        <button type="button" class="remove-btn">
            Remove
        </button>
    `;

    container.appendChild(row);

    const select = row.querySelector("select");
    const removeBtn = row.querySelector(".remove-btn");

    select.addEventListener("change", () => handleOwnerSelection(select));
    removeBtn.addEventListener("click", () => removeDriver(row));
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

        document.querySelectorAll("#drivers select option[value='Owner']")
            .forEach(o => o.disabled = false);
    }
}

function removeDriver(row) {

    const select = row.querySelector("select");

    if (select.value === "Owner") {
        ownerSelected = false;
        document.querySelectorAll("#drivers select option[value='Owner']")
            .forEach(o => o.disabled = false);
    }

    row.remove();
}


// ==========================================
// TRUCKS
// ==========================================

function addTruck() {

    const container = document.getElementById("trucks");
    if (!container) return;

    const row = document.createElement("div");
    row.className = "row-item";

    row.innerHTML = `
        <label class="w-year">Year
            <input type="number" name="Truck Year">
        </label>

        <label class="w-make">Make
            <input name="Truck Make">
        </label>

        <label class="w-trucktype">Type
            <select name="Truck Type">
                <option value="">Type</option>
                <option>Tractor</option>
                <option>Box Truck</option>
                <option>Dump Truck</option>
                <option>Tank Truck</option>
                <option>Tow Truck</option>
                <option>Other</option>
            </select>
        </label>

        <label class="w-gvw">GVW
            <input type="number" name="GVW">
        </label>

        <label class="w-vin">VIN
            <input name="Truck VIN">
        </label>

        <button type="button" class="remove-btn">
            Remove
        </button>
    `;

    container.appendChild(row);

    row.querySelector(".remove-btn")
        .addEventListener("click", () => removeItem(row));
}


// ==========================================
// TRAILERS
// ==========================================

function addTrailer() {

    const container = document.getElementById("trailers");
    if (!container) return;

    const row = document.createElement("div");
    row.className = "row-item";

    row.innerHTML = `
        <label class="w-year">Year
            <input type="number" name="Trailer Year">
        </label>

        <label class="w-make">Make
            <input name="Trailer Make">
        </label>

        <label class="w-trucktype">Type
            <select name="Trailer Type">
                <option value="">Select Type</option>
                <option>Dry Van</option>
                <option>Reefer</option>
                <option>Flatbed</option>
                <option>Tanker</option>
                <option>Other</option>
            </select>
        </label>

        <label class="w-vin">VIN
            <input name="Trailer VIN">
        </label>

        <button type="button" class="remove-btn">
            Remove
        </button>
    `;

    container.appendChild(row);

    row.querySelector(".remove-btn")
        .addEventListener("click", () => removeItem(row));
}


// ==========================================
// CARGO
// ==========================================

function addCargo() {

    const container = document.getElementById("cargo");
    if (!container) return;

    const row = document.createElement("div");
    row.className = "row-item";

    row.innerHTML = `
        <label class="w-name">Commodity
            <input name="Commodity">
        </label>

        <label class="w-year">% 
            <input type="number" name="Commodity Percentage"
                min="0" max="100">
        </label>

        <button type="button" class="remove-btn">
            Remove
        </button>
    `;

    container.appendChild(row);

    row.querySelector(".remove-btn")
        .addEventListener("click", () => {
            row.remove();
            updateCargoTotal();
        });

    row.querySelector("input[name='Commodity Percentage']")
        .addEventListener("input", updateCargoTotal);

    updateCargoTotal();
}

function updateCargoTotal() {

    let total = 0;

    document.querySelectorAll("input[name='Commodity Percentage']")
        .forEach(input => total += Number(input.value) || 0);

    const indicator = document.getElementById("cargoTotal");
    if (!indicator) return;

    indicator.textContent = `Total: ${total}%`;

    indicator.style.color =
        total === 100 ? "#16a34a" :
        total > 100 ? "#dc2626" :
        "#f59e0b";
}


// ==========================================
// COVERAGES
// ==========================================

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
    if (!container) return;

    coverageList.forEach(name => {

        const row = document.createElement("div");
        row.className = "coverage-row";

        const isReefer = name === "Reefer Breakdown";

        row.innerHTML = `
            <strong>${name}</strong>

            <div class="coverage-options">
                <label>
                    <input type="radio" name="${name}" value="Yes">
                    Yes
                </label>
                <label>
                    <input type="radio" name="${name}" value="No" checked>
                    No
                </label>
            </div>

            <div class="coverage-fields" id="${name}-fields">
                ${!isReefer ? `
                    <label>
                        Limit ($)
                        <input type="number" name="${name} Limit" min="0">
                    </label>
                ` : ""}
                <label>
                    Deductible ($)
                    <input type="number" name="${name} Deductible" min="0">
                </label>
            </div>
        `;

        container.appendChild(row);

        const radios = row.querySelectorAll("input[type='radio']");
        const fields = row.querySelector(".coverage-fields");

        radios.forEach(radio => {
            radio.addEventListener("change", () => {
                if (radio.value === "Yes" && radio.checked) {
                    fields.style.display = "flex";
                } else if (radio.value === "No" && radio.checked) {
                    fields.style.display = "none";
                    fields.querySelectorAll("input").forEach(i => i.value = "");
                }
            });
        });
    });
}


// ==========================================
// VALIDATION
// ==========================================

function validateForm(e) {

    const requiredFields = [
        "Company Name | DBA",
        "Phone",
        "Email",
        "DOT#",
        "Mailing Address",
        "Garaging Address"
    ];

    let missing = [];

    requiredFields.forEach(name => {
        const field = document.querySelector(`[name="${name}"]`);
        if (!field || !field.value.trim()) {
            missing.push(name);
        }
    });

    if (missing.length) {
        e.preventDefault();
        alert("Missing required fields:\n\n" + missing.join("\n"));
        return false;
    }

    let total = 0;
    document.querySelectorAll("input[name='Commodity Percentage']")
        .forEach(i => total += Number(i.value) || 0);

    if (total !== 100) {
        e.preventDefault();
        alert("Cargo percentages must equal exactly 100%.");
        return false;
    }

    return true;
}