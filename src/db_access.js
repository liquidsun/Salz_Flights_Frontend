import axios from "axios";
//Communicate with Express backend to get the data for graphs
//based on user choices from the bottom bar's user interface.
//Passed parameters determine which request will be send to the server
function GetDataFromDB(values,type){
    if (type == 'flights') {
        //console.log('here')
        if (values[0] == 1) {
            return axios.get('https://zgissvr238.geo.sbg.ac.at/ipsdi_wt19_planes/get/flights/bymonth', {headers: {"Content-Type": "application/json"}})
                .then(response => {
                    return response.data
                })
                .catch(err => console.log(err))
        }else if (values[0] == 2){
            return axios.get('https://zgissvr238.geo.sbg.ac.at/ipsdi_wt19_planes/get/flights/byday', {headers: {"Content-Type": "application/json"}})
                .then(response => {return response.data})
                .catch(err => console.log(err))
        }else if(values[0]==3){
            return axios.get('https://zgissvr238.geo.sbg.ac.at/ipsdi_wt19_planes/get/flights/bydaymonth', {headers: {"Content-Type": "application/json"}})
                .then(response => {return response.data})
                .catch(err => console.log(err))
        }

    }else if(type ==='airports'){
        //console.log(values,type)
        if(values[2]==='1'){
            if(values[0]==='Choose...'&&values[1]==='Choose...'){
                return axios.get('https://zgissvr238.geo.sbg.ac.at/ipsdi_wt19_planes/get/origins/all', {headers: {"Content-Type": "application/json"}})
                    .then(response => {
                        console.log(response.data);
                        return response.data
                    })
                    .catch(err => console.log(err))
            }
            else if(values[0]!='Choose...'&&values[1]==='Choose...'){
                return axios.get('https://zgissvr238.geo.sbg.ac.at/ipsdi_wt19_planes/get/origins/bymonth?'+'month='+values[0], {headers: {"Content-Type": "application/json"}})
                    .then(response => {
                        return response.data
                    })
                    .catch(err => console.log(err))
            }else if(values[0]==='Choose...'&&values[1]!='Choose...'){
                return axios.get('https://zgissvr238.geo.sbg.ac.at/ipsdi_wt19_planes/get/origins/byday?'+'day='+values[1], {headers: {"Content-Type": "application/json"}})
                    .then(response => {
                        return response.data
                    })
                    .catch(err => console.log(err))
            }else if(values[0]!='Choose...'&&values[1]!='Choose...'){
                return axios.get('https://zgissvr238.geo.sbg.ac.at/ipsdi_wt19_planes/get/origins/bydaymonth?'+'day='+values[1]+'&month='+values[0], {headers: {"Content-Type": "application/json"}})
                    .then(response => {
                        return response.data
                    })
                    .catch(err => console.log(err))
            }

        }else if(values[2]==='2'){
            if(values[0]==='Choose...'&&values[1]==='Choose...'){
                return axios.get('https://zgissvr238.geo.sbg.ac.at/ipsdi_wt19_planes/get/destinations/all', {headers: {"Content-Type": "application/json"}})
                    .then(response => {
                        console.log(response.data);
                        return response.data
                    })
                    .catch(err => console.log(err))
            }
            else if(values[0]!='Choose...'&&values[1]==='Choose...'){
                return axios.get('https://zgissvr238.geo.sbg.ac.at/ipsdi_wt19_planes/get/destinations/bymonth?'+'month='+values[0], {headers: {"Content-Type": "application/json"}})
                    .then(response => {
                        return response.data
                    })
                    .catch(err => console.log(err))
            }else if(values[0]==='Choose...'&&values[1]!='Choose...'){

                return axios.get('https://zgissvr238.geo.sbg.ac.at/ipsdi_wt19_planes/get/destinations/byday?'+'day='+values[1], {headers: {"Content-Type": "application/json"}})
                    .then(response => {
                        console.log(response.data)
                        return response.data
                    })
                    .catch(err => console.log(err))
            }else if(values[0]!='Choose...'&&values[1]!='Choose...'){
                return axios.get('https://zgissvr238.geo.sbg.ac.at/ipsdi_wt19_planes/get/destinations/bydaymonth?'+'day='+values[1]+'&month='+values[0], {headers: {"Content-Type": "application/json"}})
                    .then(response => {
                        return response.data
                    })
                    .catch(err => console.log(err))
            }
        }
    }
}
export {GetDataFromDB}