const Router = require("express");
const router = new Router();
const robot = require('robotjs');
const { exec } = require("child_process");
const path = require("path");

function playSound(file) {
    const pathToFile = path.resolve("./sounds/" + file); //получаем абсолютный путь до mp3

    const mplayerPath = path.resolve(
        "./routes/mplayer/mplayer.exe"
    ); //получаем абсолютный путь к mplayer

    exec(mplayerPath + " " + pathToFile); //проигрывание звука
    return true;
}

async function answer(res, req, text) {
    if (req.query.play === "true") {
        if (text === "opened") { playSound("ventOpened.mp3"); }
        if (text === "closed") { playSound("motionTrigger.mp3"); }
    }

    if (req.query.expand === "true") {
        robot.keyTap('d', ["command"]); //сворачивание приложений
    }

    if (req.query.key) {
        robot.keyTap(req.query.key, [req.query.opt]); //проигрываем бинд с приложения
    }

    return res.status(200).json(text);
}

router.get("/opened/:sound", (req, res)=> answer(res, req, "opened"));

router.get("/closed/:sound", (req, res)=>answer(res, req, "closed"));

router.get("/stop", async (req, res) => {
    exec("forever stop 0", (err) => {
        if (err) {
            return res.status(404).json(err);
        }
    });
    return res.status(200).json("Server stopped");
})

router.get("/test", async (req, res) => {
    return res.status(200).json("Server works!");
})

module.exports = router;