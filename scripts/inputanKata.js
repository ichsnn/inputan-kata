class InputanKataObj {
    index;
    kata;
    textArray;
    textHTML;
    textDisplayTemplate;
    inputan;
    resetButton;
    parentElement;
    durationHTML;
    durationOnSecond; // Example 60s
    diffScroll = 0;
    grossWPM = 0;
    netWPM = 0;
    typedEntriesCh = 0;
    uncorrectedError = 0;
    timeStart = 0;

    constructor(parentElement, text, durationOnSecond = '60') {
        this.parentElement = parentElement;
        this.durationOnSecond = durationOnSecond;
        this.durationHTML = this.parentElement.querySelector('.duration');
        this.index = 0;
        this.inputan = this.parentElement.querySelector('#inputan');
        this.textHTML = this.parentElement.querySelector('#text');
        this.textArray = text.split(' ');
        this.textDisplayTemplate = this.textTemplate(this.textArray, 'kata');
        this.textHTML.innerHTML = this.textDisplayTemplate;
        this.kata = this.parentElement.querySelectorAll('.kata');
        this.kata[0].classList.add('focus');
        this.inputanOnKeypress();
        this.inputanOnKeyup();
        this.windowOnResize();
        this.resetButton = this.parentElement.querySelector('#btn-reset');
        this.resetOnClick();
    }

    inputanOnKeypress() {
        this.inputan.addEventListener('keypress', (event) => {
            if (
                event.key === ' ' ||
                event.key === 'Enter' ||
                event.code === 'Space'
            ) {
                event.preventDefault();
                if (this.inputan.value !== '') {
                    this.kata[this.index].classList.remove('focus');
                    this.kata[this.index].classList.remove('peringatan');
                    if (this.inputan.value === this.textArray[this.index]) {
                        this.kata[this.index].classList.add('benar');
                    } else {
                        this.kata[this.index].classList.add('salah');
                    }
                    this.countGrossWPM();
                    this.countNetWPM();
                    this.index++;
                    if (this.kata[this.index]) {
                        this.kata[this.index].classList.add('focus');
                        this.fokusKeKata();
                    }
                    this.inputan.value = '';
                    if (this.index >= this.textArray.length) {
                        this.disableInputan();
                    }
                }
            }
        });
    }

    inputanOnKeyup() {
        this.inputan.addEventListener('keyup', (event) => {
            if (this.inputan.value !== '') {
                if (
                    this.textArray[this.index].indexOf(this.inputan.value) === 0
                ) {
                    this.kata[this.index].classList.remove('peringatan');
                } else {
                    this.kata[this.index].classList.add('peringatan');
                }
            } else {
                this.kata[this.index].classList.remove('peringatan');
            }
        });
    }

    windowOnResize() {
        window.addEventListener('resize', () => {
            this.fokusKeKata();
        });
    }

    resetOnClick() {
        this.resetButton.addEventListener('click', () => {
            this.parentElement.remove();
            addInputanKata();
        });
    }

    fokusKeKata() {
        let topPos =
            this.kata[this.index].offsetTop - this.parentElement.offsetTop;
        if (this.diffScroll === 0) {
            this.diffScroll = topPos;
        }
        this.textHTML.scrollTop = topPos - this.diffScroll;
        // this.kata[this.index].scrollIntoView();
    }

    textTemplate(textArray, className = 'kata') {
        let textTemplate = '';
        for (let i = 0; i < textArray.length; i++) {
            textTemplate +=
                `<span class="${className}">${textArray[i]}</span>` + ' ';
        }
        return textTemplate;
    }

    disableInputan() {
        this.inputan.value = '';
        this.inputan.disabled = 1;
        this.inputan.placeholder = 'Klik untuk mulai ulang...';
        this.parentElement
            .querySelector('.text-input')
            .addEventListener('click', () => {
                this.parentElement.remove();
                addInputanKata();
            });
    }

    timerCountDown() {
        let timeout = 1000;
        this.durationOnSecond -= 1;
        this.timeStart += 1;
        let countDown = setInterval(() => {
            this.durationHTML.querySelector('#time-counter').textContent =
                secondToMinuteDuration(this.durationOnSecond);
            if (this.durationOnSecond === 0) {
                clearTimeout(countDown);
                this.disableInputan();
                alert('Time Up!');
            }
            if (this.durationOnSecond > 0) {
                this.durationOnSecond--;
                this.timeStart++;
            }
        }, timeout);
    }

    countGrossWPM() {
        this.typedEntriesCh += this.textArray[this.index].length;
        this.grossWPM = this.typedEntriesCh / 5 / (this.timeStart / 60);
    }

    countNetWPM() {
        let salah = this.parentElement.querySelectorAll('.salah');
        let errorCh = 0;
        for (let i = 0; i < salah.length; i++) {
            errorCh += salah[i].textContent.length;
        }
        this.uncorrectedError = errorCh / 5;
        this.netWPM =
            this.grossWPM - this.uncorrectedError / (this.timeStart / 60);
            console.log(this.netWPM)
    }

    mulai() {
        this.inputan.addEventListener(
            'keypress',
            (event) => {
                if (event.key) {
                    this.timerCountDown();
                }
            },
            { once: true }
        );
    }
}

class InputanKata extends HTMLDivElement {
    constructor() {
        super();
        this.innerHTML = `
        <div class="stats">
            <div>WPM : <span id="wpm-counter">0</span></div>
            <div class="duration">Time : <span id="time-counter">1:00</span></div>
        </div>
            <div class="text-box">
                <div id="text"></div>
            </div>
            <div class="text-input">
                <input type="text" id="inputan" placeholder="Ketik di sini...">
                <button type="reset" id="btn-reset"><span class="material-symbols-outlined">
                refresh
                </span></button>
            </div>
        `;
    }

    connectedCallback() {
        let inputanKata = new InputanKataObj(this, text, 60);
        inputanKata.mulai();
    }
}
customElements.define('inputan-kata', InputanKata, { extends: 'div' });

function addInputanKata() {
    document.querySelector('.inputan-kata-box').innerHTML =
        '<div class="lds-facebook"><div></div><div></div><div></div></div>';
    setTimeout(() => {
        document.querySelector('.inputan-kata-box').innerHTML = '';
        document.querySelector('.inputan-kata-box').append(new InputanKata());
    }, 1750);
}

function secondToMinuteDuration(secondDuration) {
    let minute, secondMod;

    minute = Math.floor(secondDuration / 60);
    secondMod = secondDuration % 60;

    if (secondMod < 10) {
        secondMod = `0${secondMod}`;
    }

    return `${minute}:${secondMod}`;
}

document.addEventListener('DOMContentLoaded', () => {
    addInputanKata();
});
