require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/widgets/FeatureTable"
], function (Map, MapView, FeatureLayer, FeatureTable) {
  const features = [];
  const webmap = new Map({
    basemap: "topo-vector"
  });

  // Capa de departamentos
  var departamentosLayer = new FeatureLayer({
    url: "https://ags.esri.co/arcgis/rest/services/DatosAbiertos/SERVICIOS_PUBLICOS_2005_DPTO/MapServer/0/query?where=1%3D1&outFields=OBJECTID,DPTO_CCDGO,DPTO_NAREA,DEPTO,Shape.STArea(),Shape.STLength(),Shape&outSR=4326&f=json",
    renderer: {
      type: "simple",
      symbol: {
        color: '#CEF2DA',
        type: "simple-fill",
        style: "solid",

      }
    },
    opacity: 0.30,
    labelingInfo: [trailheadsLabels],
  });

  webmap.add(departamentosLayer);

  // Capa de veredas
  var veredasLayer = new FeatureLayer({
    url: "https://ags.esri.co/arcgis/rest/services/DatosAbiertos/VEREDAS_2016/MapServer/0/",
    renderer: openSpacesRenderer,
    mode: FeatureLayer.MODE_ONDEMAND,
    opacity: 0.20,
    title: 'Veredas Colombia',
    popupTemplate: { // Enable a popup
      title: "{NOMBRE_VER}", // Show attribute value
      content: "Ubicada en el departamento del  {NOM_DEP} " // Display text in pop-up
    }
  });

  webmap.add(veredasLayer);


  let view = new MapView({
    container: "viewDiv",
    map: webmap,
    center: [-71.499, 2.043], // lon, lat
    zoom: 5,
    popup: {
      autoOpenEnabled: false
    } //disable popups
  });

  view.when(function () {
    var featureLayer = new FeatureLayer({
      url: "https://ags.esri.co/arcgis/rest/services/DatosAbiertos/VEREDAS_2016/MapServer/0/",
      title: "Veredas de Colombia"
    });

    // Create the feature table
    const featureTable = new FeatureTable({
      view: view, // required for feature highlight to work
      layer: featureLayer,
      // Autocast the FieldColumnConfigs
      fieldConfigs: [{
          name: "OBJECTID",
          label: "ID",
          // This field will not be shown in the table intially
          visible: false
        },
        {
          name: "NOMB_MPIO",
          label: "MUNICIPIO",
        },
        {
          name: "NOMBRE_VER",
          label: "VEREDA",
        },
        {
          name: "NOM_DEP",
          label: "DEPARTAMENTO",
          direction: "desc"

        }
      ],
      container: document.getElementById("tableDiv")
    });

    // Add buttons to the mapView
    view.ui.add(document.getElementById("actions"), "top-right");

    // Listen for the table's selection-change event
    featureTable.on("selection-change", function (changes) {
      // If the selection is removed, remove the feature from the array
      changes.removed.forEach(function (item) {
        const data = features.find(function (data) {
          return data.feature === item.feature;
        });
        if (data) {
          features.splice(features.indexOf(data), 1);
        }
      });

      // If the selection is added, push all added selections to array
      changes.added.forEach(function (item) {
        const feature = item.feature;
        features.push({
          feature: feature
        });
      });
    });

    // Listen for the click on the view and select any associated row in the table
    view.on("immediate-click", function (event) {
      view.hitTest(event).then(function (response) {
        const candidate = response.results.find(function (result) {
          return (
            result.graphic &&
            result.graphic.layer &&
            result.graphic.layer === featureLayer
          );
        });
        // Select the rows of the clicked feature
        candidate && featureTable.selectRows(candidate.graphic);
      });
    });

    const zoomBtn = document.getElementById("zoom");
    const fullExtentBtn = document.getElementById("fullextent");

    // Wire up button click event listeners
    zoomBtn.addEventListener("click", zoomToSelectedFeature);
    fullExtentBtn.addEventListener("click", fullExtent);

    // fires when "Zoom to selected feature(s)" button is clicked
    function zoomToSelectedFeature() {
      // Create a query off of the feature layer
      const query = featureLayer.createQuery();
      // Iterate through the features and grab the feature's objectID
      const featureIds = features.map(function (result) {
        return result.feature.getAttribute(featureLayer.objectIdField);
      });
      // Set the query's objectId
      query.objectIds = featureIds;
      // Make sure to return the geometry to zoom to
      query.returnGeometry = true;
      // Call queryFeatures on the feature layer and zoom to the resulting features
      featureLayer.queryFeatures(query).then(function (results) {
        view.goTo(results.features).catch(function (error) {
          if (error.name != "AbortError") {
            console.error(error);
          }
        });
      });
    }
    // Fires when "Full extent" button is clicked
    function fullExtent() {
      // Zooms to the full extent of the feature layer
      view.goTo(featureLayer.fullExtent).catch(function (error) {
        if (error.name != "AbortError") {
          console.error(error);
        }
      });
    }
  });
});

var trailheadsLabels = {
  symbol: {
    type: "text",
    color: "#FFFFFF",
    haloColor: "#5E8D74",
    haloSize: "2px",
    font: {
      size: "9px",
      family: "Noto Sans",
      style: "italic",
      weight: "normal"
    }
  },
  labelPlacement: "above-center",
  labelExpressionInfo: {
    expression: "$feature.DEPTO"
  }
};


function createFillSymbol(value, color) {
  return {
    value: value,
    symbol: {
      color: color,
      type: "simple-fill",
      style: "solid",
      outline: {
        style: "none"
      }
    },
    label: value
  };
}

var openSpacesRenderer = {
  type: "unique-value",
  field: "NOM_DEP",
  uniqueValueInfos: [
    createFillSymbol("VALLE DEL CAUCA", "#9E559C"),
    createFillSymbol("CUNDINAMARCA", "#A7C636"),
    createFillSymbol("ANTIOQUIA", "#149ECE"),
    createFillSymbol("CASANARE", "#ED5151")
  ]
};


require(["dojo/dnd/Moveable", "dojo/dom", "dojo/on", "dojo/domReady!"],
  function (Moveable, dom, on) {
    on(dom.byId("table"), "click", function () {
      var dnd = new Moveable(dom.byId("tableDiv"));
    });
  });



document.querySelector('#logout').addEventListener('click', (e) => {
  sessionStorage.clear();
  window.location.href = '../';
  console.log('cerrar sesion');

});