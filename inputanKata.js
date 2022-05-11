class InputanKataObj {
    index;
    kata;
    textArray;
    textHTML;
    textDisplayTemplate;
    inputan;
    resetButton;
    bound;
    durationHTML;
    durationOnSecond; // Example 60s
    grossWPM = 0;

    constructor(element, text, durationOnSecond = '60') {
        this.bound = element;
        this.durationOnSecond = durationOnSecond;
        this.durationHTML = this.bound.querySelector('.duration');
        this.index = 0;
        this.inputan = this.bound.querySelector('#inputan');
        this.textHTML = this.bound.querySelector('#text');
        this.textArray = text.split(' ');
        this.textDisplayTemplate = this.textTemplate(this.textArray, 'kata');
        this.textHTML.innerHTML = this.textDisplayTemplate;
        this.kata = this.bound.querySelectorAll('.kata');
        this.kata[0].classList.add('focus');
        this.inputanOnKeypress();
        this.inputanOnKeyup();
        this.windowOnResize();

        this.resetButton = this.bound.querySelector('#btn-reset');
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
                this.kata[this.index].classList.remove('focus');
                this.kata[this.index].classList.remove('peringatan');
                if (this.inputan.value === this.textArray[this.index]) {
                    this.kata[this.index].classList.add('benar');
                } else {
                    this.kata[this.index].classList.add('salah');
                }
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
            this.null;
            this.bound.remove();
            addInputanKata();
        });
    }

    fokusKeKata() {
        this.kata[this.index].scrollIntoView();
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
        this.inputan.placeholder = 'Tekan "Reset" untuk memulai lagi';
    }

    timerCountDown() {
        let timeout = 1000;
        this.durationOnSecond -= 1;
        let countDown = setInterval(() => {
            this.durationHTML.textContent = secondToMinuteDuration(
                this.durationOnSecond
            );
            if (this.durationOnSecond === 0) {
                clearTimeout(countDown);
                this.disableInputan();
            }
            if (this.durationOnSecond > 0) this.durationOnSecond--;
        }, timeout);
    }

    countGrossWPM() {}

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
            <div class="text-box">
                <div id="text"></div>
            </div>
            <div class="text-input">
                <input type="text" id="inputan" placeholder="Ketik di sini...">
                <div class="duration">1:00</div>
                <input type="reset" id="btn-reset" value="Reset">
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
