let recordedEvents = [];
let switchRecord = 0;
let startTime = 0;
const drumKitKeys = ["KeyQ", "KeyW", "KeyE", "KeyA", "KeyS", "KeyD", "KeyZ", "KeyX", "KeyC"];
const recordBtn = document.querySelector('#record-btn');
const stopBtn = document.querySelector('#stop-record-btn');
const playRecordBtn = document.querySelector('#play-btn');
const timerElement = document.querySelector('#timer');
const timerContainer = document.querySelector('.timer-container');


document.addEventListener("DOMContentLoaded", function () {
    function playSound(event) {
        if (!drumKitKeys.includes(event.code)) {
            return;
        }
        let activeKey = document.querySelector(`div[data-key="${event.code}"]`);
        let sound = document.querySelector(`audio[data-key="${event.code}"]`);
        sound.cloneNode(true).play();
        activeKey.classList.add("playing");
    }

    window.addEventListener("keydown", playSound);

    window.addEventListener("keyup", (event) => {
        if (!drumKitKeys.includes(event.code)) {
            return;
        }
        let key = document.querySelector(`div[data-key="${event.code}"]`);
        key.classList.remove("playing");
    });


    recordBtn.addEventListener("click", () => {
        if (switchRecord == 0) {
            recordedEvents = [];
            document.addEventListener("keydown", recordKeyEvent);
            document.addEventListener("keyup", recordKeyEvent);
            switchRecord = 1;
            startTimer();
        }
    });

    stopBtn.addEventListener("click", () => {
        if (switchRecord == 1) {
            document.removeEventListener("keydown", recordKeyEvent);
            document.removeEventListener("keyup", recordKeyEvent);
            switchRecord = 0;
            stopTimer();
        }
    });

    function recordKeyEvent(event) {
        if (drumKitKeys.includes(event.code)) {
            recordedEvents.push({
                type: event.type,
                keyCode: event.code,
                timeStamp: Date.now(),
            });
        }
    }


    playRecordBtn.addEventListener("click", () => {
        if (recordedEvents == [] || switchRecord == 1) {
            return;
        }
        replayRecord();
    });

    function replayRecord() {
        if (recordedEvents[0].timeStamp != 0) {
            const start = recordedEvents[0].timeStamp;

            recordedEvents.forEach((record) => {
                record.timeStamp -= start
            });
        }

        for (const recordedEvent of recordedEvents) {
            const { type, keyCode, timeStamp } = recordedEvent;

            const keyEvent = new KeyboardEvent(type, { code: keyCode });

            setTimeout(() => {
                window.dispatchEvent(keyEvent)
            }, timeStamp);
        }
    }

    function startTimer() {
        startTime = new Date().getTime();
        intervalId = setInterval(updateTimer, 1000);
        timerContainer.classList.add("recording");
    }

    function stopTimer() {
        clearInterval(intervalId);
        timerContainer.classList.remove("recording");
        timerContainer.classList.add("no-recording");
        timerElement.textContent = "00:00:00";
    }

    function updateTimer() {
        const currentTime = new Date().getTime();
        const elapsedTime = new Date(currentTime - startTime);
        const hours = String(elapsedTime.getUTCHours()).padStart(2, "0");
        const minutes = String(elapsedTime.getUTCMinutes()).padStart(2, "0");
        const seconds = String(elapsedTime.getUTCSeconds()).padStart(2, "0");
        timerElement.textContent = `${hours}:${minutes}:${seconds}`;
    }
});
