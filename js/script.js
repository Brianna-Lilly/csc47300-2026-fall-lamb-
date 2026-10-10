//placeholder data - turn all js into typescript later
const buildingData = {
    NAC: {
      title: "North Academic Center",
      description: "Information about the NAC"
    },
    Shepard: {
      title: "Shepard Hall",
      description: "Information about Shepard Hall"
    },
    Marshak: {
      title: "Marshak Science Building",
      description: "Information about Marshak"
    }
  };

//rename eventually?
function showFeature(buildingID) {
  const view = document.getElementById("feature-view");
  const title = document.getElementById("feature-title");
  const description = document.getElementById("feature-description");

  title.textContent = buildingData[buildingID].title;
  description.textContent = buildingData[buildingID].description;

  view.style.display = "flex";
}

function closeFeature() {
  document.getElementById("feature-view").style.display = "none";
}