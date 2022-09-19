let lat, lon;
let obj = {};
let blockEl = document.querySelector('.block');
let dateObj = new Date();
let cityName = 'Kiev';
let localtime;
let container2 = document.querySelector('.container2');
container2.style.display = 'none';
let blockWrapper = document.createElement('div');
blockWrapper.classList.add('blockWrapper');

//Start Page
getWeatherInformation(1, `http://api.weatherapi.com/v1/forecast.json?key=843e78e3e14342dab0643955221209&q=${cityName}&days=1&aqi=no&alerts=no&lang=uk`);
                       

//Get geolocation(GPS)
window.navigator.geolocation.getCurrentPosition(success, fault);
function success(date){   
    lat = date.coords.latitude;
    lon = date.coords.longitude;    
    
    getWeatherInformation(1, `http://api.weatherapi.com/v1/forecast.json?key=843e78e3e14342dab0643955221209&q=${lat},${lon}&aqi=no&lang=uk`);    
}
function fault(){
    console.log("no position");
}

//Get weather information
async function getWeatherInformation(num, location){

    while(blockWrapper.childElementCount > 0){
        blockWrapper.removeChild(blockWrapper.firstChild);
    }

    let response = await fetch(location);
    if(response.ok){
        let json = await response.json();
        obj = json;
        if(num == 1) viewer();
        else if(num == 2) viewer2();
        else if(num == 3) viewer3days();
        else if(num == 5) viewer5days();
        else if(num == 10) viewer10days();
    }
}

//City names array, Eng to Ukr
let cityNamesArray = {
    'Rivne' : 'Рівне',
    'Kiev' : 'Київ',
    'Luck Ukraine': 'Луцьк',
    'Lviv': 'Львів',
    'Zhytomyr': 'Житомир',
    'Poltava': 'Полтава',
    'Ternopil': 'Тернопіль',
    'Vinnytsya': 'Вінниця',
    'Chernivtsi': 'Чернівці',
    'Odesa': 'Одеса',
    'Kharkiv': 'Харків',
    'Dnipro': 'Дніпро',
    'IvanoFrankivsk': 'Івано-Франківськ',
    'Alexandrovsk': 'Запоріжжя',
    'Kamelnitskiy': 'Хмельницький',
    'Cherkasy': 'Черкаси',
    'Chernihiv': 'Чернігів',
    'Kirovograd': 'Кропивницький',
    'Nikolajew': 'Миколаїв',
    'Sumy': 'Суми',
    'Uzhhorod': 'Ужгород',
    'Kherson': 'Херсон',
    'Donetsk Ukraine': 'Донецьк',
    'Luhansk': 'Луганськ',
    'Ssimferopol': 'Сімферополь',
    'Luck': 'Луцьк',
    'Donetsk': 'Донецьк'
};

