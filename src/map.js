import mapboxgl from 'mapbox-gl'
import "mapbox-gl/dist/mapbox-gl.css"
import {Deck} from '@deck.gl/core';
import {ArcLayer} from '@deck.gl/layers';
import {ScatterplotLayer} from '@deck.gl/layers';
import {GetWFS} from "./wfsProecssor";

mapboxgl.accessToken = "pk.eyJ1IjoibGlxdWlkc3VuODYiLCJhIjoiY2syeDkwb2RzMDlnbTNncGQ3amU1aGR2OSJ9.YU3MLFHx8BoYbrF0Xl9Lag";

const INITIAL_VIEW_STATE = {
    latitude: 47.8095,
    longitude: 13.0550,
    zoom: 10,
    bearing: 0,
    pitch: 0
};

//Instantiate mapboxgl map into map div html element
const MAPGL = new mapboxgl.Map({
    container: 'map',
    style: "mapbox://styles/mapbox/dark-v10",
    zoom: INITIAL_VIEW_STATE.zoom,
    center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude]
});

//Instantiate deck.gl into canvas html element
const DECK = new Deck({
    canvas: 'deck-canvas',
    width: '100%',
    height: '100%',
    initialViewState: INITIAL_VIEW_STATE,
    controller: true,
    //workaround to synchronise deck.gl canvas with mapboxgl
    onViewStateChange: ({viewState}) => {
        MAPGL.jumpTo({
            center: [viewState.longitude, viewState.latitude],
            zoom: viewState.zoom,
            bearing: viewState.bearing,
            pitch: viewState.pitch
        });
    },
    layers: [

    ]
});

//Constructs a mapbox tiled layer from Goserver
//parametric views. Creates a WMS request based on passed parameters
//and returns mapbox tiled layer.
function ConstructWMSLayer(month,day,id) {
    //console.log(month,day)
    let layer = {
        'id':id,
        'type': 'raster',
        'source': {
            'type': 'raster',
            'tiles': [],
            'tileSize': 256
        },
        'paint':{}
        };
    let url = 'https://zgis221.geo.sbg.ac.at/geoserver/airtraffic_noise_wi/wms?'+
        'format=image/png&bbox={bbox-epsg-3857}&service=WMS&version=1.3.0&' +
        'request=GetMap&crs=EPSG:3857&dpiMode=7&width=256&height=256&transparent=true';
    if(month==='Choose...'&&day==='Choose...'){
        url = url + '&layers=airtraffic_noise_wi:noise_all';
    }
    else if(month!='Choose...'&&day==='Choose...'){
        url = url + '&layers=airtraffic_noise_wi:monthly_noise&viewparams=month:' + month
    }else if(month==='Choose...'&&day!='Choose...'){
        url = url + '&layers=airtraffic_noise_wi:daily_noise&viewparams=day:' + day
    }else if(month!='Choose...'&&day!='Choose...'){
        url = url + '&layers=airtraffic_noise_wi:day_by_month_noise&viewparams=day:' + day + ';month:'+month
    }
    layer.source.tiles.push(url);
    return layer
}

