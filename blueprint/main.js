require([
  "esri/layers/FeatureLayer",
  "esri/layers/SceneLayer",
  "esri/Graphic",
  "esri/WebScene",
  "esri/views/SceneView",
  "esri/layers/GraphicsLayer",
  "esri/layers/support/LabelClass",
], function (FeatureLayer, SceneLayer, Graphic, WebScene, SceneView, GraphicsLayer, LabelClass) {
  const webscene = new WebScene({
    ground: {
      surfaceColor: [1, 87, 133],
    },
  });

  const alpha = 0.8;

  const buildingsLayer = new SceneLayer({
    url: "https://tiles.arcgis.com/tiles/V6ZHFr6zdgNZuVG0/arcgis/rest/services/campus_buildings_sketch/SceneServer",
    screenSizePerspectiveEnabled: false,
    copyright:
      "Building footprints © <a href='https://www.openstreetmap.org/copyright/en' target='_blank'>OpenStreetMap contributors</a>, 3D models generated with <a href='https://www.esri.com/en-us/arcgis/products/arcgis-cityengine/overview'>CityEngine</a>",
    renderer: {
      type: "simple",
      symbol: {
        type: "mesh-3d",
        symbolLayers: [
          {
            type: "fill",
            material: { color: [1, 87, 133, 0.05] },
            edges: {
              type: "solid",
              color: [255, 255, 255],
              size: 0.5,
              extensionLength: 0,
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
                color: [255, 255, 255, alpha],
              },
              halo: {
                size: 0,
                color: [255, 255, 255, alpha],
              },
              font: {
                size: 11,
                family: `"Avenir Next","Helvetica Neue",Helvetica,Arial,sans-serif`,
              },
            },
          ],
          verticalOffset: {
            screenLength: 40,
            maxWorldLength: 500,
            minWorldLength: 0,
          },
          callout: {
            type: "line",
            size: 0.5,
            color: [255, 255, 255, alpha],
            border: {
              color: [0, 0, 0, 0],
            },
          },
        },
      }),
    ],
  });

  const treesLayer = new FeatureLayer({
    title: "Trees",
    legendEnabled: false,
    url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Campus_features/FeatureServer/0",
    elevationInfo: {
      mode: "relative-to-scene",
      featureExpression: {
        expression: "0",
      },
    },
    renderer: {
      type: "simple", // autocasts as new UniqueValueRenderer()
      symbol: {
        type: "point-3d",
        symbolLayers: [
          {
            type: "object",
            resource: { href: "https://static.arcgis.com/arcgis/styleItems/ThematicTrees/web/resource/Unknown.json" },
            material: { color: [255, 255, 255, 0.5] },
            height: 20,
            anchor: "bottom",
          },
        ],
      },
      visualVariables: [
        {
          // size can be modified with the interactive handle
          type: "size",
          //field: "Height",
          valueExpression: "$feature.Height/2",
          axis: "height",
          valueUnit: "meters",
        },
        {
          // rotation can be modified with the interactive handle
          type: "rotation",
          field: "Rotation",
        },
      ],
    },
  });

  const areasLayer = new FeatureLayer({
    url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Campus_features/FeatureServer/2",
    title: "Areas",
    renderer: {
      type: "unique-value",
      field: "Class",
      uniqueValueInfos: [
        {
          value: "Parc",

          symbol: {
            type: "polygon-3d",
            symbolLayers: [
              {
                type: "fill",
                material: { color: [1, 87, 133] },
                outline: {
                  color: [255, 255, 255, 0.3],
                  size: 1.2,
                },
              },
            ],
          },
        },
        {
          value: "Water",
          symbol: {
            type: "polygon-3d",
            symbolLayers: [
              {
                type: "fill",
                pattern: {
                  type: "style",
                  style: "forward-diagonal",
                },
                material: {
                  color: [255, 255, 255],
                },
              },
            ],
          },
        },
        {
          value: "Pedestrian",

          symbol: {
            type: "polygon-3d",
            symbolLayers: [
              {
                type: "fill",
                material: { color: [1, 87, 133, 0] },
              },
            ],
          },
        },
        {
          value: "Parking",
          symbol: {
            type: "polygon-3d",
            symbolLayers: [
              {
                type: "fill",
                pattern: {
                  type: "style",
                  style: "horizontal",
                },
                material: {
                  color: [255, 255, 255],
                },
              },
            ],
          },
        },
      ],
    },
  });

  const poi = new FeatureLayer({
    url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/CampusPOI/FeatureServer",
    screenSizePerspectiveEnabled: false,
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
                resource: {
                  primitive: "circle",
                },
                material: { color: [0, 0, 0, 0] },
                outline: {
                  color: [255, 255, 255, alpha],
                  size: 1,
                },
                size: 18,
                anchor: "bottom",
              },
              {
                type: "icon",
                resource: { href: "https://static.arcgis.com/arcgis/styleItems/Icons/web/resource/Parking.svg" },
                material: { color: [255, 255, 255, alpha] },
                size: 10,
                anchor: "relative",
                anchorPosition: { x: 0, y: 1 },
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
              color: [255, 255, 255, alpha],
              border: {
                color: [0, 0, 0, 0],
              },
            },
          },
        },
        {
          value: "Image",
          symbol: {
            type: "point-3d",
            symbolLayers: [
              {
                type: "icon",
                resource: {
                  href: "../assets/icon.svg",
                },

                material: { color: [255, 255, 255, alpha] },
                size: 70,
              },
            ],
          },
        },
      ],
    },
  });

  const roads = new FeatureLayer({
    url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Campus_features/FeatureServer/1",
    definitionExpression: "Class='Street'",
    renderer: {
      type: "unique-value",
      field: "Class",
      uniqueValueInfos: [
        {
          value: "Street",
          symbol: {
            type: "line-3d",
            symbolLayers: [
              {
                type: "path",
                profile: "quad",
                material: { color: [255, 255, 255, 0.5] },
                width: 1,
                height: 0.4,
                join: "miter",
                cap: "butt",
                anchor: "bottom",
                profileRotation: "all",
              },
            ],
          },
        },
      ],
    },
  });

  webscene.addMany([buildingsLayer, treesLayer, areasLayer, poi, roads]);

  const view = new SceneView({
    container: "viewDiv",
    qualityProfile: "high",
    map: webscene,
    environment: {
      lighting: {
        date: "Mon Sep 15 2021 20:30:00 GMT+0100 (Central European Standard Time)",
        ambientOcclusionEnabled: false,
        directShadowsEnabled: false,
      },
      background: {
        type: "color",
        color: [1, 87, 133],
      },
      starsEnabled: false,
      atmosphereEnabled: false,
    },
    camera: {
      position: [-88.97955612, 39.83921313, 149.51383],
      heading: 45.34,
      tilt: 70.69,
    },
    constraints: {
      altitude: {
        max: 500,
      },
    },
    highlightOptions: {
      color: "#ffffff",
      fillOpacity: 0.1,
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
            material: { color: [255, 255, 255] },
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
              color: [255, 255, 255],
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
