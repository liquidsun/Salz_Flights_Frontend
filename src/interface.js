import 'bootstrap/dist/css/bootstrap.css'
import $ from 'jquery'
import {ConstructWMSLayer,MAPGL,DECK,ConstructDeckArc,ConstructDeckPoints} from "./map";
import {CreateGraph,ClearGraph} from './d3_graphs'

//Constructs all interface parts
function CreateInterface(interface_skeleton){
    createLayerLoadMenu(interface_skeleton);
    createChartsControlMenu(interface_skeleton);
    createBottomBarButton();
    createLegend();
}

//Constructs layer load menu
function createLayerLoadMenu(interface_skeleton) {
    $('<form></form>',{id:'layer-load-form'}).appendTo('#menu');
    //add container rows
    //row for dropdowns

    $('<label></label>',{
        html:'Select time interval<br />(one, two or leave empty <br />to get all data):',
        labelMaxWidth: 10
    }).appendTo('#layer-load-form');
    $('<div></div>',{
        class: 'form-row align-items-center',
        id:'dropdowns-form-control'
    }).appendTo('#layer-load-form');

    //row for mapgl layers buttons
    $('<label></label>',{
        for:"map-layer-load-button-div",
        text:'Noise information:'
    }).appendTo('#layer-load-form');
    $('<div></div>',{
        class: 'form-row align-items-center',
        id:'map-layers-form-control'
    }).appendTo('#layer-load-form');

    //row for deck layers buttons
    //origins
    $('<label></label>',{
        for:"origins-deck-layer-load-button-div",
        text:'Incoming flights:'
    }).appendTo('#layer-load-form');
    $('<div></div>',{
        class: 'form-row align-items-center',
        id:'origins-deck-layers-form-control'
    }).appendTo('#layer-load-form');

    //destinatons
    $('<label></label>',{
        for:"destinations-deck-layer-load-button-div",
        text:'Outgoing flights:'
    }).appendTo('#layer-load-form');
    $('<div></div>',{
        class: 'form-row align-items-center',
        id:'destinations-deck-layers-form-control'
    }).appendTo('#layer-load-form');

    //date dropdowns
    interface_skeleton.dropdowns.layer_menu.forEach(d=>{
        //console.log(d.type);
        $('<div></div>',{
            class:"col-auto my-1",
            id:d.type
        }).appendTo('#dropdowns-form-control');
        $('<select></select>',{
            class:"form-control form-control-sm",
            id: d.type + '-select'
        }).appendTo('#'+d.type);
        $('<option selected>Choose...</option>').appendTo('#'+d.type+'-select');
        Object.keys(d.dropdownValues).forEach(v=>{
            //console.log(v,d.dropdownValues[v]);
            $('<option></option>',{
                value:v,
                text:d.dropdownValues[v]
            }).appendTo('#' + d.type + '-select')
        })
    });

    //mapbox layer buttons
    $('<div></div>',{
        class:"col-auto my-1",
        id:'map-layer-load-button-div'
    }).appendTo('#map-layers-form-control');
    $('<button></button>', {
        type:"button",
        class:"btn btn-warning btn-sm ml-1",
        id:"map-layer-load",
        text:'Load'
    }).on('click',()=>{
        layerLoadButtonClickHandler($('#months-select')[0].value,$('#days-select')[0].value,{type:'map',id:'noise'})
    }).appendTo('#map-layer-load-button-div');
    $('<button></button>', {
        type:"button",
        class:"btn btn-warning btn-sm ml-1",
        id:"map-layer-remove",
        text:'Remove'
    }).on('click',()=>{
        layerRemoveButtonClickHandler({type:'map',id:'noise'})
    }).appendTo('#map-layer-load-button-div');

    //deck layers buttons
    //origins
    $('<div></div>',{
        class:"col-auto my-1",
        id:'origins-deck-layer-load-button-div'
    }).appendTo('#origins-deck-layers-form-control');
    $('<button></button>', {
        type:"button",
        class:"btn btn-warning btn-sm ml-1",
        id:"deck-layer1-load",
        text:'Load'
    }).on('click',()=>{
        layerLoadButtonClickHandler($('#months-select')[0].value,$('#days-select')[0].value,{type:'deck',id:'origins'})
    }).appendTo('#origins-deck-layer-load-button-div');
    $('<button></button>', {
        type:"button",
        class:"btn btn-warning btn-sm ml-1",
        id:"deck-layer1-remove",
        text:'Remove'
    }).on('click',()=>{
        layerRemoveButtonClickHandler({type:'deck',id:'origins'})
    }).appendTo('#origins-deck-layer-load-button-div');

    //destinations
    $('<div></div>',{
        class:"col-auto my-1",
        id:'destinations-deck-layer-load-button-div'
    }).appendTo('#destinations-deck-layers-form-control');
    $('<button></button>', {
        type:"button",
        class:"btn btn-warning btn-sm ml-1",
        id:"deck-layer2-load",
        text:'Load'
    }).on('click',()=>{
        layerLoadButtonClickHandler($('#months-select')[0].value,$('#days-select')[0].value,{type:'deck',id:'destinations'})
    }).appendTo('#destinations-deck-layer-load-button-div');
    $('<button></button>', {
        type:"button",
        class:"btn btn-warning btn-sm ml-1",
        id:"deck-layer2-remove",
        text:'Remove'
    }).on('click',()=>{
        layerRemoveButtonClickHandler({type:'deck',id:'destinations'})
    }).appendTo('#destinations-deck-layer-load-button-div')
}

