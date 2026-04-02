const API_URL = "https://increption-project.onrender.com/cipher";

async function run() {
    const text = document.getElementById("text").value;
    const otp = document.getElementById("otp").value;
    const mode = document.getElementById("mode").value;
    const output = document.getElementById("output");

    if (!text || !otp) {
        alert("Please fill all fields");
        return;
    }

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text, otp, mode })
        });

        const data = await res.json();

        if (data.result) {
            output.textContent = data.result;
        } else {
            output.textContent = data.error || "Error";
        }

    } catch (err) {
        console.error(err);
        output.textContent = "Failed to fetch ❌ (check server)";
    }
}