//-----Viewer;
function viewer(){
    cityName = obj.location.name;
    console.log('viewer1');
    console.log(obj);
    //Main information
    let timeEl = document.querySelector('.time');
    timeEl.innerHTML = obj.location.localtime;

    let cityEl = document.querySelector('.city');

    if(cityNamesArray.hasOwnProperty(obj.location.name)){
        cityEl.innerHTML = cityNamesArray[obj.location.name];
    }
    else{
        cityEl.innerHTML = obj.location.name;
    }

    let tempEl = document.querySelector('.temp');
    tempEl.innerHTML = `${obj.current.temp_c}°`;

    let tempFeelsEl = document.querySelector('.tempFells');
    tempFeelsEl.innerHTML = `Відчувається як - ${obj.current.feelslike_c}°C`;

    let weatherEl = document.querySelector('.weather');
    weatherEl.innerHTML = obj.current.condition.text; 

    // let containerEl = document.querySelector('.container');
    localtime = parseInt(`${obj.location.localtime[11]}${obj.location.localtime[12]}`);
    // console.log(localtime);

    let bodyEl = document.querySelector('body');
    if(obj.current.condition.text.indexOf('хмарність') !== -1){  
        if(localtime > 21 || localtime < 6){
            bodyEl.style.background = "center / cover no-repeat url('pexels-alex-conchillos-4203094.jpg')";
        }
        else{
            bodyEl.style.background = "center / cover no-repeat url('cloudy.jpg')";
        }
    }
    else if(obj.current.condition.text.indexOf('дощ') !== -1){
        bodyEl.style.background = "center / cover no-repeat url('rain.jpg')";
    }
    else if(obj.current.condition.text.indexOf('Сонячно') !== -1 || obj.current.condition.text.indexOf('сонячно') !== -1){
        bodyEl.style.background = "center / cover no-repeat url('sunny.jpg')";     
    }
    else if(obj.current.condition.text.indexOf('Ясно') !== -1 || obj.current.condition.text.indexOf('ясно') !== -1){
        if(localtime > 21 || localtime < 6){
            bodyEl.style.background = "center / cover no-repeat url('pexels-dids-4996846.jpg')"; 
        }
        else{
            bodyEl.style.background = "center / cover no-repeat url('pexels-marilee-macilroy-1590915.jpg')";     
        }
        
    }

    let windEl = document.querySelector('.wind');
    windEl.innerHTML = `Вітер - ${obj.current.wind_mph}м/с`;

    let cloudsEl = document.querySelector('.clouds');
    cloudsEl.innerHTML = `Хмарність - ${obj.current.cloud}%`;

    //Additional Information
    while(blockEl.childElementCount > 0){
        blockEl.removeChild(blockEl.firstChild);
    }
    
    for(let i = 0; i < 24; i += 2){
        let createdImgEl, createdDivEl, createdPEl, createdTimeEl;
        createdTimeEl = document.createElement('p');
        createdDivEl = document.createElement('div');
        createdImgEl = document.createElement('img');
        createdPEl = document.createElement('p');
        createdTimeEl.classList.add('timeBlock');

        createdTimeEl.innerHTML = `${i}-00`;
        createdImgEl.setAttribute('src', `http:${obj.forecast.forecastday[0].hour[i].condition.icon}`);
        createdImgEl.setAttribute('alt', `${obj.forecast.forecastday[0].hour[i].condition.text}`);
        createdImgEl.setAttribute('title', `${obj.forecast.forecastday[0].hour[i].condition.text}`);
        createdPEl.innerHTML = `${obj.forecast.forecastday[0].hour[i].temp_c}°`;
        createdDivEl.appendChild(createdTimeEl);
        createdDivEl.appendChild(createdImgEl);
        createdDivEl.appendChild(createdPEl);
        blockEl.appendChild(createdDivEl);
    }

    
    if(localtime % 2 == 0){
        blockEl.childNodes[localtime / 2].style.backgroundColor = 'rgba(23, 35, 223, 0.3)';
        
    }
    else{
        //Old color rgba(120, 255, 255, .3)
        blockEl.childNodes[(localtime - 1) / 2].style.backgroundColor = 'rgba(23, 35, 223, 0.3)';
        blockEl.childNodes[Math.floor(localtime / 2) + 1].style.backgroundColor = 'rgba(23, 35, 223, 0.3)';
    }    
}

    let inputTextEl = document.querySelector(".inputText");
    let inputSubmitEl = document.querySelector('.inputSubmit');

    inputSubmitEl.addEventListener('click', function(){

        while(container2.childElementCount > 0){
            container2.removeChild(container2.firstChild);
        }

        inputTextEl.value = inputTextEl.value[0].toUpperCase() + inputTextEl.value.slice(1);

        if(cityNamesArray.hasOwnProperty(inputTextEl.value) === false){ 
           for(el in cityNamesArray){
                if(cityNamesArray[el] === inputTextEl.value){
                    console.log(`${cityNamesArray[el]} and ${inputTextEl.value} = ${inputTextEl.value === cityNamesArray[el]}`);
                    cityName = el;
                    getWeatherInformation(1, `http://api.weatherapi.com/v1/forecast.json?key=843e78e3e14342dab0643955221209&q=${cityName}&aqi=no&alerts=no&lang=uk`);
                    inputTextEl.value = '';
                    break;
                }
                
            }
            if(inputTextEl.value){
                cityName = inputTextEl.value; 
                getWeatherInformation(1, `http://api.weatherapi.com/v1/forecast.json?key=843e78e3e14342dab0643955221209&q=${cityName}&aqi=no&alerts=no&lang=uk`);      
                inputTextEl.value = '';
            }
        }
        else{
            cityName = inputTextEl.value;       
            getWeatherInformation(1, `http://api.weatherapi.com/v1/forecast.json?key=843e78e3e14342dab0643955221209&q=${cityName}&aqi=no&alerts=no&lang=uk`);
            inputTextEl.value = '';
        }    
        container2.style.display = 'none';
        // cityName = inputTextEl.value;
    });
   
    
