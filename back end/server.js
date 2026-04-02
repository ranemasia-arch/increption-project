const express = require("express");
const cors = require("cors");
const { execFile } = require("child_process");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());


// ✅ مهم: تشغيل ملفات الفرونت (CSS/JS)
app.use(express.static(path.join(__dirname, "../front end")));


// ✅ فتح الصفحة الرئيسية
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../front end/wep.html"));
});


// 🔐 API تبع التشفير (كما هو عندك)
app.post("/cipher", (req, res) => {
    const { text, otp, mode } = req.body;

    console.log("Request:", req.body);

    if (!text || !mode || typeof otp !== "string") {
        return res.status(400).send("Missing required fields");
    }

    const safeText = encodeURIComponent(text);
    const safeOtp = encodeURIComponent(otp);

    execFile("./cipher.exe", [mode, safeText, safeOtp], (err, stdout) => {
        if (err) {
            console.error("Execution error:", err);
            return res.status(500).send("C++ error");
        }

        res.json({
            result: stdout.trim()
        });
    });
});


// 🔥 مهم لـ Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});