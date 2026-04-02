const express = require("express");
const cors = require("cors");
const { execFile } = require("child_process");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

/* ✅ تحديد مسار الفرونت إند */
const frontendPath = path.join(__dirname, "..", "front end");

/* ✅ يخدم ملفات الفرونت */
app.use(express.static(frontendPath));

/* ✅ الصفحة الرئيسية */
app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "wep.html"));
});

/* ✅ API التشفير */
app.post("/cipher", (req, res) => {
    const { text, otp, mode } = req.body;

    if (!text || !mode || typeof otp !== "string") {
        return res.status(400).json({ error: "Missing fields" });
    }

    const safeText = encodeURIComponent(text);
    const safeOtp = encodeURIComponent(otp);

    const exePath = path.join(__dirname, "cipher.exe");

    execFile(exePath, [mode, safeText, safeOtp], (err, stdout, stderr) => {
        if (err) {
            return res.status(500).json({ error: "C++ execution error" });
        }

        res.json({
            result: stdout.trim()
        });
    });
});

/* ✅ تشغيل السيرفر */
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});