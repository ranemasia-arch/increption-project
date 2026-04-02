const express = require("express");
const cors = require("cors");
const { execFile } = require("child_process");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ serve frontend files
app.use(express.static(path.join(__dirname, "../front end")));

// ✅ homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../front end/wep.html"));
});

// 🔐 API
app.post("/cipher", (req, res) => {
    const { text, otp, mode } = req.body;

    if (!text || !otp || !mode) {
        return res.status(400).json({ error: "Missing fields" });
    }

    const safeText = encodeURIComponent(text);
    const safeOtp = encodeURIComponent(otp);

    execFile("./cipher.exe", [mode, safeText, safeOtp], (err, stdout) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "C++ error" });
        }

        res.json({
            result: stdout.trim()
        });
    });
});

// ✅ Render port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});