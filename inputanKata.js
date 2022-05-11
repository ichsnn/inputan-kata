class InputaKata {
    index;
    kata;
    textArray;
    textHTML;
    textDisplayTemplate;
    inputan;
    resetButton;

    constructor(text, inputFieldHTML_ID, textDisplayHTML_ID) {
        this.index = 0;
        this.inputan = document.getElementById(inputFieldHTML_ID);
        this.textHTML = document.getElementById(textDisplayHTML_ID);
        this.textArray = text.split(' ');
        this.textDisplayTemplate = this.textTemplate(this.textArray, 'kata');
        this.textHTML.innerHTML = this.textDisplayTemplate;
        this.kata = document.getElementsByClassName('kata');
        this.kata[0].classList.add('focus');
        this.inputanOnKeypress();
        this.inputanOnKeyup();
        this.windowOnResize();

        this.resetButton = document.getElementById('btn-reset');
        this.resetOnClick();
    }

    inputanOnKeypress() {
        this.inputan.addEventListener('keypress', (event) => {
            if (event.key === ' ' || event.key === 'Enter' || event.code === 'Space') {
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
                    this.inputan.disabled = 1;
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
                    console.log('Salah');
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
            document.location.reload();
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

    mulai() {
        this.inputan.addEventListener(
            'keypress',
            (event) => {
                if (event.key) {
                    console.log('Mulai');
                }
            },
            { once: true }
        );
    }
}

let inputanKata = new InputaKata(text, 'inputan', 'text');
inputanKata.mulai();
