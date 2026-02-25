let balance = 50000;
let currentUser = "";
let tempReceiver = "";
let tempAmount = 0;
let html5QrCode;

function login(){
    let name = document.getElementById("username").value;
    if(name === "") return alert("Enter your name");
    currentUser = name;
    document.getElementById("userDisplay").innerText = name;
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("appPage").style.display = "block";
}

function payNow(){
    let receiver = document.getElementById("receiver").value;
    let amount = parseInt(document.getElementById("amount").value);
    if(receiver === "" || isNaN(amount) || amount <= 0)
        return alert("Enter valid details");

    tempReceiver = receiver;
    tempAmount = amount;

    document.getElementById("appPage").style.display = "none";
    document.getElementById("pinPage").style.display = "flex";
}

function verifyPin(){
    let pin = document.getElementById("upiPin").value;
    if(pin.length !== 4) return alert("Enter valid 4-digit PIN");

    balance -= tempAmount;
    document.getElementById("balance").innerText = balance;

    let txnId = "TXN" + Math.floor(Math.random() * 1000000000);

    showReceipt(tempReceiver, tempAmount, txnId);
}

function showReceipt(receiver, amount, txnId){
    document.getElementById("pinPage").style.display = "none";
    document.getElementById("receiptPage").style.display = "flex";

    document.getElementById("receiptDetails").innerHTML =
        `<h2>Payment Successful ✅</h2>
         <p>₹${amount} paid to ${receiver}</p>
         <p>Transaction ID: ${txnId}</p>
         <p>${new Date().toLocaleString()}</p>`;

    document.getElementById("successSound").play();

    let li = document.createElement("li");
    li.innerText = `₹${amount} paid to ${receiver} (${txnId})`;
    document.getElementById("history").appendChild(li);

    document.getElementById("receiveMsg").innerHTML =
        `₹${amount} received from ${currentUser}`;
}

function backHome(){
    document.getElementById("receiptPage").style.display = "none";
    document.getElementById("pinPage").style.display = "none";
    document.getElementById("qrPage").style.display = "none";
    document.getElementById("appPage").style.display = "block";
}

function openQR(){
    document.getElementById("appPage").style.display = "none";
    document.getElementById("qrPage").style.display = "flex";

    html5QrCode = new Html5Qrcode("reader");

    Html5Qrcode.getCameras().then(devices => {
        if (devices.length) {
            html5QrCode.start(
                devices[0].id,
                { fps: 10, qrbox: 200 },
                qrCodeMessage => {
                    html5QrCode.stop();
                    tempReceiver = qrCodeMessage;
                    tempAmount = Math.floor(Math.random() * 1000) + 1;
                    document.getElementById("qrPage").style.display = "none";
                    document.getElementById("pinPage").style.display = "flex";
                }
            );
        }
    }).catch(err => alert("Camera error"));
}