import './styles/style.css'
import {CreateInterface} from "./interface";

//Configuration for the layers and charts menus selectors
const interface_skeleton = {
    dropdowns: {
        layer_menu: [
                {type:'months',dropdownValues:{1:'Jan',2:'Feb',3:'Mar',4:'Apr',5:'May',6:'Jun',7:'Jul',8:'Aug',9:'Sep',10:'Oct',11:'Nov',12:'Dec'}},
                {type:'days', dropdownValues:{0:'Sun',1:'Mon',2:'Tue',3:'Wed',4:'Thu',5:'Fri',6:'Sat'}}
        ],
        chart_menu: {
            flights: [{type:'grouping',dropdownValues:{1:'Months',2:'Days',3:'DayAndMonth'}}],
            airports: [{type:'or_dest',dropdownValues:{1:'Arrivals',2:'Departures'}},
                {type:'months',dropdownValues:{1:'Jan',2:'Feb',3:'Mar',4:'Apr',5:'May',6:'Jun',7:'Jul',8:'Aug',9:'Sep',10:'Oct',11:'Nov',12:'Dec'}},
                {type:'days', dropdownValues:{0:'Sun',1:'Mon',2:'Tue',3:'Wed',4:'Thu',5:'Fri',6:'Sat'}}
                ]}
    }
};



function on_load() {
    //Create map and all interface
    CreateInterface(interface_skeleton)
}
document.addEventListener("DOMContentLoaded", on_load);