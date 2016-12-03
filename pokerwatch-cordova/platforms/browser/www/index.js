var round = 1;
var baseBlind = 10;
var audio = new Audio('notification.mp3');

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            timer = duration;
            document.querySelector('#round').textContent =  ++round;
            document.querySelector('#smallBlind').textContent =  baseBlind * round;
            document.querySelector('#bigBlind').textContent = 2 * baseBlind * round;

            audio.play();//notification
            navigator.notification.beep(1);
        }
    }, 1000);//1 sec
}

function startGame() {
    var time = document.querySelector('#timeinput').value;
    baseBlind = document.querySelector('#blindinput').value;

    console.log(time);

    if (time == 0){time = 10;}//Sets standard value
    if (baseBlind == 0){baseBlind = 10;}

    document.querySelector('#smallBlind').textContent =  baseBlind;
    document.querySelector('#bigBlind').textContent = 2 * baseBlind;

    document.getElementById("watch").style.display = 'inline';
    document.getElementById("input").style.display = 'none';

    var seconds = time * 60;
    display = document.querySelector('#time');
    startTimer(seconds, display);
};
