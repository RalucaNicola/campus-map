require([
  "esri/layers/FeatureLayer",
  "esri/layers/SceneLayer",
  "esri/Graphic",
  "esri/WebScene",
  "esri/views/SceneView",
  "esri/widgets/Editor",
  "esri/layers/GraphicsLayer",
  "esri/layers/support/LabelClass",
], function (FeatureLayer, SceneLayer, Graphic, WebScene, SceneView, Editor, GraphicsLayer, LabelClass) {
  const webscene = new WebScene({
    ground: {
      surfaceColor: "white",
    },
  });

  const buildingsLayer = new SceneLayer({
    url: "https://tiles.arcgis.com/tiles/V6ZHFr6zdgNZuVG0/arcgis/rest/services/campus_buildings/SceneServer",
    screenSizePerspectiveEnabled: false,
    copyright:
      "Building footprints © <a href='https://www.openstreetmap.org/copyright/en' target='_blank'>OpenStreetMap contributors</a>, 3D models generated with <a href='https://www.esri.com/en-us/arcgis/products/arcgis-cityengine/overview'>CityEngine</a>",
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
                size: 11,
                family: `"Avenir Next","Helvetica Neue",Helvetica,Arial,sans-serif`,
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
            size: 0.5,
            color: [50, 50, 50],
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
      mode: "absolute-height",
    },
    renderer: {
      type: "unique-value", // autocasts as new UniqueValueRenderer()
      field: "Class",
      defaultSymbol: {
        type: "point-3d",
        symbolLayers: [
          {
            type: "object",
            resource: { href: "./assets/trees/Leyland_Cypress.glb" },
            material: { color: [86, 140, 10] },
            height: 20,
          },
        ],
      },
      visualVariables: [
        {
          // size can be modified with the interactive handle
          type: "size",
          field: "Height",
          axis: "height",
          valueUnit: "meters",
        },
        {
          // rotation can be modified with the interactive handle
          type: "rotation",
          field: "Rotation",
        },
      ],
      uniqueValueInfos: [
        {
          value: "Eucalyptus",
          label: "Fagus",
          symbol: {
            type: "point-3d",
            symbolLayers: [
              {
                type: "object",
                resource: { href: "./assets/trees/Blue_Gum_Eucalyptus.glb" },
                material: { color: [86, 140, 10] },
                height: 20,
              },
            ],
          },
        },
        {
          value: "Apricot",
          label: "Larix",
          symbol: {
            type: "point-3d",
            symbolLayers: [
              {
                type: "object",
                resource: { href: "./assets/trees/Apricot.glb" },
                material: { color: [142, 181, 87] },
                height: 20,
              },
            ],
          },
        },
      ],
    },
  });

  const areasLayer = new FeatureLayer({
    url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Campus_features/FeatureServer/2",
    elevationInfo: {
      mode: "on-the-ground",
    },
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
                type: "extrude",
                material: { color: [178, 195, 136, 1] },
                size: 0.5,
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
                type: "water",
                waveDirection: 260,
                color: "#a5c2d1",
                waveStrength: "rippled",
                waterbodySize: "small",
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
                material: { color: [255, 225, 181, 0.3] },
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
                type: "extrude",
                material: { color: [150, 150, 150, 1] },
                size: 0.2,
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
                  href: "https://static.arcgis.com/arcgis/styleItems/Icons/web/resource/StandingCircle.svg",
                },
                material: { color: [9, 122, 181] },
                size: 18,
              },
              {
                type: "icon",
                resource: { href: "https://static.arcgis.com/arcgis/styleItems/Icons/web/resource/Parking.svg" },
                material: { color: [255, 255, 255] },
                size: 10,
              },
            ],
            verticalOffset: {
              screenLength: 10,
              maxWorldLength: 10000,
              minWorldLength: 5,
            },
            callout: {
              type: "line",
              size: 1,
              color: [255, 255, 255, 1],
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
                  href: "./assets/icon.svg",
                },

                material: { color: [255, 255, 255] },
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
                material: { color: [150, 150, 150, 1] },
                width: 10,
                height: 0.2,
                join: "miter",
                cap: "butt",
                anchor: "bottom",
                profileRotation: "all",
              },
              {
                type: "path",
                profile: "quad",
                material: { color: [255, 255, 255, 1] },
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
    qualityProfile: "medium",
    map: webscene,
    environment: {
      lighting: {
        date: "Mon Feb 15 2021 21:30:00 GMT+0100 (Central European Standard Time)",
        ambientOcclusionEnabled: true,
        directShadowsEnabled: true,
        waterReflectionEnabled: true,
      },
    },
    camera: {
      position: [-88.97900008, 39.83987331, 149.51383],
      heading: 45.34,
      tilt: 70.69,
    },
    constraints: {
      altitude: {
        max: 500,
      },
    },
  });

  // uncomment these lines if you want to edit features in the scene
  // const editor = new Editor({
  //   view: view,
  // });
  // const snappingSources = [{ layer: areasLayer}, {layer: roads}];
  // editor.viewModel.sketchViewModel.snappingOptions = {
  //   enabled: true,
  //   selfEnabled: true,
  //   featureEnabled: true,
  //   featureSources: snappingSources
  // };
  // view.ui.add(editor, "top-right");

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
            resource: { href: "assets/arrow/RLab-arrow.gltf" },
            material: { color: [162, 132, 245] },
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
              color: [162, 132, 245],
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

  /* switch the map padding depending on the device */

  const mqDesktop = window.matchMedia("(min-width: 681px)");

  setCorrectPadding(mqDesktop);
  mqDesktop.addEventListener("change", setCorrectPadding);

  function setCorrectPadding(mq) {
    if (mq.matches) {
      view.padding = {
        left: 420,
        bottom: 0,
      };
    } else {
      const height = document.body.clientHeight;
      const percentageHeight = (4 / 10) * height;
      view.padding = {
        left: 0,
        bottom: percentageHeight,
      };
    }
  }
});
