const express = require("express");
const cors = require("cors");
const { execFile } = require("child_process");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   🔥 FRONTEND STATIC FILES
========================= */
const frontendPath = path.join(__dirname, "../front end");

app.use(express.static(frontendPath));

/* =========================
   🏠 HOME PAGE
========================= */
app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "wep.html"));
});

/* =========================
   🔐 CIPHER API
========================= */
app.post("/cipher", (req, res) => {
    const { text, otp, mode } = req.body;

    console.log("Request:", req.body);

    if (!text || !otp || !mode) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const safeText = encodeURIComponent(text);
    const safeOtp = encodeURIComponent(otp);

    execFile("./cipher.exe", [mode, safeText, safeOtp], (err, stdout) => {
        if (err) {
            console.error("Execution error:", err);
            return res.status(500).json({ error: "C++ error" });
        }

        return res.json({
            result: stdout.trim()
        });
    });
});

/* =========================
   🚀 START SERVER (Render Ready)
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});