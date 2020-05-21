const list = document.querySelector(".list");
let coordsObj = {};
let radius = 1000;


// function setRadius(){
    
// }

function paintMaskInfo(maskInfo){

    let brush;
    let paint;
    
    for(let i =0;i<maskInfo.count ; i++){
        paint = `주소 : ${maskInfo.addr[i]} 상태 : ${maskInfo.states[i]}`;
        brush = document.createElement('li');
        brush.className = "item";
        brush.innerHTML = paint;
        list.appendChild(brush);
    }
}

function manufactureData(jsonData){
    let bowl = [];
    let data = {
        count : jsonData.count,
        addr : jsonData.stores.map(x => x.addr),
        states : jsonData.stores.map(x => {
            switch(x.remain_stat){
                case "plenty" : bowl.push("100개 이상 있음");
                break;
                case "some" :  bowl.push("30 ~ 100개 있음");
                break;
                case "few" :  bowl.push("2 ~ 30개 있음");
                break;
                case "empty" :  bowl.push("1개 이하");
                break;
                case "break" :  bowl.push("판매중지");
                break;
            }
        })
    }
    data.states=bowl;

    paintMaskInfo(data);
}

function getMaskJson(coordsObj){
    fetch(
        `https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json?lat=${coordsObj.latitude}&lng=${coordsObj.longitude}&m=${radius}
    `).then(function(response){
        return response.json();
    }).then(function(json){
        manufactureData(json);
    });
}

function handleGeoSuccess(position) {
    coordsObj =  {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    }
    getMaskJson(coordsObj);
}

function handleGeoError(){
    console.log("Can't locate your position.");
}

function coordsLoad() {
    navigator.geolocation.getCurrentPosition(handleGeoSuccess,handleGeoError);
}

function init() {
    coordsLoad();
}

init();