const express = require("express");
const cors = require("cors");
const { execFile } = require("child_process");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

const frontendPath = path.join(__dirname, "../front end");

// تشغيل الفرونت
app.use(express.static(frontendPath));

// الصفحة الرئيسية
app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "wep.html"));
});

// API
app.post("/cipher", (req, res) => {
    const { text, otp, mode } = req.body;

    if (!text || !otp || !mode) {
        return res.status(400).json({ error: "Missing fields" });
    }

    const safeText = encodeURIComponent(text);
    const safeOtp = encodeURIComponent(otp);

    execFile("./cipher.exe", [mode, safeText, safeOtp], (err, stdout) => {
        if (err) {
            return res.status(500).json({ error: "C++ error" });
        }

        res.json({ result: stdout.trim() });
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});