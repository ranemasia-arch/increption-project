const API_URL = "https://YOUR-RENDER-APP.onrender.com/cipher";

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
            body: JSON.stringify({
                text,
                otp,
                mode
            })
        });

        const data = await res.json();

        output.textContent = data.result || data.error;

    } catch (err) {
        console.error(err);
        output.textContent = "Failed to fetch ❌";
    }
}