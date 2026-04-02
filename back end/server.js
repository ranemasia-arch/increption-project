const express = require("express");
const cors = require("cors");
const { execFile } = require("child_process");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// 👇 مهم: تشغيل الفرونت إند من نفس السيرفر
app.use(express.static(path.join(__dirname, "frontend")));

// 🔐 Cipher endpoint
app.post("/cipher", (req, res) => {
    const { text, otp, mode } = req.body;

    if (!text || !otp || !mode) {
        return res.status(400).send("Missing fields");
    }

    // 👇 تشغيل ملف C++
    const exePath = path.join(__dirname, "cipher.exe");

    execFile(exePath, [text, otp, mode], (error, stdout, stderr) => {
        if (error) {
            console.error("C++ Error:", error);
            return res.status(500).send("Server Error");
        }

        if (stderr) {
            console.error("stderr:", stderr);
        }

        res.send(stdout.trim());
    });
});

// 👇 تشغيل السيرفر
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});