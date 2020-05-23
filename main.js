loader = document.querySelector(".loader-container");
const list = document.querySelector(".list");
let coordsObj = {};
let radius = 3000;
let count_for_erase = 0;

function setRadius(){
    let val = prompt("1 ~ 5를 입력하세요!");
    if( val === null){
        return;
    }else if( val > 5 || val < 1){
        alert("잘못된 값을 입력하셨습니다. 1~5사이의 값을 넣어주세요.");
    }else{
        radius = val*1000;        
        realizeLoader();
        eraseItem();
        init();
    }   
}

function removeLoader(){
    loader.style="display:none;";
}

function realizeLoader(){
    loader.style="display:flex;";
}

function eraseItem(){
    for(let i=0; i<count_for_erase;i++){
        let item = document.getElementById("item"+i);
        list.removeChild(item);
    }
}

function paintItem(maskInfo){

    let brush;
    let paint;
    
    for(let i =0;i<maskInfo.count ; i++){
        paint = `<span>이름</span> : ${maskInfo.name[i]} <span>상태</span> : ${maskInfo.states[i]}<br><span>주소</span> : ${maskInfo.addr[i]}`;
        brush = document.createElement('li');
        brush.className = "item";
        brush.id= "item"+i;
        brush.innerHTML = paint;
        list.appendChild(brush);
    }

    removeLoader();
}

function manufactureData(jsonData){
    count_for_erase = jsonData.count;
    let bowl = [];
    let data = {
        count : jsonData.count,
        addr : jsonData.stores.map(x => x.addr),
        name : jsonData.stores.map(x => x.name),
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
                default: bowl.push("폐쇄로 추정")
            }
        })
    }
    data.states=bowl;
    paintItem(data);
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