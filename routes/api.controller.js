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

router.get("/opened", async (req, res) => {
    playSound("ventOpened.mp3");

    robot.keyTap('d', ["command"]); //сворачивание приложений
    robot.keyTap('c', ["alt"]); //выключение звука в discord
    return res.status(200).json("Apps collapsed successfully");
})

router.get("/closed", async (req, res) => {
    playSound("motionTrigger.mp3");
    robot.keyTap('d', ["command"]);
    robot.keyTap('c', ["alt"]);

    return res.status(200).json("Apps expanded successfully");
})

module.exports = router;