// -----viewer2    
    let btnTomorrow = document.querySelector('.tomorrow');
    btnTomorrow.addEventListener('click', function(){
        if(container2.childElementCount > 0){
            while(container2.childElementCount > 0){
                 container2.removeChild(container2.firstChild);
             }
             container2.style.display = 'none';
         }
         else{
            getWeatherInformation(2, `http://api.weatherapi.com/v1/forecast.json?key=843e78e3e14342dab0643955221209&q=${cityName}&days=3&aqi=no&alerts=no&lang=uk`);
         }
    });

    function viewer2(){
        console.log('viewer2');
        console.log(obj);

        createdH3El = document.createElement('h3');
        createdH3El.innerHTML = `Прогноз погоди<br>на завтра<br> ${obj.forecast.forecastday[1].date}<br> в місті <span>${cityNamesArray[obj.location.name]}</span>`;
        container2.appendChild(createdH3El);
        
        for(let i = 0; i < 24; i += 2){
            let createdImgEl, createdDivEl, createdPEl, createdTimeEl;
            createdTimeEl = document.createElement('p');
            createdDivEl = document.createElement('div');
            createdImgEl = document.createElement('img');
            createdPEl = document.createElement('p');
            createdTimeEl.classList.add('timeBlock');
    

            createdTimeEl.innerHTML = `${i}-00`;
            createdImgEl.setAttribute('src', `http:${obj.forecast.forecastday[1].hour[i].condition.icon}`);
            createdImgEl.setAttribute('alt', `${obj.forecast.forecastday[1].hour[i].condition.text}`);
            createdImgEl.setAttribute('title', `${obj.forecast.forecastday[1].hour[i].condition.text}`);
            createdPEl.innerHTML = `${obj.forecast.forecastday[1].hour[i].temp_c}°`;
            createdDivEl.appendChild(createdTimeEl);
            createdDivEl.appendChild(createdImgEl);
            createdDivEl.appendChild(createdPEl);
            blockWrapper.appendChild(createdDivEl);
        }
        container2.appendChild(blockWrapper);
        container2.style.display = 'flex';
    }


//-----viewer3days 
    let btn3days = document.querySelector('.days3');
    btn3days.addEventListener('click', function(){
        if(container2.childElementCount > 0){
            while(container2.childElementCount > 0){
                 container2.removeChild(container2.firstChild);
             }
             container2.style.display = 'none';
         }
         else{
            getWeatherInformation(3, `http://api.weatherapi.com/v1/forecast.json?key=843e78e3e14342dab0643955221209&q=${cityName}&days=4&aqi=no&alerts=no&lang=uk`);
         }
    });

    function viewer3days(){
        console.log('viewer3days');
        console.log(obj);


        createdH3El = document.createElement('h3');
        createdH3El.innerHTML = `Прогноз погоди<br> в місті <span>${cityNamesArray[obj.location.name]}</span><br>на 3 дні`;
        createdH3El.style.marginTop = '15px';
        container2.appendChild(createdH3El);


        for(let i = 1; i <= 3; i++){
            let createdImgEl, createdDivEl, createdPEl, createdTimeEl;
            createdTimeEl = document.createElement('p');
            createdDivEl = document.createElement('div');
            createdDivEl.classList.add('block3days');
            createdImgEl = document.createElement('img');
            createdPEl = document.createElement('p');
            createdP2El = document.createElement('p');
            createdTimeEl.classList.add('timeBlock');
    

            createdTimeEl.innerHTML = `${obj.forecast.forecastday[i].date}`;
            createdImgEl.setAttribute('src', `http:${obj.forecast.forecastday[i].day.condition.icon}`);
            createdImgEl.setAttribute('alt', `${obj.forecast.forecastday[i].day.condition.text}`);
            createdImgEl.setAttribute('title', `${obj.forecast.forecastday[i].day.condition.text}`);
            createdPEl.innerHTML = `${obj.forecast.forecastday[i].day.maxtemp_c}° / ${obj.forecast.forecastday[i].day.mintemp_c}°`;
            createdDivEl.appendChild(createdTimeEl);
            createdDivEl.appendChild(createdImgEl);
            createdDivEl.appendChild(createdPEl);
            createdP2El.innerHTML = `${obj.forecast.forecastday[i].day.condition.text}`;
            createdP2El.style.fontSize = '20px';
            createdDivEl.appendChild(createdP2El);
            blockWrapper.appendChild(createdDivEl);
        }
        container2.appendChild(blockWrapper);
        container2.style.display = 'flex';
    }


//-----viewer5days 
let btn5days = document.querySelector('.days5');
btn5days.addEventListener('click', function(){
    if(container2.childElementCount > 0){
        while(container2.childElementCount > 0){
             container2.removeChild(container2.firstChild);
         }
         container2.style.display = 'none';
     }
     else{
        getWeatherInformation(5, `http://api.weatherapi.com/v1/forecast.json?key=843e78e3e14342dab0643955221209&q=${cityName}&days=6&aqi=no&alerts=no&lang=uk`);
     }
});

