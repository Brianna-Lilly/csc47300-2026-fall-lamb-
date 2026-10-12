//placeholder data - turn all js into typescript later
// Sample data structure for floors, equipment, status, and lamb crowdedness icons
const buildingData = {
    NAC: {
    title: "North Academic Center",
    description: "Information about the NAC",
    floors: [1, 2, 3, 4, 5, 6, 7, 8],
    equipment: {
      //Floors 1-7 have 4 elevators (2 front, 2 back) and escalators
      default: {
        elevators: ["Front Elevator 1", "Front Elevator 2", "Back Elevator 1", "Back Elevator 2"],
        escalators: ["Escalator Up", "Escalator Down"]
      },
      //7th to 8th floor restriction: no escalators
      8: {
        elevators: ["Front Elevator 1", "Front Elevator 2", "Back Elevator 1", "Back Elevator 2"],
        escalators: []
      }
    }
  },
    Shepard: {
      title: "Shepard Hall",
      description: "Information about Shepard Hall",
      floors: [1, 2, 3, 4, 5, 6, 7],
      equipment: {
        default: {
          elevators: ["Elevator 1", "Elevator 2"],
          escalators: [] //No escalators
        }
      }
    },
    Marshak: {
      title: "Marshak Science Building",
      description: "Information about Marshak",
      floors: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
      equipment: {
        default: {
          elevators: ["Left Side 1", "Left Side 2", "Left Side 3", "Right Side 1", "Right Side 2", "Right Side 3"],
          escalators: [] //No escalators
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

  //Equipment -- elevator or escalator (depends on building)
  let eqData = buildingData[currentBuilding].equipment[floorNum] || buildingData[currentBuilding].equipment.default;

  let htmlContent = `<p>Floor ${floorNum} selected. Choose equipment type:</p>`;
  if (eqData.elevators.length > 0) {
    htmlContent += `<button onclick="selectEquipmentType('elevator')">Elevators</button>`;
  }
  if (eqData.escalators.length > 0) {
    htmlContent += `<button onclick="selectEquipmentType('escalator')">Escalators</button>`;
  }

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

function selectSpecificEquipment(itemName) {
  selectedEquipmentName = itemName;
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