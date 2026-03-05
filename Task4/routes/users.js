const express = require("express");
const router = express.Router();

router.get("/Rayyan", (req, res) => {
    console.log("GET request received at /users");
    res.send("Welcome to the Users route!");
});

module.exports = router;