let recordedEvents = [];
let switchRecord = 0;
const drumKitKeys = ["KeyQ", "KeyW", "KeyE", "KeyA", "KeyS", "KeyD", "KeyZ", "KeyX", "KeyC"];
const recordBtn = document.querySelector('#record-btn');
const playRecordBtn = document.querySelector('#play-btn');

document.addEventListener("DOMContentLoaded", function () {
    function playSound(event) {
        let activeKey = document.querySelector(`div[data-key="${event.code}"]`);
        let sound = document.querySelector(`audio[data-key="${event.code}"]`);
        sound.cloneNode(true).play();
        activeKey.classList.add("playing");
    }

    window.addEventListener("keydown", playSound);

    window.addEventListener("keyup", (event) => {
        let key = document.querySelector(`div[data-key="${event.code}"]`);
        key.classList.remove("playing");
    });


    recordBtn.addEventListener("click", () => {
        if (switchRecord == 1) {
            document.removeEventListener("keydown", recordKeyEvent);
            document.removeEventListener("keyup", recordKeyEvent);
            switchRecord = 0;
            return;
        }

        recordedEvents = [];
        document.addEventListener("keydown", recordKeyEvent);
        document.addEventListener("keyup", recordKeyEvent);
        switchRecord = 1;
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
});
