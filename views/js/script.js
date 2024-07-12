const socket = io();

let userId = '';

socket.on('user-id', (id) => {
    userId = id;
    console.log(`Received user ID: ${userId}`);
});

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        const {latitude, longitude} = position.coords;
        socket.emit("send-location", {latitude, longitude});
    }, (error) => {
        console.log(error);
    },
{
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
}
);
}

const map = L.map("map").setView([0, 0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "vedant"
}).addTo(map)


const markers = {};

// const redMarker = L.AwesomeMarkers.icon({
//     icon: 'coffee',
//     markerColor: 'red'
//   });
// const usericon = new L.Icon({
//     iconUrl: '/views/image1.jpg',
//     iconSize: [25, 41],
//     iconAnchor: [12, 41],
//     popupAnchor: [1, -34],
//     shadowSize: [41, 41]
// })

socket.on("receive-location", (data) => {
    const {id, latitude, longitude} = data;
    map.setView([latitude, longitude]);
    if(markers[id]){
        markers[id].setLatLng([latitude, longitude]);
    }
    else{
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});


socket.on("user-disconnected", (id) =>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id]
    }
});