// ==========================================
// TRUCK INSURANCE QUESTIONNAIRE
// REFACTORED - SINGLE FILE VERSION
// ==========================================

const GEOAPIFY_KEY = "7036f365f5d04562aea31633f8ffd7cc";

document.addEventListener("DOMContentLoaded", () => {

    // Add Buttons
    document.getElementById("addDriverBtn")?.addEventListener("click", addDriver);
    document.getElementById("addTruckBtn")?.addEventListener("click", addTruck);
    document.getElementById("addTrailerBtn")?.addEventListener("click", addTrailer);
    document.getElementById("addCargoBtn")?.addEventListener("click", addCargo);

    // Form Submit
    document.getElementById("mainForm")?.addEventListener("submit", validateForm);

    // Initialize Features
    initializeCoverages();
    initializeAddressAutocomplete();
    initializeFileUpload();

    // Default Rows
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

                    data.features.forEach(feature => {

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
// SINGLE FILE UPLOAD
// ==========================================

function initializeFileUpload() {

    const fileInput = document.getElementById("fileInput");
    const fileNameDisplay = document.getElementById("fileName");

    if (!fileInput) return;

    fileInput.addEventListener("change", () => {

        const file = fileInput.files[0];

        if (!file) {
            fileNameDisplay.textContent = "";
            return;
        }

        // 10MB safe limit
        if (file.size > 10 * 1024 * 1024) {
            alert("File must be under 10MB.");
            fileInput.value = "";
            fileNameDisplay.textContent = "";
            return;
        }

        fileNameDisplay.textContent =
            `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
    });
}


// ==========================================
// SHARED REMOVE
// ==========================================

function removeItem(button) {
    button.closest(".row-item").remove();
}


// ==========================================
// DRIVERS (ONLY 1 OWNER)
// ==========================================

let ownerSelected = false;

function addDriver() {

    const container = document.getElementById("drivers");

    const row = document.createElement("div");
    row.className = "row-item";

    row.innerHTML = `
        <label class="w-type">Type
            <select name="Driver Type" onchange="handleOwnerSelection(this)">
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

        <button type="button" class="remove-btn" onclick="removeDriver(this)">
            Remove
        </button>
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

        document.querySelectorAll("#drivers select option[value='Owner']")
            .forEach(o => o.disabled = false);
    }
}

function removeDriver(button) {

    const row = button.closest(".row-item");
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
                <option>Box</option>
                <option>Flatbed</option>
                <option>Reefer</option>
                <option>Tanker</option>
                <option>Other</option>
            </select>
        </label>

        <label class="w-gvw">GVW
            <input type="number" name="GVW">
        </label>

        <label class="w-vin">VIN
            <input name="Truck VIN">
        </label>

        <button type="button" class="remove-btn" onclick="removeItem(this)">
            Remove
        </button>
    `;

    container.appendChild(row);
}


// ==========================================
// TRAILERS
// ==========================================

function addTrailer() {

    const container = document.getElementById("trailers");

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
                <option value="">Type</option>
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

        <button type="button" class="remove-btn" onclick="removeItem(this)">
            Remove
        </button>
    `;

    container.appendChild(row);
}


// ==========================================
// CARGO
// ==========================================

function addCargo() {

    const container = document.getElementById("cargo");

    const row = document.createElement("div");
    row.className = "row-item";

    row.innerHTML = `
        <label class="w-name">Commodity
            <input name="Commodity">
        </label>

        <label class="w-year">% 
            <input type="number" name="Commodity Percentage"
                min="0" max="100"
                oninput="updateCargoTotal()">
        </label>

        <button type="button" class="remove-btn" onclick="removeCargo(this)">
            Remove
        </button>
    `;

    container.appendChild(row);

    updateCargoTotal();
}

function removeCargo(button) {
    button.closest(".row-item").remove();
    updateCargoTotal();
}

function updateCargoTotal() {

    let total = 0;

    document.querySelectorAll("input[name='Commodity Percentage']")
        .forEach(input => total += Number(input.value) || 0);

    const indicator = document.getElementById("cargoTotal");

    indicator.textContent = `Total: ${total}%`;

    indicator.style.color =
        total === 100 ? "#28a745" :
        total > 100 ? "#dc3545" :
        "#fd7e14";
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

    coverageList.forEach(name => {

        const row = document.createElement("div");
        row.className = "coverage-row";

        const isReefer = name === "Reefer Breakdown";

        row.innerHTML = `
            <strong>${name}</strong>

            <div class="coverage-options">
                <label>
                    <input type="radio" name="${name}" value="Yes"
                        onchange="toggleCoverage(this, '${name}')">
                    Yes
                </label>

                <label>
                    <input type="radio" name="${name}" value="No" checked
                        onchange="toggleCoverage(this, '${name}')">
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
    });
}

function toggleCoverage(radio, name) {

    const fields = document.getElementById(`${name}-fields`);

    if (radio.value === "Yes") {
        fields.style.display = "flex";
    } else {
        fields.style.display = "none";
        fields.querySelectorAll("input").forEach(i => i.value = "");
    }
}


// ==========================================
// FORM VALIDATION
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