const dateTimeNow = new Date();

function addDateTime(message) {
    return alert(dateTimeNow.toLocaleDateString() + " " + dateTimeNow.getHours() + ":" + dateTimeNow.getMinutes() + " : " + message);
};

addDateTime("Hello");