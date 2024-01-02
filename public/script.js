const socket = io();
var data;

function openPopup() {
    var popupWindow = window.open("./popup.html", "PopupWindow", "width=800,height=600");
    
    popupWindow.postMessage(data, '*');
    data = {
        userId: Math.random().toString(36).substr(2, 9),
        input1: document.querySelector('#input1').value,
        input2: document.querySelector('#input2').value,
        input3: document.querySelector('#input3').value,
        input4: document.querySelector('#input4').value,
        input5: document.querySelector('#input5').value,
        input6: document.querySelector('#countrySelect').value,
        input7: document.querySelector('#input7').value
    }
    
    socket.emit('formSubmit', data);
}

socket.on('closePopup', (userId) => {
    console.log(userId, data)
})

// socket.on('updateTable', newData => {
//     console.log(newData)
// })