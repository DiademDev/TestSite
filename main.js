// Grant CesiumJS access to your ion assets
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4Zjk5N2RlYS0zMGY2LTQxNWQtYjAwMy1iYWUyODI4ODY5YTUiLCJpZCI6MTE3OTUzLCJpYXQiOjE2NzA3Mzk4MTl9.k3I9be0G6cm7S9-U3lYsvSaUZ6mKVf0Capzojy3RZAU";

const viewer = new Cesium.Viewer("cesiumContainer", {
  timeline: false,
  animation: false,
  terrainProvider: Cesium.createWorldTerrain(),
});

  viewer._cesiumWidget._creditContainer.style.display = "none";

(async () => {
  "use strict";
  try {
    const resource = await Cesium.IonResource.fromAssetId(1681985);

    const position = Cesium.Cartesian3.fromDegrees(174.766129, -36.846297, 59.5);
    const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, new Cesium.HeadingPitchRoll(-219.63, -0.06, -0.02));

    const entity = viewer.entities.add({
      position: position,
      orientation: orientation,
      model: {
        uri: resource,
        scale: 14.0
      },
    });


    viewer.trackedEntity = entity;
    //viewer.zoomTo(entity);
  } catch (error) {
    console.log(error);
  }
})();


/* CODE SNIPPETS


-36.89072172745562, 174.85554813871818

viewer.scene.globe.enableLighting = true;
viewer.scene.globe.ambientLightColor = new Cesium.Color(0, 0, 0);

var light = new Cesium.DirectionalLight();
light.color = new Cesium.Color(1.0, 1.0, 1.0);
light.intensity = 100.0;
light.direction = new Cesium.Cartesian3(1.0, 0.0, 0.0);
viewer.scene.globe.enableLighting = true;
viewer.scene.addLight(light);

const ellipsoid = viewer.scene.globe.ellipsoid;
const cartographicPosition = ellipsoid.cartesianToCartographic(position);
const surfaceNormal = ellipsoid.geodeticSurfaceNormal(cartographicPosition);
const angle = Cesium.Math.toRadians(180);
const quaternion = Cesium.Quaternion.fromAxisAngle(surfaceNormal, angle);
entity.orientation = quaternion;

const origin = Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883);
const normal = ellipsoid.geodeticSurfaceNormal(origin);
const plane = Cesium.Plane.fromPointNormal(origin, normal);

*/

