try {
    require('express');
    runStart();
} catch(err) {
    firstStart();
}

async function firstStart() {
    const fs = require("fs");
    const path = require("path");
    const { exec } = require("child_process");

    console.log("Вы запустили сервер в первый раз. Подождите немного, пока он настроится.");
    exec("npm i", (err, stdout, stderr) => {
        if (err) {
            console.log(err);
        }
        if (stdout) {
            console.log(stdout);
        }
        if (stderr) {
            console.log(stderr);
        }
        fs.writeFile("server.bat", `::door detect node.js app by @Jeimip
cd ${path.resolve()}
forever start --uid nodeServer --append .\\index.js`,
            err => {
                if (err) {
                    return console.log(err)
                }
            }
        );
        exec("npm install forever -g", (err, stdout, stderr) => {
            if (err) {
                console.log(err);
            }
            if (stdout) {
                console.log(stdout);
            }
            if (stderr) {
                console.log(stderr);
            }
            console.log("Сервер настроен!");
            process.exit(22);
        });
    })
}

async function runStart() {
    const express = require('express');
    const { networkInterfaces } = require('os');
    const fs = require("fs");

    const ApiController = require('./routes/api.controller');

    const app = express();

    app.use(express.json());

    app.use("/api", ApiController);

    fs.readFile("server.bat", async (err) => {
        if (err) {
            await firstStart();
        }
    });

    const nets = await networkInterfaces();

    let bindIp;

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.address.includes("192.168")) { //получаем локальный IP устройства
                bindIp = net.address;
            }
        }
    }

    fs.writeFile("data.txt", `Ссылка для ввода в приложение: ${bindIp}`, async (err) => {
        if (err) {
            await firstStart();
        }
    });

    app.listen(80, bindIp, () => {console.log(`Server started on ${bindIp}:80`)}); //запускаем сервер
}
