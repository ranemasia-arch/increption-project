let lastCipher = "";

async function run(retry = true) {
    const text = document.getElementById("text").value;
    const otp = document.getElementById("otp").value;
    const mode = document.getElementById("mode").value;
    const output = document.getElementById("output");

    if (!text) return alert("Please enter text!");
    if (!otp) return alert("Please enter OTP!");

    output.innerText = "Processing...";

    try {
        const res = await fetch("http://localhost:3000/cipher", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text, otp, mode })
        });

        if (!res.ok) {
            throw new Error(`Server responded with status ${res.status}`);
        }

        const data = await res.text();

        output.innerText = data;

        if (mode === "encrypt") {
            lastCipher = data.trim();
        }

    } catch (err) {
        console.error("Fetch error:", err);

        if (retry) {
            output.innerText = "Retrying request...";
            await new Promise(r => setTimeout(r, 500));
            run(false);
        } else {
            output.innerText = `Error: ${err.message}`;
        }
    }
}

function useLastCipher() {
    if (!lastCipher) return alert("No cipher yet!");

    document.getElementById("text").value = lastCipher;
    document.getElementById("mode").value = "decrypt";
}