//placeholder data - turn all js into typescript later
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
      8: {
        frontElevators: ["Front Elevator 1", "Front Elevator 2"],
        escalators: ["Escalator Down"],
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

  title.textContent = buildingData[buildingID].title;
  
  //Choose floor. Looks like elevator buttons.
  let htmlContent = `<p>Select a floor:</p><div class="elevator-panel">`;
  buildingData[buildingID].floors.forEach(floor => {
    htmlContent += `<button class="elevator-btn" onclick="selectFloor(${floor})">${floor}</button>`;
  });
  htmlContent += `
    </div>
    <button id="open-report-button" type="button">
    Report Status
    </button>
  `;
  
  description.innerHTML = htmlContent;
  view.style.display = "flex";
}

function selectFloor(floorNum) {
  selectedFloor = floorNum;
  const description = document.getElementById("feature-description");
  let eqData = buildingData[currentBuilding].equipment[floorNum] || buildingData[currentBuilding].equipment.default;

  // Elevator button panel on the left, and the map on the right
  let htmlContent = `
    <div class="floor-split-container">
      
      <!-- LEFT SIDE: Elevator keypad buttons for floors -->
      <div class="split-left">
        <p style="margin-top:0; font-weight:bold; font-size:0.9rem;">Floors</p>
        <div class="elevator-panel" style="margin: 0; padding: 10px; grid-template-columns: repeat(2, 40px);">
  `;

  buildingData[currentBuilding].floors.forEach(floor => {
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
      } else {
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
      } else {
        htmlContent += `<div></div>`;
      }

      htmlContent += `</div>`;
    }
  } else if (currentBuilding === 'NAC') {
    // Front Elevator 1/2 have a large gap
    if (eqData.frontElevators && eqData.frontElevators.length > 0) {
      htmlContent += `<div class="equipment-row-pair nac-gap-large">`;
      eqData.frontElevators.forEach(el => {
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
      eqData.escalators.forEach(esc => {
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
        pair1.forEach(el => {
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
        pair2.forEach(el => {
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
      eqData.backElevators.forEach(el => {
        htmlContent += `
          <div class="map-node elevator-node" onclick="selectSpecificEquipment('${el}')">
            <span>${el}</span>
            <span class="status-badge normal">🐑 Not Busy</span>
          </div>`;
      });
      htmlContent += `</div>`;
    }
  } else {
    // Shepard is normal
    if (eqData.frontElevators && eqData.frontElevators.length > 0) {
      htmlContent += `<div class="equipment-row-pair">`;
      eqData.frontElevators.forEach(el => {
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
          type="button"
    Report Status
  </button>
`);
}

function selectEquipmentType(type) {
  selectedType = type;
  const description = document.getElementById("feature-description");
  let eqData = buildingData[currentBuilding].equipment[selectedFloor] || buildingData[currentBuilding].equipment.default;
  let items = type === 'elevator' ? eqData.elevators : eqData.escalators;

  let htmlContent = `<p>Select specific ${type}:</p>`;
  items.forEach(item => {
    htmlContent += `<button onclick="selectSpecificEquipment('${item}')">${item}</button>`;
  });

  description.innerHTML = htmlContent;
}

// Skip asking for directions if it is unnecessary
function selectSpecificEquipment(itemName) {
  selectedEquipmentName = itemName;
  
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
  } else if (itemName.toLowerCase().includes("down")) {
    selectDirection("down");
    return;
  }

  const description = document.getElementById("feature-description");

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

    // Get the current status for this equipment across all floors.
    const key = getEquipmentKey(
        currentBuilding,
        selectedFloor,
        selectedEquipmentName
    );

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

    const crowdingText =
        crowdingLabels[status.crowding] || crowdingLabels.unknown;

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


/* =========================================
   OCCUPANCY & EQUIPMENT STATUS REPORTING
   ========================================= */

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

function getEquipmentKey(buildingID, floor, equipment) {
    return `${buildingID}|${floor}|${equipment}`;
}

function getAllEquipmentForBuilding(buildingID) {
    const building = buildingData[buildingID];
    const names = new Set();

    Object.values(building.equipment).forEach(floorData => {
        Object.values(floorData).forEach(value => {
            if (Array.isArray(value)) {
                value.forEach(name => names.add(name));
            }
        });
    });

    return [...names];
}

function openBuildingReportForm() {
    if (!currentBuilding) {
        alert("Please select a building first.");
        return;
    }

    reportTarget = {
        buildingID: currentBuilding,
        floor: selectedFloor,
        equipment: ""
    };

    const modal = document.getElementById("report-modal");
    const buildingInput = document.getElementById("report-building");
    const equipmentSelect = document.getElementById("report-equipment");

    buildingInput.value = buildingData[currentBuilding].title;
    equipmentSelect.replaceChildren();

    getAllEquipmentForBuilding(currentBuilding).forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        equipmentSelect.appendChild(option);
    });

    document.getElementById("report-form").reset();

    buildingInput.value = buildingData[currentBuilding].title;
    document.getElementById("report-message").textContent = "";

    modal.style.display = "flex";
}

function closeReportForm() {
    document.getElementById("report-modal").style.display = "none";
    reportTarget = null;
}

/* Use current reports to calculate the public status.
   A confirmed status expires 24 hours after confirmation.
   Crowding reports expire after 30 minutes. */
function calculateEquipmentStatus(key) {
    const now = Date.now();
    const statuses = getEquipmentStatus();
    const reports = getReports().filter(report => report.key === key);

    let working = statuses[key];

    if (!working || now - working.confirmedAt >= 24 * 60 * 60 * 1000) {
        working = {
            working: "yes",
            confirmedAt: 0
        };
        statuses[key] = working;
        saveEquipmentStatus(statuses);
    }

    const recentCrowding = reports.filter(report =>
        report.crowding !== "unknown" &&
        now - report.timestamp < 30 * 60 * 1000
    );

    let crowding = "unknown";

    if (recentCrowding.length > 0) {
        const counts = {};

        recentCrowding.forEach(report => {
            counts[report.crowding] = (counts[report.crowding] || 0) + 1;
        });

        const highestCount = Math.max(...Object.values(counts));
        const tiedLevels = Object.keys(counts).filter(
            level => counts[level] === highestCount
        );

        const latest = recentCrowding
            .filter(report => tiedLevels.includes(report.crowding))
            .sort((a, b) => b.timestamp - a.timestamp)[0];

        crowding = latest.crowding;
    }

    return {
        working: working.working,
        crowding: crowding
    };
}

/* Update visible cards without changing their layout. */
function refreshEquipmentCards(container) {
    container.querySelectorAll(".map-node").forEach(card => {
        const nameElement = card.querySelector("span");
        if (!nameElement) return;

        const equipmentName = nameElement.textContent.trim();
        const key = getEquipmentKey(
            currentBuilding,
            selectedFloor,
            equipmentName
        );

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
        } else {
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

/* Handle form submission. */
document.getElementById("report-form").addEventListener("submit", event => {
    event.preventDefault();

    if (!reportTarget) return;

    const email = document.getElementById("report-email")
        .value.trim().toLowerCase();

    const equipment = document.getElementById("report-equipment").value;
    const crowding = document.getElementById("report-crowding").value;
    const working = document.getElementById("report-working").value;
    const details = document.getElementById("report-details").value.trim();

    if (!email || !email.includes("@")) {
        document.getElementById("report-message").textContent =
            "Please enter a valid email address.";
        return;
    }

    const key = getEquipmentKey(
        reportTarget.buildingID,
        reportTarget.floor,
        equipment
    );

    const now = Date.now();
    let reports = getReports();

    // Keep only reports from the last 24 hours.
    reports = reports.filter(report =>
        now - report.timestamp < 24 * 60 * 60 * 1000
    );

    // Do not allow the same email to submit another report
    // for the same equipment within five minutes.
    const duplicate = reports.some(report =>
        report.key === key &&
        report.email === email &&
        now - report.timestamp < 5 * 60 * 1000
    );

    if (duplicate) {
        document.getElementById("report-message").textContent =
            "You already submitted a report for this equipment recently.";
        return;
    }

    reports.push({
        key,
        email,
        crowding,
        working,
        details,
        timestamp: now
    });

    saveReports(reports);

    
    const matchingReports = reports.filter(report =>
        report.key === key &&
        report.working === working &&
        now - report.timestamp < 24 * 60 * 60 * 1000
    );

    const distinctEmails = new Set(
        matchingReports.map(report => report.email)
    );

    if (distinctEmails.size >= 2) {
        const statuses = getEquipmentStatus();

        statuses[key] = {
            working: working,
            confirmedAt: now
        };

        saveEquipmentStatus(statuses);

        document.getElementById("report-message").textContent =
            working === "no"
                ? "Two reports received. Equipment marked Out of Service."
                : "Two reports received. Equipment marked Working.";
    } else {
        document.getElementById("report-message").textContent =
            "Thank you so much for your Report!";
    }

    if (currentBuilding && selectedFloor !== null) {
        selectFloor(selectedFloor);
    }

    // Keep the success message visible briefly before closing.
    const message = document.getElementById("report-message");
    const result = message.textContent;

    message.textContent = result;
    document.getElementById("report-form").querySelector(
        ".report-submit"
    ).disabled = true;

    setTimeout(() => {
        closeReportForm();
        document.getElementById("report-form").querySelector(
            ".report-submit"
        ).disabled = false;
    }, 1800);
});

// Connect the Report Status button to the popup.
document.addEventListener("click", function (event) {
    const button = event.target.closest("#open-report-button");

    if (!button) return;

    event.preventDefault();
    openBuildingReportForm();
});
