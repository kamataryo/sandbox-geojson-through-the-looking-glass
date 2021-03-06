const draw = new window.MapboxDraw({
  boxSelect: false,
  controls: {
    point: false,
    line_string: false,
    polygon: true,
    trash: false,
    combine_features: false,
    uncombine_features: false
  },
  styles: [
    {
      id: "draw-polygon",
      type: "fill",
      filter: ["all", ["==", "$type", "Polygon"], ["==", "meta", "feature"]],
      paint: {
        "fill-color": ["string", ["get", "user_fill"], "#7e7e7e"],
        "fill-opacity": [
          "case",
          ["==", ["get", "active"], "true"],
          0.2,
          ["number", ["get", "user_fill-opacity"], 1.0]
        ],
        "fill-outline-color": [
          "case",
          ["==", ["get", "active"], "true"],
          "#ff6600",
          ["string", ["get", "user_stroke"], "#555555"]
        ]
      }
    },
    {
      id: "draw-linestring",
      type: "line",
      filter: ["all", ["==", "$type", "LineString"], ["==", "meta", "feature"]],
      paint: {
        "line-width": ["number", ["get", "user_stroke-width"], 2],
        "line-color": [
          "case",
          ["==", ["get", "active"], "true"],
          "#ff6600",
          ["string", ["get", "user_stroke"], "#555555"]
        ],
        "line-opacity": [
          "case",
          ["==", ["get", "active"], "true"],
          0.2,
          ["number", ["get", "user_stroke-opacity"], 1.0]
        ]
      },
      layout: {
        "line-cap": "round",
        "line-join": "round"
      }
    },
    {
      id: "draw-active-points",
      type: "circle",
      filter: ["all", ["==", "$type", "Point"], ["==", "meta", "feature"]],
      paint: {
        "circle-radius": [
          "case",
          ["==", "small", ["get", "user_marker-size"]],
          3,
          ["==", "large", ["get", "user_marker-size"]],
          13,
          9
        ],
        "circle-color": ["string", ["get", "user_marker-color"], "#7e7e7e"],
        "circle-opacity": [
          "case",
          ["==", ["get", "active"], "true"],
          0.2,
          ["number", ["get", "user_fill-opacity"], 0.6]
        ],
        "circle-stroke-width": ["number", ["get", "user_stroke-width"], 2],
        "circle-stroke-color": [
          "case",
          ["==", ["get", "active"], "true"],
          "#ff6600",
          ["string", ["get", "user_stroke"], "#555555"]
        ],
        "circle-stroke-opacity": ["number", ["get", "user_stroke-opacity"], 1.0]
      }
    },
    {
      id: "draw-linestring-symbol",
      type: "symbol",
      filter: ["all", ["==", "$type", "LineString"], ["==", "meta", "feature"]],
      paint: {
        "text-color": "#000000",
        "text-halo-color": "rgba(255, 255, 255, 1)",
        "text-halo-width": 2
      },
      layout: {
        "symbol-placement": "line",
        "text-field": [
          "case",
          ["==", ["get", "active"], "true"],
          "",
          ["==", ["get", "active"], "false"],
          ["get", "user_title"],
          ""
        ],
        "text-font": ["Noto Sans Regular"],
        "text-size": 12,
        "text-max-width": 12,
        "text-allow-overlap": false
      }
    },
    {
      id: "draw-polygon-symbol",
      type: "symbol",
      filter: ["all", ["==", "$type", "Polygon"], ["==", "meta", "feature"]],
      paint: {
        "text-color": "#000000",
        "text-halo-color": "rgba(255, 255, 255, 1)",
        "text-halo-width": 2
      },
      layout: {
        "text-field": [
          "case",
          ["==", ["get", "active"], "false"],
          ["get", "user_title"],
          ""
        ],
        "text-font": ["Noto Sans Regular"],
        "text-size": 12,
        "text-max-width": 12,
        "text-offset": [0, 0],
        "text-allow-overlap": false
      }
    },
    {
      id: "draw-point-symbol",
      type: "symbol",
      filter: ["all", ["==", "$type", "Point"], ["==", "meta", "feature"]],
      paint: {
        "text-color": "#333333",
        "text-halo-color": "rgba(255, 255, 255, 1)",
        "text-halo-width": 2
      },
      layout: {
        "icon-image": [
          "case",
          ["==", ["get", "active"], "false"],
          ["concat", ["get", "user_marker-symbol"], "-11"],
          ""
        ],
        "text-field": [
          "case",
          ["==", ["get", "active"], "false"],
          ["get", "user_title"],
          ""
        ],
        "text-font": ["Noto Sans Regular"],
        "text-size": 12,
        "text-anchor": "top",
        "text-max-width": 12,
        "text-offset": [
          "case",
          ["==", "small", ["get", "user_marker-size"]],
          ["literal", [0, 0.4]],
          ["==", "large", ["get", "user_marker-size"]],
          ["literal", [0, 1.2]],
          ["literal", [0, 1]]
        ],
        "text-allow-overlap": false
      }
    }
  ],
  userProperties: true
});

class ThroughTheLookingGrassControl {
  container = null;
  constructor() {
    const container = document.createElement("div");
    const buttonControlGroup = document.createElement("div");
    buttonControlGroup.className = "buttons mapboxgl-ctrl mapboxgl-ctrl-group";

    const button = document.createElement("button");
    button.innerText = `Rev`;

    button.addEventListener("click", () => {
      const geoJSONs = draw.getAll();
      console.log(JSON.stringify(geoJSONs.features[0].geometry.coordinates[0]));
      for (let index = 0; index < geoJSONs.features.length; index++) {
        const coords = geoJSONs.features[index].geometry.coordinates[0];
        const nextCoords = [...coords];
        nextCoords.reverse();
        geoJSONs.features[index].geometry.coordinates[0] = nextCoords;
      }
      draw.deleteAll().set(geoJSONs);
    });
    buttonControlGroup.appendChild(button);

    container.appendChild(buttonControlGroup);
    this.container = container;
  }
  onAdd(map) {
    return this.container;
  }
}

const map = new window.geolonia.Map(document.getElementById("map"));
map.addControl(draw, "top-right");
map.addControl(new ThroughTheLookingGrassControl(), "top-right");
