var round = 1;
var baseBlind = 10;
var audio = new Audio('notification.mp3');
var timeRemaining = 0;
var timePassed = 0;
var seconds = 0;
var timerInterval
var wannaPause = false;
var isPaused = false;

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;

    timerInterval = setInterval(function () {

        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;


        timeRemaining = timer; //Save time passed
        console.log('Remaining ' + timeRemaining);

        if (--timer < 0) {
            timer = duration + timePassed; // Add the passed time again for next turn
            document.querySelector('#round').textContent =  ++round;
            document.querySelector('#smallBlind').textContent =  baseBlind * round;
            document.querySelector('#bigBlind').textContent = 2 * baseBlind * round;

            audio.play();//notification
            //navigator.notification.beep(1);
        }

        if(wannaPause){ //ensures pausing is only possible on full seconds
          wannaPause = false;
          pause();
        }

    }, 1000);//1 sec
}

function pauseResume() {
  if (isPaused) {
      resume();
  }
  else {
      wannaPause = true;//waiting for timer
  }
  console.log('Paused? ' + isPaused);
}

function pause() {
  isPaused = true;
  clearInterval(timerInterval);
  document.querySelector('#pauseresume').textContent =  'Resume';
}

function resume() {
    isPaused = false;
    display = document.querySelector('#time');
    timePassed = seconds - timeRemaining
    startTimer(seconds-timePassed, display);//Resume without time already passed
    document.querySelector('#pauseresume').textContent =  'Pause';
}

function startGame() {
    var time = document.querySelector('#timeinput').value;
    baseBlind = document.querySelector('#blindinput').value;

    if (time == 0){time = 10;}//Sets standard value
    if (baseBlind == 0){baseBlind = 10;}

    document.querySelector('#smallBlind').textContent =  baseBlind;
    document.querySelector('#bigBlind').textContent = 2 * baseBlind;

    document.getElementById("watch").style.display = 'inline';
    document.getElementById("input").style.display = 'none';

    seconds = time * 60;
    display = document.querySelector('#time');
    startTimer(seconds, display);
};
