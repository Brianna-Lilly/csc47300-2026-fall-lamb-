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
  htmlContent += `</div>`;
  
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

  //Status & crowdedness
  description.innerHTML = `
    <h3>Equipment Status</h3>
    <p><strong>Building:</strong> ${buildingData[currentBuilding].title}</p>
    <p><strong>Floor:</strong> ${selectedFloor}</p>
    <p><strong>Unit:</strong> ${selectedEquipmentName} (${selectedDirection.toUpperCase()})</p>
    <p><strong>Status:</strong> <span style="color: green;">In Service</span></p>
    <p><strong>Crowdedness:</strong> Heavy (5 lambs)</p>
    <div>
      <img src="images/sheep1.png" alt="Lamb" width="30">
      <img src="images/sheep1.png" alt="Lamb" width="30">
      <img src="images/sheep1.png" alt="Lamb" width="30">
      <img src="images/sheep1.png" alt="Lamb" width="30">
      <img src="images/sheep1.png" alt="Lamb" width="30">
    </div>
    <br>
    <button onclick="showFeature('${currentBuilding}')">Check Another</button>
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