//Constructs bottom bar chart menu
function createChartsControlMenu(interface_skeleton) {
    //main form
    const chartFrom = $('<form></form>', {id:'chart-control-form'}).appendTo('#chart-control');

    //add container rows
    //label for flights
    const flightsLabel = $('<label></label>', {
        html:'Show number of flights<br />grouped by:',
    });

    //form row for flights dropdowns
    const flightsDropdownRow = $('<div></div>', {
        class: 'form-row align-items-center'
    });

    //dropdowns for flights
    //Iterate through object, create dropdowns and items
    interface_skeleton.dropdowns.chart_menu.flights.forEach(d => {
        //div to hold dropdown
        const flightsDropdownDiv = $('<div></div>', {
            class: "col-auto my-1",
            id: 'chart-' + d.type
        });

        //dropdown
        const flightsDropdown = $('<select></select>', {
            class: "form-control form-control-sm",
            id: 'chart-' + d.type + '-select'
        });

        //dropdown options
        flightsDropdown.append($('<option selected>Choose...</option>'));

        Object.keys(d.dropdownValues).forEach(v => {
            flightsDropdown.append($('<option></option>', {
                value: v,
                text: d.dropdownValues[v]
            }))
        });
        flightsDropdownDiv.append(flightsDropdown);
        flightsDropdownRow.append(flightsDropdownDiv)
    });


    //form row for flights buttons
    const flightsButtonRow = $('<div></div>', {
        class: 'form-row align-items-center'
    });

    //div for flights buttons
    const flightsButtons = $('<div></div>',{
        class:"col-auto my-1",
        id:'chart-fligths-buttons-div'
    });
    //add buttons to button div
    flightsButtons.append($('<button></button>', {
        type:"button",
        class:"btn btn-warning btn-sm ml-1",
        id:"chart-show",
        text:'Show'
    }).on('click',()=>{
        chartLoadButtonClickHandler([$('#chart-grouping-select')[0].value],'flights')
    }));

    flightsButtons.append($('<button></button>', {
        type:"button",
        class:"btn btn-warning btn-sm ml-1",
        id:"chart-remove",
        text:'Remove'
    }).on('click',()=>{
        chartRemoveButtonClickHandler()
    }));

    //add buttons div to button row
    flightsButtonRow.append(flightsButtons);

    //add everything to the form

    chartFrom.append(flightsLabel,flightsDropdownRow,flightsButtonRow);


    //Label for origins\destinations airports dropdown
    const airportsTypeLabel = $('<label></label>', {
        html:'Show flights per country:',
        for: 'airportsTypeDropdownRow'
    });

    //Label for time intervals dropdowns
    const airportsDatesLabel = $('<label></label>', {
        text: 'Choose dates for grouping',
        for:  'airportsDatesDropdownRow'
    });


    //form rows for airport dropdowns

    const airportsTypeDropdownRow = $('<div></div>', {
        class: 'form-row align-items-center',
        id:'airportsTypeDropdownRow'
    });

    const airportsDatesDropdownRow = $('<div></div>', {
        class: 'form-row align-items-center',
        id: 'airportsDatesDropdownRow'
    });



    //dropdowns for airport
    //Iterate through object, create dropdowns and items
    interface_skeleton.dropdowns.chart_menu.airports.forEach(d => {
        //div to hold dropdown
        const airportDropdownDiv = $('<div></div>', {
            class: "col-auto my-1",
            id: 'chart-' + d.type
        });

        //dropdown
        const airportDropdown = $('<select></select>', {
            class: "form-control form-control-sm",
            id: 'chart-' + d.type + '-select'
        });

        //dropdown options
        airportDropdown.append($('<option selected>Choose...</option>'));

        Object.keys(d.dropdownValues).forEach(v => {
            airportDropdown.append($('<option></option>', {
                value: v,
                text: d.dropdownValues[v]
            }))
        });
        airportDropdownDiv.append(airportDropdown);
        if(d.type === 'or_dest'){
            airportsDatesDropdownRow.append(airportDropdownDiv)
        }else{
            airportsTypeDropdownRow.append(airportDropdownDiv)
        }
    });


    //form row for airports buttons
    const airportsButtonRow = $('<div></div>', {
        class: 'form-row align-items-center'
    });

    //div for flights buttons
    const airportsButtons = $('<div></div>',{
        class:"col-auto my-1",
        id:'chart-fligths-buttons-div'
    });
    //add buttons to button div
    airportsButtons.append($('<button></button>', {
        type:"button",
        class:"btn btn-warning btn-sm ml-1",
        id:"chart-show",
        text:'Show'
    }).on('click',()=>{
        if($('#check-origins'.checked)) {
            chartLoadButtonClickHandler([$('#chart-months-select')[0].value, $('#chart-days-select')[0].value,
                $('#chart-or_dest-select')[0].value], 'airports')
        }
        }));

    airportsButtons.append($('<button></button>', {
        type:"button",
        class:"btn btn-warning btn-sm ml-1",
        id:"chart-remove",
        text:'Remove'
    }).on('click',()=>{
        chartRemoveButtonClickHandler()
    }));

    //add buttons div to button row
    airportsButtonRow.append(airportsButtons);

    //add everything to the form

    chartFrom.append(airportsTypeLabel, airportsDatesDropdownRow, airportsDatesLabel, airportsTypeDropdownRow, airportsButtonRow);

}

