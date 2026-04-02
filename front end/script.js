function run() {
    const text = document.getElementById("text").value;
    const otp = document.getElementById("otp").value;
    const mode = document.getElementById("mode").value;
    const output = document.getElementById("output");

    if (!text || !otp) {
        output.textContent = "Please enter text and OTP ❌";
        return;
    }

    output.textContent =
        "✅ TEST MODE WORKING\n\n" +
        "Text: " + text + "\n" +
        "OTP: " + otp + "\n" +
        "Mode: " + mode;
}