const express = require("express");
const cors = require("cors");
const { execFile } = require("child_process");

const app = express();

app.use(cors());
app.use(express.json());

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

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});