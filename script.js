let senderName, receiverName, amountValue;
let html5QrCode;

function showPage(id) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

function login() {
    senderName = document.getElementById("username").value;
    if(senderName) showPage("homePage");
}

function startScanner() {

    html5QrCode = new Html5Qrcode("reader");

    Html5Qrcode.getCameras().then(devices => {
        if (devices.length) {
            html5QrCode.start(
                devices[0].id,
                { fps: 10, qrbox: 250 },
                qrCodeMessage => {

                    document.getElementById("receiver").value = qrCodeMessage;

                    html5QrCode.stop();
                    document.getElementById("reader").innerHTML = "";

                    alert("QR Scanned Successfully!");
                }
            );
        }
    }).catch(err => {
        alert("Camera Permission Denied");
    });
}

function goToPin() {
    receiverName = document.getElementById("receiver").value;
    amountValue = document.getElementById("amount").value;
    if(receiverName && amountValue) showPage("pinPage");
}

function verifyPin() {
    let pin = document.getElementById("pin").value.trim();

    if(pin === "1234") {
        showPage("loadingPage");
        setTimeout(() => completePayment(), 2000);
    } else {
        alert("Invalid PIN");
        document.getElementById("pin").value = "";
    }
}

function completePayment() {

    if(navigator.vibrate) navigator.vibrate(200);

    let txnId = Math.floor(100000000000 + Math.random() * 900000000000);
    let time = new Date().toLocaleString("en-IN");

    document.getElementById("rAmount").innerText = amountValue;
    document.getElementById("rReceiver").innerText = receiverName;
    document.getElementById("rTxn").innerText = txnId;
    document.getElementById("rTime").innerText = time;

    showPage("receiptPage");

    setTimeout(() => {
        document.getElementById("recvAmount").innerText = amountValue;
        document.getElementById("recvSender").innerText = senderName;
        document.getElementById("recvTime").innerText = time;
        showPage("receiverPage");
    }, 4000);
}

function shareReceipt() {
    alert("Receipt Shared Successfully");
}

function resetApp() {
    location.reload();
}