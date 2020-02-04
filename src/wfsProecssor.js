import axios from "axios";

//Process WFS request
function GetWFS(url){
    return axios.get(url)
        .catch(err => console.log(err));
}

export {GetWFS}