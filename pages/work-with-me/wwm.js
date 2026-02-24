emailjs.init("UqVx5SW3p5huL43gG");

document.getElementById("submit").addEventListener("click", function() {
    const name = document.getElementById("inp1").value.trim();
    const email = document.getElementById("inp2").value.trim();
    const message = document.getElementById("inp3").value.trim();

    if (!name || !email || !message) {
        alert("Please fill in all fields.");
        return;
    }

    const params = {
        "from-name": name,
        time: new Date().toLocaleString(),
        "from-email": email,
        message: message
    };

    emailjs.send("service_aaap8p2", "template_wmxvww7", params)
        .then(() => {
            document.getElementById("submit").value = "Sent!";
            document.getElementById("inp1").value = "";
            document.getElementById("inp2").value = "";
            document.getElementById("inp3").value = "";
        })
        .catch(() => {
            alert("Something went wrong, please try again.");
        });
});