//Constructs a Deck.gl Arc layer from Goserver
//parametric views. Creates a WFS request based on passed parameters
//and returns Deck.gl Arc layer.
function ConstructDeckArc(month,day,id) {
    let url = 'https://zgis221.geo.sbg.ac.at/geoserver/airtraffic_noise_wi/wfs?'+
        'request=GetFeature&service=WFS&version=1.3.0&outputFormat=application/json&typeName=airtraffic_noise_wi:'+ id;
    if(month==='Choose...'&&day==='Choose...'){
        url = url;
    }
    else if(month!='Choose...'&&day==='Choose...'){
        url = url + '&viewparams=date_type1:month;date_type2:month;date_val1:' +  month + ';date_val2:' + month
    }else if(month==='Choose...'&&day!='Choose...'){
        url = url + '&viewparams=date_type1:dow;date_type2:dow;date_val1:' +  day + ';date_val2:' + day
    }else if(month!='Choose...'&&day!='Choose...'){
        url = url + '&viewparams=date_type1:month;date_type2:dow;date_val1:' +  month + ';date_val2:' + day
    }
    let data = GetWFS(url);
    let arcLayer = data.then(e=> {
        return  new ArcLayer({
            id: id,
            data:e.data.features,
            // Styles
            getSourcePosition: f => f.geometry.coordinates[0],
            getTargetPosition: f => f.geometry.coordinates[1],
            getSourceColor: [0, 0, 255],
            getTargetColor: [255, 0, 0],
            autoHighlight: true,
            opacity:0.4,
            highlightColor: [0, 0, 128, 128],
            pickable: true,
            getHeight: 0.5,
            onHover: f => setTooltip(f.object, f.x, f.y),
            getWidth: f => getSize(f.properties.count)
        });
    });
    return arcLayer;
}


//Constructs a Deck.gl Scatterplot layer from Goserver
//parametric views. Creates a WFS request based on passed parameters
//and returns Deck.gl Scatterplot layer.
function ConstructDeckPoints(month,day,id) {
    let url = 'https://zgis221.geo.sbg.ac.at/geoserver/airtraffic_noise_wi/wfs?'+
        'request=GetFeature&service=WFS&version=1.3.0&outputFormat=application/json&typeName=airtraffic_noise_wi:'+ id;
    if(month==='Choose...'&&day==='Choose...'){
        url = url;
    }
    else if(month!='Choose...'&&day==='Choose...'){
        url = url + '&viewparams=date_type1:month;date_type2:month;date_val1:' +  month + ';date_val2:' + month
    }else if(month==='Choose...'&&day!='Choose...'){
        url = url + '&viewparams=date_type1:dow;date_type2:dow;date_val1:' +  day + ';date_val2:' + day
    }else if(month!='Choose...'&&day!='Choose...'){
        url = url + '&viewparams=date_type1:month;date_type2:dow;date_val1:' +  month + ';date_val2:' + day
    }
    let data = GetWFS(url);
    //console.log(data);
    let pointsLayer = data.then(e=> {
        console.log(e.data.features);
        return new ScatterplotLayer({
            id: id,
            data:e.data.features,
            pickable: true,
            opacity: 0.8,
            autoHighlight: true,
            stroked: true,
            filled: true,
            radiusScale: 1000,
            radiusMinPixels: 1,
            radiusMaxPixels: 1000,
            lineWidthMinPixels: 1,
            getPosition: d => d.geometry.coordinates,
            getRadius: f => getSize(f.properties.count),
            getFillColor: d => [255, 140, 0],
            getLineColor: d => [0, 0, 0],
            onHover: f => setTooltip(f.object, f.x, f.y)
        });
    });
    return pointsLayer;
}

//Creates tooltip for Deck.gl layers
function setTooltip(object, x, y) {
    const el = document.getElementById('tooltip');
    //console.log(el);
    if (object) {
        el.innerHTML = '<p>'+ 'flights: ' +'<b>' + object.properties.count+'</b>' + '</p>' +
            '<p>'+ 'country: ' +'<b>' + object.properties.country+'</b>' + '</p>'+
            '<p>'+ 'city: ' +'<b>' + object.properties.city+'</b>' + '</p>';
        el.style.display = 'inline-block';
        el.style.left = x + 'px';
        el.style.top = y + 'px';
    } else {
        el.style.display = 'none';
    }
}

//Calculates sizes for deck.gl layers based on passed value
function getSize(num) {
   if (num<=10){return 0.7;}
   else if(num>10&&num<=500){return 2;}
   else if(num>500&&num<=1000){return 4;}
   else {return 8;}
}

export {ConstructWMSLayer, ConstructDeckArc, ConstructDeckPoints,DECK,MAPGL}