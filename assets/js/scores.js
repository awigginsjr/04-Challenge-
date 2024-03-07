function printHighscores() {
    // get scores from localstorage or set to empty array
    var highscores = JSON.parse(window.localStorage.getItem('highscores')) || [];

    // sort highscores by score property, descending 
    highscores.sort(function (a, b) {
        return b.score - a.score;
    });

    for (var i = 0; i < highscores.length; i += 1) {
        // li tag for each high score
        var liTag = document.createElement('li');
        liTag.textContent = highscores[i].initials + ' - ' + highscores[i].score;

        // display
        var olEl = document.getElementById('highscores');
        olEl.appendChild(liTag);
    }
}

function clearHighscores() {
    window.localStorage.removeItem('highscores');
    window.location.reload();
}

document.getElementById('clear').onclick = clearHighscores;

// called function 
printHighscores();