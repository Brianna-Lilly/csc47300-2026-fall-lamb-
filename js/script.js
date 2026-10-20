"use strict";
//placeholder data - turn all js into typescript later -> converted into typescript
// Sample data structure for floors, equipment, status, and lamb crowdedness icons
const buildingData = {
    NAC: {
        title: "North Academic Center",
        description: "Information about the NAC",
        floors: [1, 2, 3, 4, 5, 6, 7, 8],
        equipment: {
            // Floor 1 cannot have a down escalator (bottom floor)
            1: {
                frontElevators: ["Front Elevator 1", "Front Elevator 2"],
                escalators: ["Escalator Up"],
                middleElevators: ["Middle Elevator 1", "Middle Elevator 2", "Middle Elevator 3", "Middle Elevator 4"],
                backElevators: ["Back Elevator 1", "Back Elevator 2"]
            },
            // Floors 2-7 have everything 
            default: {
                frontElevators: ["Front Elevator 1", "Front Elevator 2"],
                escalators: ["Escalator Up", "Escalator Down"],
                middleElevators: ["Middle Elevator 1", "Middle Elevator 2", "Middle Elevator 3", "Middle Elevator 4"],
                backElevators: ["Back Elevator 1", "Back Elevator 2"]
            },
            // Floor 8 cannot have an up escalator (top floor)
            //No escalator on 8th floor
            8: {
                frontElevators: ["Front Elevator 1", "Front Elevator 2"],
                escalators: [],
                middleElevators: ["Middle Elevator 1", "Middle Elevator 2", "Middle Elevator 3", "Middle Elevator 4"],
                backElevators: ["Back Elevator 1", "Back Elevator 2"]
            }
        }
    },
    Shepard: {
        title: "Shepard Hall",
        description: "Information about Shepard Hall",
        floors: [1, 2, 3, 4, 5, 6, 7],
        equipment: {
            default: {
                frontElevators: ["Elevator 1", "Elevator 2"],
                escalators: [],
                middleElevators: [],
                backElevators: []
            }
        }
    },
    Marshak: {
        title: "Marshak Science Building",
        description: "Information about Marshak",
        floors: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        equipment: {
            default: {
                frontElevators: ["Left Side 1", "Left Side 2", "Left Side 3"],
                escalators: [],
                middleElevators: ["Right Side 1", "Right Side 2", "Right Side 3"],
                backElevators: []
            }
        }
    }
};
let currentBuilding = null;
let selectedFloor = null;
let selectedType = null;
let selectedEquipmentName = null;
let selectedDirection = null;
//rename eventually?
function showFeature(buildingID) {
    currentBuilding = buildingID;
    const view = document.getElementById("feature-view");
    const title = document.getElementById("feature-title");
    const description = document.getElementById("feature-description");
    if (title) {
        title.textContent = buildingData[buildingID].title;
    }
    //Choose floor. Looks like elevator buttons.
    let htmlContent = `<p>Select a floor:</p><div class="elevator-panel">`;
    buildingData[buildingID].floors.forEach((floor) => {
        htmlContent += `<button class="elevator-btn" onclick="selectFloor(${floor})">${floor}</button>`;
    });
    htmlContent += `
    </div>
    <button id="open-report-button" type="button">
    Report Status
    </button>
  `;
    if (description) {
        description.innerHTML = htmlContent;
    }
    if (view) {
        view.style.display = "flex";
    }
}
function selectFloor(floorNum) {
    selectedFloor = floorNum;
    const description = document.getElementById("feature-description");
    if (!description || !currentBuilding)
        return;
    let eqData = buildingData[currentBuilding].equipment[floorNum] || buildingData[currentBuilding].equipment.default;
    // Elevator button panel on the left, and the map on the right
    let htmlContent = `
    <div class="floor-split-container">
      
      <!-- LEFT SIDE: Elevator keypad buttons for floors -->
      <div class="split-left">
        <p style="margin-top:0; font-weight:bold; font-size:0.9rem;">Floors</p>
        <div class="elevator-panel" style="margin: 0; padding: 10px; grid-template-columns: repeat(2, 40px);">
  `;
    buildingData[currentBuilding].floors.forEach((floor) => {
        let activeClass = (floor === floorNum) ? "elevator-btn active-floor-btn" : "elevator-btn";
        htmlContent += `<button class="${activeClass}" style="width:40px; height:40px; font-size:14px;" onclick="selectFloor(${floor})">${floor}</button>`;
    });
    htmlContent += `
        </div>
      </div>

      <!-- RIGHT SIDE: Custom Equipment Layout Matching Building Specs -->
      <div class="split-right">
        <div class="floorplan-view-box" style="margin-top:0;">
          
          <div class="custom-layout-grid">
  `;
    // Marshak's gap is vertical not horizontal like NAC and Shepard
    if (currentBuilding === 'Marshak') {
        let leftItems = eqData.frontElevators || [];
        let rightItems = eqData.middleElevators || [];
        let maxLength = Math.max(leftItems.length, rightItems.length);
        for (let i = 0; i < maxLength; i++) {
            htmlContent += `<div class="equipment-row-marshak">`;
            if (leftItems[i]) {
                let el = leftItems[i];
                htmlContent += `
          <div class="map-node elevator-node" onclick="selectSpecificEquipment('${el}')">
            <span>${el}</span>
            <span class="status-badge busy">🐑🐑🐑 Busy</span>
          </div>`;
            }
            else {
                htmlContent += `<div></div>`;
            }
            htmlContent += `<div></div>`;
            if (rightItems[i]) {
                let el = rightItems[i];
                htmlContent += `
          <div class="map-node elevator-node" onclick="selectSpecificEquipment('${el}')">
            <span>${el}</span>
            <span class="status-badge busy">🐑🐑 Busy</span>
          </div>`;
            }
            else {
                htmlContent += `<div></div>`;
            }
            htmlContent += `</div>`;
        }
    }
    else if (currentBuilding === 'NAC') {
        // Front Elevator 1/2 have a large gap
        if (eqData.frontElevators && eqData.frontElevators.length > 0) {
            htmlContent += `<div class="equipment-row-pair nac-gap-large">`;
            eqData.frontElevators.forEach((el) => {
                htmlContent += `
          <div class="map-node elevator-node" onclick="selectSpecificEquipment('${el}')">
            <span>${el}</span>
            <span class="status-badge busy">🐑🐑🐑 Busy</span>
          </div>`;
            });
            htmlContent += `</div>`;
        }
        // Escalators have a small gap
        if (eqData.escalators && eqData.escalators.length > 0) {
            htmlContent += `<div class="equipment-row-escalator nac-gap-small">`;
            eqData.escalators.forEach((esc) => {
                htmlContent += `
          <div class="map-node elevator-node" onclick="selectSpecificEquipment('${esc}')">
            <span>${esc}</span>
            <span class="status-badge normal">🐑 Not Busy</span>
          </div>`;
            });
            htmlContent += `</div>`;
        }
        // Middle Elevators have no gap, and are together
        if (eqData.middleElevators && eqData.middleElevators.length > 0) {
            let pair1 = eqData.middleElevators.slice(0, 2);
            if (pair1.length > 0) {
                htmlContent += `<div class="equipment-row-pair nac-gap-50">`;
                pair1.forEach((el) => {
                    htmlContent += `
            <div class="map-node elevator-node" onclick="selectSpecificEquipment('${el}')">
              <span>${el}</span>
              <span class="status-badge busy">🐑🐑 Busy</span>
            </div>`;
                });
                htmlContent += `</div>`;
            }
            let pair2 = eqData.middleElevators.slice(2, 4);
            if (pair2.length > 0) {
                htmlContent += `<div class="equipment-row-pair nac-gap-large">`;
                pair2.forEach((el) => {
                    htmlContent += `
            <div class="map-node elevator-node" onclick="selectSpecificEquipment('${el}')">
              <span>${el}</span>
              <span class="status-badge busy">🐑🐑 Busy</span>
            </div>`;
                });
                htmlContent += `</div>`;
            }
        }
        // 4. Back Elevators 1/2 have a large gap
        if (eqData.backElevators && eqData.backElevators.length > 0) {
            htmlContent += `<div class="equipment-row-pair">`;
            eqData.backElevators.forEach((el) => {
                htmlContent += `
          <div class="map-node elevator-node" onclick="selectSpecificEquipment('${el}')">
            <span>${el}</span>
            <span class="status-badge normal">🐑 Not Busy</span>
          </div>`;
            });
            htmlContent += `</div>`;
        }
    }
    else {
        // Shepard is normal
        if (eqData.frontElevators && eqData.frontElevators.length > 0) {
            htmlContent += `<div class="equipment-row-pair">`;
            eqData.frontElevators.forEach((el) => {
                htmlContent += `
          <div class="map-node elevator-node" onclick="selectSpecificEquipment('${el}')">
            <span>${el}</span>
            <span class="status-badge busy">🐑🐑🐑 Busy</span>
          </div>`;
            });
            htmlContent += `</div>`;
        }
    }
    htmlContent += `
          </div>
        </div>
        <button style="margin-top: 10px; width: 100%; padding: 6px; cursor:pointer;" onclick="showFeature('${currentBuilding}')">Back to Floor Selection</button>
      </div>

    </div>
  `;
    description.innerHTML = htmlContent;
    refreshEquipmentCards(description);
    description.insertAdjacentHTML("beforeend", `
  <button id="open-report-button"
        type="button">
    Report Status
  </button>
`);
}
function selectEquipmentType(type) {
    selectedType = type;
    const description = document.getElementById("feature-description");
    if (!description || !currentBuilding || selectedFloor === null)
        return;
    let eqData = buildingData[currentBuilding].equipment[selectedFloor] || buildingData[currentBuilding].equipment.default;
    // @ts-ignore
    let items = type === 'elevator' ? eqData.elevators : eqData.escalators;
    let htmlContent = `<p>Select specific ${type}:</p>`;
    if (items) {
        items.forEach((item) => {
            htmlContent += `<button onclick="selectSpecificEquipment('${item}')">${item}</button>`;
        });
    }
    description.innerHTML = htmlContent;
}
// Skip asking for directions if it is unnecessary
function selectSpecificEquipment(itemName) {
    selectedEquipmentName = itemName;
    if (!currentBuilding || selectedFloor === null)
        return;
    // Pull the floor array for the current building
    let floors = buildingData[currentBuilding].floors;
    let bottomFloor = floors[0];
    let topFloor = floors[floors.length - 1];
    // Bottom floor = can only go up
    if (selectedFloor === bottomFloor) {
        selectDirection("up");
        return;
    }
    // Top floor = can only go down
    if (selectedFloor === topFloor) {
        selectDirection("down");
        return;
    }
    // Directional escalators only go up or down
    if (itemName.toLowerCase().includes("up")) {
        selectDirection("up");
        return;
    }
    else if (itemName.toLowerCase().includes("down")) {
        selectDirection("down");
        return;
    }
    const description = document.getElementById("feature-description");
    if (!description)
        return;
    description.innerHTML = `
    <p>Selected: <strong>${itemName}</strong></p>
    <p>Choose direction:</p>
    <button onclick="selectDirection('up')">Going Up</button>
    <button onclick="selectDirection('down')">Going Down</button>
  `;
}
function selectDirection(direction) {
    selectedDirection = direction;
    const description = document.getElementById("feature-description");
    if (!description || !currentBuilding || selectedFloor === null || !selectedEquipmentName)
        return;
    // Get the current status for this equipment across all floors.
    const key = getEquipmentKey(currentBuilding, selectedFloor, selectedEquipmentName);
    const status = calculateEquipmentStatus(key);
    const crowdingLabels = {
        unknown: "Crowding Unknown",
        low: "🐑 Low Traffic",
        moderate: "🐑🐑🐑 Moderate",
        heavy: "🐑🐑🐑🐑🐑 Heavy"
    };
    const workingText = status.working === "no"
        ? "Out of Service"
        : "In Service";
    const workingColor = status.working === "no"
        ? "#991b1b"
        : "green";
    const crowdingText = crowdingLabels[status.crowding] || crowdingLabels.unknown;
    // Show sheep images only when a crowding level is reported.
    const sheepCounts = {
        low: 1,
        moderate: 3,
        heavy: 5
    };
    const sheepCount = sheepCounts[status.crowding] || 0;
    let sheepImages = "";
    for (let i = 0; i < sheepCount; i++) {
        sheepImages +=
            '<img src="images/sheep1.png" alt="Lamb" width="30">';
    }
    description.innerHTML = `
        <h3>Equipment Status</h3>
        <p><strong>Building:</strong>
            ${buildingData[currentBuilding].title}
        </p>
        <p><strong>Floor:</strong> ${selectedFloor}</p>
        <p><strong>Unit:</strong>
            ${selectedEquipmentName} (${selectedDirection.toUpperCase()})
        </p>
        <p><strong>Status:</strong>
            <span style="color: ${workingColor};">${workingText}</span>
        </p>
        <p><strong>Crowding:</strong> ${crowdingText}</p>
        <div>${sheepImages}</div>
        <br>
        <button onclick="showFeature('${currentBuilding}')">
            Check Another
        </button>
    `;
}
function closeFeature() {
    const view = document.getElementById("feature-view");
    if (view) {
        view.style.display = "none"; //Main map visible again
    }
    //Reset tracking variables so it starts fresh next time
    currentBuilding = null;
    selectedFloor = null;
    selectedType = null;
    selectedEquipmentName = null;
    selectedDirection = null;
}
//Occupancy and Equipment Status
const REPORTS_KEY = "campusEquipmentReports";
const STATUS_KEY = "campusEquipmentStatus";
let reportTarget = null;
function getReports() {
    return JSON.parse(localStorage.getItem(REPORTS_KEY) || "[]");
}
function saveReports(reports) {
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
}
function getEquipmentStatus() {
    return JSON.parse(localStorage.getItem(STATUS_KEY) || "{}");
}
function saveEquipmentStatus(statuses) {
    localStorage.setItem(STATUS_KEY, JSON.stringify(statuses));
}
function isEscalator(name) {
    return name.toLowerCase().includes("escalator");
}
function getEquipmentKey(buildingID, floor, equipment) {
    if (isEscalator(equipment)) {
        return `${buildingID}|${floor}|${equipment}`;
    }
    return `${buildingID}|${equipment}`;
}
function populateReportEquipment(buildingID, floor) {
    const equipmentSelect = document.getElementById("report-equipment");
    if (!equipmentSelect)
        return;
    const building = buildingData[buildingID];
    const eqData = building.equipment[floor] || building.equipment.default;
    const names = [
        ...(eqData.frontElevators || []),
        ...(eqData.escalators || []),
        ...(eqData.middleElevators || []),
        ...(eqData.backElevators || [])
    ];
    equipmentSelect.replaceChildren();
    names.forEach((name) => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        equipmentSelect.appendChild(option);
    });
}
function openBuildingReportForm() {
    if (!currentBuilding) {
        alert("Please select a building first.");
        return;
    }
    const building = buildingData[currentBuilding];
    const modal = document.getElementById("report-modal");
    const buildingInput = document.getElementById("report-building");
    const floorSelect = document.getElementById("report-floor");
    const reportForm = document.getElementById("report-form");
    const reportMessage = document.getElementById("report-message");
    if (reportForm)
        reportForm.reset();
    if (buildingInput)
        buildingInput.value = building.title;
    floorSelect.replaceChildren();
    building.floors.forEach((f) => {
        const option = document.createElement("option");
        option.value = String(f);
        option.textContent = String(f);
        floorSelect.appendChild(option);
    });
    floorSelect.value = String(selectedFloor !== null && selectedFloor !== void 0 ? selectedFloor : building.floors[0]);
    const floor = Number(floorSelect.value);
    populateReportEquipment(currentBuilding, floor);
    reportTarget = { buildingID: currentBuilding, floor: floor, equipment: "" };
    if (reportMessage)
        reportMessage.textContent = "";
    if (modal)
        modal.style.display = "flex";
}
function closeReportForm() {
    const modal = document.getElementById("report-modal");
    if (modal) {
        modal.style.display = "none";
    }
    reportTarget = null;
}
//Use current reports to calculate the public status.
//A confirmed status expires 24 hours after confirmation.
//Crowding reports expire after 30 minutes. 
function calculateEquipmentStatus(key) {
    const now = Date.now();
    const statuses = getEquipmentStatus();
    const reports = getReports().filter((report) => report.key === key);
    let working = statuses[key];
    if (!working || now - working.confirmedAt >= 24 * 60 * 60 * 1000) {
        working = {
            working: "yes",
            confirmedAt: 0
        };
        statuses[key] = working;
        saveEquipmentStatus(statuses);
    }
    const recentCrowding = reports.filter((report) => report.crowding !== "unknown" &&
        now - report.timestamp < 30 * 60 * 1000);
    let crowding = "unknown";
    if (recentCrowding.length > 0) {
        const counts = {};
        recentCrowding.forEach((report) => {
            counts[report.crowding] = (counts[report.crowding] || 0) + 1;
        });
        const highestCount = Math.max(...Object.values(counts));
        const tiedLevels = Object.keys(counts).filter((level) => counts[level] === highestCount);
        const latest = recentCrowding
            .filter((report) => tiedLevels.includes(report.crowding))
            .sort((a, b) => b.timestamp - a.timestamp)[0];
        crowding = latest.crowding;
    }
    return {
        working: working.working,
        crowding: crowding
    };
}
//Update visible cards without changing their layout. 
function refreshEquipmentCards(container) {
    container.querySelectorAll(".map-node").forEach((card) => {
        const nameElement = card.querySelector("span");
        if (!nameElement || !nameElement.textContent || currentBuilding === null || selectedFloor === null)
            return;
        const equipmentName = nameElement.textContent.trim();
        const key = getEquipmentKey(currentBuilding, selectedFloor, equipmentName);
        const status = calculateEquipmentStatus(key);
        let badge = card.querySelector(".status-badge");
        if (!badge) {
            badge = document.createElement("span");
            badge.className = "status-badge";
            card.appendChild(badge);
        }
        if (status.working === "no") {
            badge.className = "status-badge";
            badge.style.background = "#fecaca";
            badge.style.color = "#991b1b";
            badge.textContent = "Out of Service";
        }
        else {
            const labels = {
                unknown: "Crowding Unknown",
                low: "🐑 Low Traffic",
                moderate: "🐑🐑🐑 Moderate",
                heavy: "🐑🐑🐑🐑🐑 Heavy"
            };
            badge.className = "status-badge " +
                (status.crowding === "heavy" ? "busy" : "normal");
            badge.style.background = "";
            badge.style.color = "";
            badge.textContent = labels[status.crowding] || labels.unknown;
        }
    });
}
const floorSelectElement = document.getElementById("report-floor");
if (floorSelectElement) {
    floorSelectElement.addEventListener("change", () => {
        if (!reportTarget)
            return;
        reportTarget.floor = Number(floorSelectElement.value);
        populateReportEquipment(reportTarget.buildingID, reportTarget.floor);
    });
}
//Handle form submission.
const reportFormElement = document.getElementById("report-form");
if (reportFormElement) {
    reportFormElement.addEventListener("submit", (event) => {
        var _a;
        var _b;
        event.preventDefault();
        if (!reportTarget)
            return;
        const emailInput = document.getElementById("report-email");
        const equipmentSelect = document.getElementById("report-equipment");
        const crowdingSelect = document.getElementById("report-crowding");
        const workingSelect = document.getElementById("report-working");
        const detailsInput = document.getElementById("report-details");
        const reportMessage = document.getElementById("report-message");
        if (!emailInput || !equipmentSelect || !crowdingSelect || !workingSelect || !detailsInput || !reportMessage)
            return;
        const email = emailInput.value.trim().toLowerCase();
        const equipment = equipmentSelect.value;
        const crowding = crowdingSelect.value;
        const working = workingSelect.value;
        const details = detailsInput.value.trim();
        if (!email || !email.includes("@")) {
            reportMessage.textContent = "Please enter a valid email address.";
            return;
        }
        if (!equipment) {
            reportMessage.textContent = "Please choose an elevator or escalator.";
            return;
        }
        const key = getEquipmentKey(reportTarget.buildingID, reportTarget.floor, equipment);
        const now = Date.now();
        // Keep only reports from the last 24 hours, then add this one.
        let reports = getReports().filter((report) => now - report.timestamp < 24 * 60 * 60 * 1000);
        reports.push({ key, email, crowding, working, details, timestamp: now });
        saveReports(reports);
        // Current public status, and when it was last confirmed.
        const current = calculateEquipmentStatus(key);
        const confirmedAt = (_b = (_a = getEquipmentStatus()[key]) === null || _a === void 0 ? void 0 : _a.confirmedAt) !== null && _b !== void 0 ? _b : 0;
        // Only reports made AFTER the last confirmation count as votes.
        const distinctEmails = new Set(reports
            .filter((report) => report.key === key &&
            report.working === working &&
            report.timestamp > confirmedAt)
            .map((report) => report.email));
        // Only change the status if the report disagrees with the current one.
        if (working !== current.working && distinctEmails.size >= 2) {
            const statuses = getEquipmentStatus();
            statuses[key] = { working: working, confirmedAt: now };
            saveEquipmentStatus(statuses);
            reportMessage.textContent =
                working === "no"
                    ? "Two reports received. Equipment marked Out of Service."
                    : "Two reports received. Equipment marked Working.";
        }
        else {
            reportMessage.textContent = "Thank you so much for your Report!";
        }
        if (currentBuilding && selectedFloor !== null) {
            selectFloor(selectedFloor);
        }
        const submitBtn = reportFormElement.querySelector(".report-submit");
        if (submitBtn) {
            submitBtn.disabled = true;
        }
        setTimeout(() => {
            closeReportForm();
            if (submitBtn) {
                submitBtn.disabled = false;
            }
        }, 1800);
    });
}
// Connect the Report Status button to the popup.
document.addEventListener("click", function (event) {
    const targetEl = event.target;
    if (!targetEl)
        return;
    const button = targetEl.closest("#open-report-button");
    if (!button)
        return;
    event.preventDefault();
    openBuildingReportForm();
});
//Campus directory code
function openDirectoryModal() {
    const modal = document.getElementById("directory-modal");
    const container = document.getElementById("directory-list-container");
    if (!container || !modal)
        return;
    container.replaceChildren();
    let htmlContent = "";
    const seen = new Set();
    //Gets info from buildingData
    Object.keys(buildingData).forEach((buildingID) => {
        const building = buildingData[buildingID];
        building.floors.forEach((floorNum) => {
            //Floor equipment data (goes to default if needed)
            let eqData = building.equipment[floorNum] || building.equipment.default;
            //Gets all equipment arrays for this floor
            let allEquipmentOnFloor = [
                ...(eqData.frontElevators || []),
                ...(eqData.middleElevators || []),
                ...(eqData.backElevators || []),
                ...(eqData.escalators || [])
            ];
            allEquipmentOnFloor.forEach((equipmentName) => {
                const key = getEquipmentKey(buildingID, floorNum, equipmentName);
                if (seen.has(key))
                    return;
                seen.add(key);
                const status = calculateEquipmentStatus(key);
                const workingText = status.working === "no" ? "Out of Service" : "In Service";
                const workingColor = status.working === "no" ? "#991b1b" : "#16a34a";
                const crowdingLabels = {
                    unknown: "Crowding Unknown",
                    low: "🐑 Low Traffic",
                    moderate: "🐑🐑🐑 Moderate",
                    heavy: "🐑🐑🐑🐑🐑 Heavy"
                };
                const crowdingText = crowdingLabels[status.crowding] || crowdingLabels.unknown;
                htmlContent += `
                    <div class="directory-item-card">
                        <div class="directory-item-info">
                            <span class="directory-building-title">${building.title}${isEscalator(equipmentName) ? ` (Floor ${floorNum})` : ""}</span>
                            <span class="directory-equipment-name"><strong>${equipmentName}</strong></span>
                        </div>
                        <div style="text-align: right; display: flex; flex-direction: column; gap: 4px;">
                            <span style="font-weight: bold; color: ${workingColor}; font-size: 0.85rem;">${workingText}</span>
                            <span class="status-badge ${status.crowding === 'heavy' ? 'busy' : 'normal'}" style="font-size: 0.75rem;">${crowdingText}</span>
                        </div>
                    </div>
                `;
            });
        });
    });
    container.innerHTML = htmlContent;
    modal.style.display = "flex";
}
function closeDirectoryModal() {
    const modal = document.getElementById("directory-modal");
    if (modal) {
        modal.style.display = "none";
    }
}
// Expose functions globally for inline HTML event handlers
window.showFeature = showFeature;
window.selectFloor = selectFloor;
window.selectEquipmentType = selectEquipmentType;
window.selectSpecificEquipment = selectSpecificEquipment;
window.selectDirection = selectDirection;
window.closeFeature = closeFeature;
window.closeReportForm = closeReportForm;
window.closeDirectoryModal = closeDirectoryModal;
window.openDirectoryModal = openDirectoryModal;
//# sourceMappingURL=script.js.map