function viewer5days(){
    console.log('viewer5days');
    console.log(obj);


    createdH3El = document.createElement('h3');
    createdH3El.innerHTML = `Прогноз погоди<br> в місті <span>${cityNamesArray[obj.location.name]}</span><br>на 5 дні`;
    createdH3El.style.marginTop = '15px';
    container2.appendChild(createdH3El);


    for(let i = 1; i <= 5; i++){
        let createdImgEl, createdDivEl, createdPEl, createdTimeEl;
        createdTimeEl = document.createElement('p');
        createdDivEl = document.createElement('div');
        createdDivEl.classList.add('block5days');
        createdImgEl = document.createElement('img');
        createdPEl = document.createElement('p');
        createdP2El = document.createElement('p');
        createdTimeEl.classList.add('timeBlock');


        createdTimeEl.innerHTML = `${obj.forecast.forecastday[i].date}`;
        createdImgEl.setAttribute('src', `http:${obj.forecast.forecastday[i].day.condition.icon}`);
        createdImgEl.setAttribute('alt', `${obj.forecast.forecastday[i].day.condition.text}`);
        createdImgEl.setAttribute('title', `${obj.forecast.forecastday[i].day.condition.text}`);
        createdPEl.innerHTML = `${obj.forecast.forecastday[i].day.maxtemp_c}° / ${obj.forecast.forecastday[i].day.mintemp_c}°`;
        createdDivEl.appendChild(createdTimeEl);
        createdDivEl.appendChild(createdImgEl);
        createdDivEl.appendChild(createdPEl);
        createdP2El.innerHTML = `${obj.forecast.forecastday[i].day.condition.text}`;
        createdP2El.style.fontSize = '20px';
        createdDivEl.appendChild(createdP2El);
        blockWrapper.appendChild(createdDivEl);
    }
    container2.appendChild(blockWrapper);
    container2.style.display = 'flex';
}

// -----days10
//-----viewer5days 
let btn10days = document.querySelector('.days10');
btn10days.addEventListener('click', function(){
    if(container2.childElementCount > 0){
        while(container2.childElementCount > 0){
             container2.removeChild(container2.firstChild);
         }
         container2.style.display = 'none';
     }
     else{
        getWeatherInformation(10, `http://api.weatherapi.com/v1/forecast.json?key=843e78e3e14342dab0643955221209&q=${cityName}&days=11&aqi=no&alerts=no&lang=uk`);
     }
});

function viewer10days(){
    console.log('viewer5days');
    console.log(obj);


    createdH3El = document.createElement('h3');
    createdH3El.innerHTML = `Прогноз погоди<br> в місті <span>${cityNamesArray[obj.location.name]}</span><br>на 10 днів`;
    createdH3El.style.marginTop = '15px';
    container2.appendChild(createdH3El);

    

    for(let i = 1; i <= 10; i++){
        let createdImgEl, createdDivEl, createdPEl, createdTimeEl;
        

        createdTimeEl = document.createElement('p');
        createdDivEl = document.createElement('div');
        createdDivEl.classList.add('block10days');
        createdImgEl = document.createElement('img');
        createdPEl = document.createElement('p');
        createdP2El = document.createElement('p');
        createdTimeEl.classList.add('timeBlock');


        createdTimeEl.innerHTML = `${obj.forecast.forecastday[i].date}`;
        createdImgEl.setAttribute('src', `http:${obj.forecast.forecastday[i].day.condition.icon}`);
        createdImgEl.setAttribute('alt', `${obj.forecast.forecastday[i].day.condition.text}`);
        createdImgEl.setAttribute('title', `${obj.forecast.forecastday[i].day.condition.text}`);
        createdPEl.innerHTML = `${obj.forecast.forecastday[i].day.maxtemp_c}° / ${obj.forecast.forecastday[i].day.mintemp_c}°`;
        createdPEl.style.fontSize = '0.7em';
        createdDivEl.appendChild(createdTimeEl);
        createdDivEl.appendChild(createdImgEl);
        createdDivEl.appendChild(createdPEl);
        createdP2El.innerHTML = `${obj.forecast.forecastday[i].day.condition.text}`;
        createdP2El.style.fontSize = '0.7em';
        createdDivEl.appendChild(createdP2El);
        blockWrapper.appendChild(createdDivEl);
    }
    container2.appendChild(blockWrapper);
    container2.style.display = 'flex';
}
