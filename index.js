const http = require("http");
const fs = require('fs');
const path = require('path');
const requests = require('requests');

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempVal%}", orgVal.main.temp);
    temperature = temperature.replace("{%maxtempVal%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%mintempVal%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    return temperature;
};

const server = http.createServer((req, res) => {
    if (req.url === "/") {
        requests('https://api.openweathermap.org/data/2.5/weather?q=delhi&appid=b8e44565f1a49f1fcd51ada283b76175')
            .on('data', (chunk) => {
                const weatherData = JSON.parse(chunk);
                const arrayData = [weatherData];
                const realTimeData = arrayData
                    .map((val) => replaceVal(homeFile, val))
                    .join("");    
                res.write(realTimeData);
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end();
            });
    } else if(req.url.match("\.css$")){
        const cssFile = fs.readFileSync("style.css", "utf-8");     
        res.write(cssFile);
        res.end();
    }
});

server.listen(3000, () => {
    console.log("listening on port 3000");
});
