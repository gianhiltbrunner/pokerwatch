var round = 1;
var baseBlind = 10; //Change in div / Set to start values

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
        }
    }, 1000);
}

function startGame() {
    var time = document.querySelector('#timeinput').value;

    document.querySelector('#smallBlind').textContent =  baseBlind;
    document.querySelector('#bigBlind').textContent = 2 * baseBlind;

    document.getElementById("watch").style.display = 'inline';
    document.getElementById("input").style.display = 'none';

    var seconds = time * 60;
    display = document.querySelector('#time');
    startTimer(seconds, display);
};
