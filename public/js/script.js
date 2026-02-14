// ==========================================
// TRUCK INSURANCE QUESTIONNAIRE
// ==========================================

let selectedFiles = [];
const MAX_TOTAL_SIZE = 25 * 1024 * 1024; // 25MB

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("addDriverBtn")?.addEventListener("click", addDriver);
    document.getElementById("addTruckBtn")?.addEventListener("click", addTruck);
    document.getElementById("addTrailerBtn")?.addEventListener("click", addTrailer);
    document.getElementById("addCargoBtn")?.addEventListener("click", addCargo);

    document.getElementById("mainForm")?.addEventListener("submit", validateForm);

    initializeCoverages();
    initializeFileUpload();

    // Default rows
    addDriver();
    addTruck();
    addTrailer();
    addCargo();
});


// ==========================================
// FILE UPLOAD LOGIC (Drag & Drop + 25MB)
// ==========================================
function initializeFileUpload() {

    const uploadArea = document.getElementById("uploadArea");
    const fileInput = document.getElementById("fileInput");

    if (!uploadArea || !fileInput) return;

    uploadArea.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", (e) => {
        handleFiles(e.target.files);
    });

    uploadArea.addEventListener("dragover", (e) => {
        e.preventDefault();
        uploadArea.classList.add("dragover");
    });

    uploadArea.addEventListener("dragleave", () => {
        uploadArea.classList.remove("dragover");
    });

    uploadArea.addEventListener("drop", (e) => {
        e.preventDefault();
        uploadArea.classList.remove("dragover");
        handleFiles(e.dataTransfer.files);
    });
}

function handleFiles(files) {

    const newFiles = Array.from(files);

    const totalSize =
        [...selectedFiles, ...newFiles]
        .reduce((sum, file) => sum + file.size, 0);

    if (totalSize > MAX_TOTAL_SIZE) {
        alert("Total file size cannot exceed 25MB.");
        return;
    }

    selectedFiles = [...selectedFiles, ...newFiles];
    updateFileInput();
    renderFileList();
}

function updateFileInput() {
    const fileInput = document.getElementById("fileInput");
    const dataTransfer = new DataTransfer();

    selectedFiles.forEach(file => dataTransfer.items.add(file));
    fileInput.files = dataTransfer.files;
}

function renderFileList() {

    const fileList = document.getElementById("fileList");
    fileList.innerHTML = "";

    selectedFiles.forEach((file, index) => {

        const div = document.createElement("div");
        div.className = "file-item";

        div.innerHTML = `
            <span>${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)</span>
            <button type="button" onclick="removeFile(${index})">Remove</button>
        `;

        fileList.appendChild(div);
    });
}

function removeFile(index) {
    selectedFiles.splice(index, 1);
    updateFileInput();
    renderFileList();
}


// ==========================================
// SHARED REMOVE
// ==========================================
function removeItem(button) {
    button.closest(".row-item").remove();
}


// ==========================================
// DRIVERS (Only 1 Owner Allowed)
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
        "Named Insured",
        "Phone",
        "Email",
        "DOT#"
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

    // Cargo must equal 100%
    let total = 0;
    document.querySelectorAll("input[name='Commodity Percentage']")
        .forEach(i => total += Number(i.value) || 0);

    if (total !== 100) {
        e.preventDefault();
        alert("Cargo percentages must equal exactly 100%.");
        return false;
    }

    // File size validation
    const totalFileSize = selectedFiles
        .reduce((sum, file) => sum + file.size, 0);

    if (totalFileSize > MAX_TOTAL_SIZE) {
        e.preventDefault();
        alert("Total file size exceeds 25MB limit.");
        return false;
    }
}