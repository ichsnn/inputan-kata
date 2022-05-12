let durationOnSecond = 60;

function secondToMinute_String(durationOnSecond) {
    let minute;
    let secondMod;

    minute = Math.floor(durationOnSecond / 60);
    secondMod = durationOnSecond % 60;

    if (secondMod < 10) {
        secondMod = `0${secondMod}`;
    }

    return `${minute}:${secondMod}`;
}

let durationString = setInterval(() => {
    console.log(secondToMinute_String(durationOnSecond) + ' ');
    if (durationOnSecond === 0) {
        clearTimeout(durationString);
        console.log('p')
    }
    if (durationOnSecond > 0) durationOnSecond--;
}, 100);
