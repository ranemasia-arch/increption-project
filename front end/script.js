let lastCipher = "";

async function run(retry = true) {
    const text = document.getElementById("text").value;
    const otp = document.getElementById("otp").value.trim();
    const mode = document.getElementById("mode").value;
    const output = document.getElementById("output");

    if (!text) return alert("Enter text!");
    if (!otp) return alert("Enter OTP!");

    output.innerText = "Processing...";

    try {
        const res = await fetch("http://localhost:3000/cipher", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, otp, mode })
        });

        const data = await res.json();
        output.innerText = data.result;

        if (mode === "encrypt") {
            lastCipher = data.result;
        }

    } catch (err) {
        console.error(err);

        if (retry) {
            output.innerText = "Retrying...";
            await new Promise(r => setTimeout(r, 500));
            run(false);
        } else {
            output.innerText = "Error: " + err.message;
        }
    }
}

function useLastCipher() {
    if (!lastCipher) return alert("No cipher!");

    document.getElementById("text").value = lastCipher;
    document.getElementById("mode").value = "decrypt";
}