// Grant CesiumJS access to your ion assets
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4Zjk5N2RlYS0zMGY2LTQxNWQtYjAwMy1iYWUyODI4ODY5YTUiLCJpZCI6MTE3OTUzLCJpYXQiOjE2NzA3Mzk4MTl9.k3I9be0G6cm7S9-U3lYsvSaUZ6mKVf0Capzojy3RZAU";

const viewer = new Cesium.Viewer("cesiumContainer", {
  //timeline: false,
  animation: false,
  terrainProvider: Cesium.createWorldTerrain()
});

viewer._cesiumWidget._creditContainer.style.display = "none";

const osmBuildingsTileset = Cesium.createOsmBuildings();
viewer.scene.primitives.add(osmBuildingsTileset);

osmBuildingsTileset.readyPromise.then(() => {
  // Wait for the tileset to be ready

  if (!osmBuildingsTileset.ready) {
    console.log('Tileset not ready yet.');
    return;
  }

  var entities = osmBuildingsTileset.entities;

  if (!entities) {
    console.log('No entities found.');
    return;
  }

  console.log(entities);
  
  var idsToRemove = [28898677, 157332769, 874500718, 330132975];

  for (var i = 0; i < idsToRemove.length; i++) {
    var entityToRemove = entities.getById(idsToRemove[i]);
    entities.remove(entityToRemove);
  }

  // osmBuildingsTileset.style = new Cesium.Cesium3DTileStyle({
  //   color: {
  //     conditions: [
  //       // Show all buildings except the ones with these IDs
  //       ["${id} !== '28898677' && ${id} !== '157332769' && ${id} !== '874500718' && ${id} !== '330132975'", "color('brown')"],
  //       // Hide the buildings with these IDs
  //       ["true", "color('black', 0)"]
  //     ]
  //   }
  // });

}).otherwise(function(error) {
  console.log(error);
});


(async () => {
  "use strict";
  try {
    const resource = await Cesium.IonResource.fromAssetId(1682454);

    const position = Cesium.Cartesian3.fromDegrees(174.766237, -36.846110, 55);
    const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, new Cesium.HeadingPitchRoll(-120.45, -0.03, 0.05));

    const entity = viewer.entities.add({
      position: position,
      orientation: orientation,
      model: {
        uri: resource
,
        scale: 13.0
      },
    });

    //viewer.trackedEntity = entity;
    viewer.zoomTo(entity);
  } catch (error) {
    console.log(error);
  }
})();

const DayButton = document.getElementById('DaylightBut');
const NightButton = document.getElementById('NightBut');

DayButton.addEventListener('click', function() {
  // This code will run when the button is clicked
  dayTimeLighting();
});

NightButton.addEventListener('click', function() {
  // This code will run when the button is clicked
  nightTimeLighting();
});

function dayTimeLighting() {
  // Set scene defaults
  scene.light = sunLight;
  scene.globe.dynamicAtmosphereLighting = true;
  scene.globe.dynamicAtmosphereLightingFromSun = false;
  setTime("2020-01-09T23:00:39.018261982600961346Z");
}

function nightTimeLighting() {
  reset();
  scene.light = moonLight;
  scene.globe.dynamicAtmosphereLightingFromSun = true;
  setTime("2020-01-10T03:00:41.17946898164518643Z");
}

const scene = viewer.scene;
scene.globe.enableLighting = true;
const scratchIcrfToFixed = new Cesium.Matrix3();
const scratchMoonPosition = new Cesium.Cartesian3();
const scratchMoonDirection = new Cesium.Cartesian3();
const sunLight = new Cesium.SunLight();
const moonLight = new Cesium.DirectionalLight({
  direction: getMoonDirection(), // Updated every frame
  color: new Cesium.Color(0.9, 0.925, 1.0),
  intensity: 0.5,
});

scene.light = moonLight;
scene.globe.dynamicAtmosphereLightingFromSun = true;
setTime("2020-01-10T03:00:41.17946898164518643Z");

function getMoonDirection(result) {
  result = Cesium.defined(result) ? result : new Cesium.Cartesian3();
  const icrfToFixed = scratchIcrfToFixed;
  const date = viewer.clock.currentTime;
  if (
    !Cesium.defined(
      Cesium.Transforms.computeIcrfToFixedMatrix(date, icrfToFixed)
    )
  ) {
    Cesium.Transforms.computeTemeToPseudoFixedMatrix(date, icrfToFixed);
  }
  const moonPosition = Cesium.Simon1994PlanetaryPositions.computeMoonPositionInEarthInertialFrame(
    date,
    scratchMoonPosition
  );
  Cesium.Matrix3.multiplyByVector(
    icrfToFixed,
    moonPosition,
    moonPosition
  );
  const moonDirection = Cesium.Cartesian3.normalize(
    moonPosition,
    scratchMoonDirection
  );
  return Cesium.Cartesian3.negate(moonDirection, result);
}

function setTime(iso8601) {
  const currentTime = Cesium.JulianDate.fromIso8601(iso8601);
  const endTime = Cesium.JulianDate.addDays(
    currentTime,
    2,
    new Cesium.JulianDate()
  );
  viewer.clock.currentTime = currentTime;
viewer.timeline.zoomTo(currentTime, endTime);
}

function reset() {
  // Set scene defaults
  scene.light = sunLight;
  scene.globe.dynamicAtmosphereLighting = true;
  scene.globe.dynamicAtmosphereLightingFromSun = false;
  setTime("2020-01-09T23:00:39.018261982600961346Z");
}

scene.preRender.addEventListener(function (scene, time) {
  if (scene.light === moonLight) {
    scene.light.direction = getMoonDirection(scene.light.direction);
  }
});




