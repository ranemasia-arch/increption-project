let lastCipher = "";

async function run() {
    const text = document.getElementById("text").value;
    const otp = document.getElementById("otp").value;
    const mode = document.getElementById("mode").value;
    const output = document.getElementById("output");

    if (!text || !otp) {
        output.textContent = "❌ Please enter text and OTP";
        return;
    }

    try {
        const res = await fetch("/cipher", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text, otp, mode })
        });

        const data = await res.json();

        if (!res.ok) {
            output.textContent = "❌ Server Error";
            return;
        }

        lastCipher = data.result;

        output.textContent =
            "✅ RESULT:\n\n" + data.result;

    } catch (err) {
        output.textContent = "❌ Failed to fetch";
        console.error(err);
    }
}


// 🔥 زر استخدام آخر نتيجة
function useLastCipher() {
    const output = document.getElementById("output");

    if (!lastCipher) {
        output.textContent = "❌ No previous cipher found";
        return;
    }

    document.getElementById("text").value = lastCipher;

    output.textContent =
        "🔁 Loaded last cipher:\n\n" + lastCipher;
}