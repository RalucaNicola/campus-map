require([
  "esri/layers/FeatureLayer",
  "esri/layers/SceneLayer",
  "esri/Graphic",
  "esri/WebScene",
  "esri/views/SceneView",
  "esri/tasks/QueryTask",
  "esri/geometry/Mesh",
  "esri/layers/GraphicsLayer",
  "esri/layers/support/LabelClass",
  "esri/geometry/support/MeshMaterialMetallicRoughness",
], function (
  FeatureLayer,
  SceneLayer,
  Graphic,
  WebScene,
  SceneView,
  QueryTask,
  Mesh,
  GraphicsLayer,
  LabelClass,
  MeshMaterialMetallicRoughness
) {
  const webscene = new WebScene({
    ground: {
      surfaceColor: "white",
    },
  });

  const buildingsLayer = new SceneLayer({
    url: "https://tiles.arcgis.com/tiles/V6ZHFr6zdgNZuVG0/arcgis/rest/services/campus_buildings_sketch/SceneServer",
    screenSizePerspectiveEnabled: true,
    renderer: {
      type: "simple",
      symbol: {
        type: "mesh-3d",
        symbolLayers: [
          {
            type: "fill",
            material: { color: "white" },
            edges: {
              type: "sketch",
              color: [50, 50, 50, 1],
              size: 1,
              extensionLength: 5,
            },
          },
        ],
      },
    },
    popupTemplate: {
      title: "",
      content: "Building: {NAME}",
    },
    labelsVisible: false,
    labelingInfo: [
      new LabelClass({
        labelExpressionInfo: { expression: "$feature.name" },
        symbol: {
          type: "label-3d",
          symbolLayers: [
            {
              type: "text",
              material: {
                color: [50, 50, 50, 1],
              },
              halo: {
                size: 2,
                color: [255, 255, 255, 0.8],
              },
              font: {
                size: 14,
                family: `'Amatic SC', 'Avenir Next', sans-serif`,
              },
            },
          ],
          verticalOffset: {
            screenLength: 20,
            maxWorldLength: 200,
            minWorldLength: 0,
          },
          callout: {
            type: "line",
            size: 1,
            color: [50, 50, 50],
            border: {
              color: [0, 0, 0, 0],
            },
          },
        },
      }),
    ],
  });

  webscene.add(buildingsLayer);

  const treeLayer = new GraphicsLayer({
    elevationInfo: {
      mode: "relative-to-ground",
    },
  });
  webscene.add(treeLayer);

  // Loading trees as a mesh, so that we can apply sketch edges
  const queryTreeTask = new QueryTask({
    url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Campus_features/FeatureServer/0",
  });

  queryTreeTask
    .execute({
      returnZ: true,
      returnGeometry: true,
      outFields: ["Class", "Height", "Rotation"],
      where: "1=1",
    })
    .then((result) => {
      for (let i = 0; i < result.features.length; i++) {
        const location = result.features[i].geometry;
        const type = result.features[i].attributes["Class"];
        const size = result.features[i].attributes["Height"];
        const rotation = result.features[i].attributes["Rotation"];
        const url = type === "Eucalyptus" ? "../assets/trees/Apricot.glb" : "../assets/trees/Leyland_Cypress.glb";

        // Function that converts a polygon into a 3D mesh geometry
        Mesh.createFromGLTF(location, url)
          .then(function (mesh) {
            // color tree leafs
            mesh.components[1].material = new MeshMaterialMetallicRoughness({
              color: [191, 207, 157],
              roughness: 1,
              metallic: 0,
            });
            // color trunk
            mesh.components[0].material = new MeshMaterialMetallicRoughness({
              color: [204, 175, 124],
              roughness: 1,
              metallic: 0,
            });
            const scale = type === "Eucalyptus" ? 0.15 : 0.2;
            mesh.scale(size * scale, { origin: location });
            mesh.rotate(0, 0, rotation);

            treeLayer.add(
              new Graphic({
                geometry: mesh,
                symbol: {
                  type: "mesh-3d",
                  symbolLayers: [
                    {
                      type: "fill",
                      edges: {
                        type: "sketch",
                        color: [50, 50, 50, 0.6],
                        size: 1,
                        extensionLength: 5,
                      },
                    },
                  ],
                },
              })
            );
          })
          .catch(console.error);
      }
    });

  const areasLayer = new SceneLayer({
    url: "https://tiles.arcgis.com/tiles/V6ZHFr6zdgNZuVG0/arcgis/rest/services/campus_basemap_patterns/SceneServer",
    elevationInfo: {
      mode: "absolute-height",
      offset: 0.1,
    },
    renderer: {
      type: "simple",
      symbol: {
        type: "mesh-3d",
        symbolLayers: [
          {
            type: "fill",
            edges: {
              type: "sketch",
              color: [50, 50, 50, 1],
              size: 1,
              extensionLength: 5,
            },
            castShadows: false,
          },
        ],
      },
    },
  });
  webscene.add(areasLayer);

  const pedestrianAreaLayer = new GraphicsLayer();
  webscene.add(pedestrianAreaLayer);

  const queryTask = new QueryTask({
    url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Campus_features/FeatureServer/2",
  });

  queryTask
    .execute({
      returnZ: true,
      returnGeometry: true,
      where: "Class='Pedestrian'",
    })
    .then((result) => {
      for (let i = 0; i < result.features.length; i++) {
        console.log(result);
        const area = result.features[i].geometry;

        // Function that converts a polygon into a 3D mesh geometry
        const mesh = Mesh.createFromPolygon(area);

        pedestrianAreaLayer.add(
          new Graphic({
            geometry: mesh,
            symbol: {
              type: "mesh-3d",
              symbolLayers: [
                {
                  type: "fill",
                  material: {
                    color: [0, 0, 0, 0],
                  },
                  edges: {
                    type: "sketch",
                    color: [50, 50, 50, 1],
                    size: 1,
                    extensionLength: 5,
                  },
                },
              ],
            },
          })
        );
      }
    });

  const poi = new FeatureLayer({
    url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/CampusPOI/FeatureServer",
    screenSizePerspectiveEnabled: true,
    renderer: {
      type: "unique-value",
      field: "Class",
      uniqueValueInfos: [
        {
          value: "Parking",
          symbol: {
            type: "point-3d",
            symbolLayers: [
              {
                type: "icon",
                resource: { href: "./parking-icon.png" },
                material: { color: [255, 255, 255] },
                size: 40,
              },
            ],
            verticalOffset: {
              screenLength: 20,
              maxWorldLength: 10000,
              minWorldLength: 5,
            },
            callout: {
              type: "line",
              size: 1,
              color: [50, 50, 50, 1],
              border: {
                color: [0, 0, 0, 0],
              },
            },
          },
        },
      ],
    },
  });
  webscene.add(poi);

  const view = new SceneView({
    container: "viewDiv",
    qualityProfile: "high",
    map: webscene,
    viewingMode: "global",
    environment: {
      lighting: {
        date: "Mon January 15 2021 19:30:00 GMT+0100 (Central European Standard Time)",
      },
    },
    camera: {
      position: [-88.97955612, 39.83921313, 149.51383],
      heading: 45.34,
      tilt: 70.69,
    },
    highlightOptions: {
      color: "#505050",
    },
    popup: {
      dockEnabled: true,
      dockOptions: {
        // Disables the dock button from the popup
        buttonEnabled: false,
        // Ignore the default sizes that trigger responsive docking
        breakpoint: false,
      },
    },
  });

  view.environment.lighting.ambientOcclusionEnabled = false;
  view.environment.lighting.directShadowsEnabled = true;

  const settings = {
    buildingLabels: false,
    location: false,
  };

  const showLabelsBtn = document.getElementById("showLabels");
  showLabelsBtn.addEventListener("click", function (event) {
    settings.buildingLabels = !settings.buildingLabels;
    buildingsLayer.labelsVisible = settings.buildingLabels;
    showLabelsBtn.innerHTML = settings.buildingLabels ? "Hide building labels" : "Display building labels";
  });

  const showLocationBtn = document.getElementById("showLocation");
  showLocationBtn.addEventListener("click", function () {
    if (settings.location) {
      settings.location = false;
      locationLayer.removeAll();
      showLocationBtn.innerHTML = "Show user location";
    } else {
      // uncomment the next line if you want to use the geolocation API to get the real user location
      // showRealLocation();
      showFakeLocation();
    }
  });

  function showRealLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  function showFakeLocation() {
    // fake location: longitude: -88.97419803631782, latitude: 39.842138292328
    const location = {
      coords: {
        longitude: -88.97419803631782,
        latitude: 39.842138292328,
      },
    };
    showPosition(location);
  }

  const locationLayer = new GraphicsLayer({
    elevationInfo: {
      mode: "on-the-ground",
    },
    copyright:
      "Arrow by Samuel Lee on <a href='https://poly.google.com/view/aenIi8Ja9sO' target='_blank'>Google Poly</a>",
  });
  webscene.add(locationLayer);

  function showPosition(location) {
    const graphic = new Graphic({
      geometry: {
        type: "point",
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
      symbol: {
        type: "point-3d",
        symbolLayers: [
          {
            type: "object",
            resource: { href: "../assets/arrow/RLab-arrow.gltf" },
            material: { color: [50, 50, 50] },
            height: 3,
            tilt: 270,
            heading: 90,
            anchor: "relative",
            anchorPosition: {
              y: 0.5,
            },
          },
          {
            type: "icon",
            resource: { primitive: "circle" },
            material: { color: [255, 250, 239, 0] },
            outline: {
              color: [50, 50, 50],
              size: 3,
            },
            size: 40,
          },
        ],
      },
    });

    locationLayer.removeAll();
    locationLayer.add(graphic);
    view.goTo({ target: graphic, zoom: 19, tilt: 50 }, { speedFactor: 0.7 });

    settings.location = true;
    showLocationBtn.innerHTML = "Hide user location";
  }
});
