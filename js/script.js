//placeholder data
const buildingData = {
    NAC: {
      title: "NAC",
    },
    Shepard: {
      title: "Shepard",
    },
    Marshak: {
      title: "Marshak",
    }
  };

function showFeature(buildingID) {
    // capacity/occupancy? rename function
    // replace later with real code - this is a test

    const data = buildingData[buildingID];

    alert(`feature coming soon: ${data.title}`);
    console.log("feature activated");
}