//Constructs a button to control bottombar menu
function createBottomBarButton() {
    $('<button></button>', {
        type:"button",
        class:"btn btn-warning btn-sm ml-1",
        id:"bottom-bar-btn",
        text:'-'
    }).on('click',()=>{
        bottomBarButtonClickHandler()
    }).appendTo('#wrapper')
}

//Creates a legend for WMS layer
function createLegend() {
    let layers = ['55-60', '60-65', '65-70', '70-75', '>75'];
    let colors = ['#0d0887', '#7e03a8', '#cb4778', '#f89541', '#f0f921'];

    $('<span></span>',{text:'Max noise levels, db'}).appendTo('#legend');
    for ( let i = 0; i < layers.length; i++) {
        let layer = layers[i];
        let item = $('<div></div>');
        let key = $('<span></span>',{class:'legend-key'});
        key.css({backgroundColor:colors[i]});
        let value = $('<span></span>');
        value.html(layer);
        key.appendTo(item);
        value.appendTo(item);
        item.appendTo('#legend');
        $('#legend').hide();
    }
}

//Handles bottombar expand and collapse button event
function bottomBarButtonClickHandler(){
        if($('#bottombar').css('height') === '2px'){
            $('#bottombar').css('height','35%');
            $('#wrapper').css('height','62%');
        }else{
            $('#bottombar').css('height','0');
            $('#wrapper').css('height' ,'97%');
        }
}

//Handles events from layers loading buttons. Layer type is based on passed
//parameters from the user interface controls
function layerLoadButtonClickHandler(month,day,layer) {
    //console.log(MAPGL.getStyle().sources);
    if(layer.type === 'map') {
        if (MAPGL.getLayer(layer.id)) {
            MAPGL.removeLayer(layer.id);
            MAPGL.removeSource(layer.id)
        }
        MAPGL.addLayer(ConstructWMSLayer(month,day,layer.id));
        $('#legend').show()
    }else if(layer.type === 'deck'){
        let layers =[];
        if(DECK.props.layers.length>0){
            console.log('layer already exists');
            DECK.setProps({layers:[]});
            Promise.all([ConstructDeckArc(month,day,layer.id), ConstructDeckPoints(month,day,'airports_of_'+layer.id)]).then(function(values) {
                //console.log(values);
                values.forEach(l=>{layers.push(l)});
                DECK.setProps({layers:layers})
            });
            //console.log(layers)
        }else{
            Promise.all([ConstructDeckArc(month,day,layer.id), ConstructDeckPoints(month,day,'airports_of_'+layer.id)]).then(function(values) {
                //console.log(values);
                values.forEach(l=>{layers.push(l)});
                DECK.setProps({layers:layers})
            });
            //console.log(layers)
        }
    }

}

//Handles remove buttons events. Removes layers from mapboxgl or deck.gl canvas
function layerRemoveButtonClickHandler(layer){
    if(layer.type === 'map') {
        if (MAPGL.getLayer(layer.id)) {
            MAPGL.removeLayer(layer.id);
            MAPGL.removeSource(layer.id)
        }
        $('#legend').hide()
    }else if(layer.type === 'deck') {
        let layers =[];
        DECK.setProps({layers:layers})
    }

}

//Handles remove button events in bottombar menu
function chartRemoveButtonClickHandler() {
    ClearGraph()
}

//Handles creating graphs events in bottombar menu
function chartLoadButtonClickHandler(values,type) {
    CreateGraph(values,type);
}

export {CreateInterface}