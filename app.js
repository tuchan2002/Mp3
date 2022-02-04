const audio = document.getElementById('audio');
const playBtn = document.querySelector(".play-inner");
const nextBtn = document.querySelector(".play-forward");
const prevBtn = document.querySelector(".play-back");
const durationTime = document.querySelector(".duration");
const remainingTime = document.querySelector(".remaining");
const rangeBar = document.querySelector(".range");
const musicName = document.querySelector(".music-name");
const musicImage = document.querySelector(".music-thumb img");
const musicThumbnail = document.querySelector(".music-thumb");
const playRepeat = document.querySelector(".play-repeat");
const playRandom = document.querySelector(".play-random");
const musicPlaylists = document.querySelector(".music-playlists");

const musics = [{
        id: 1,
        title: "Tegami",
        file: "tegami.mp3",
        image: "https://i.pinimg.com/564x/19/b7/86/19b786eb1325d2bef10ce03b85e84a9f.jpg"
    },
    {
        id: 2,
        title: "Until You",
        file: "until-you.mp3",
        image: "https://i.pinimg.com/564x/04/87/e0/0487e0aef28e0149775ff669886f2e28.jpg"
    },
    {
        id: 3,
        title: "This Love",
        file: "this-love.mp3",
        image: "https://i.pinimg.com/564x/c5/83/75/c58375abf0f8074e1879da2a0ba9c214.jpg"
    },
    {
        id: 4,
        title: "Once Again",
        file: "once-again.mp3",
        image: "https://i.pinimg.com/564x/a9/ff/3f/a9ff3f20cbcc1e9d43c6a75255480c83.jpg"
    },
    {
        id: 5,
        title: "Beautiful In White",
        file: "beautiful-in-white.mp3",
        image: "https://i.pinimg.com/736x/e0/04/7f/e0047fff433cc9f9394de8e956bac5e8.jpg"
    },
]

let isPlaying = true;
let indexSong = 0;
let isRepeat = false;
let isRandom = false;
let timer;

let playlists = '';
musics.forEach((music, index) => {
    playlists += `<li class="song ${index === 0 ? 'active' : ''}" data-index="${index}">
        <div class="song-thumb">
            <img src="${music.image}" alt="song-thumb">
        </div>
        <h4 class="song-name">${music.title}</h4>
        <ion-icon name="ellipsis-horizontal" class="song-option"></ion-icon>
    </li>`
})
musicPlaylists.innerHTML = playlists;

musicPlaylists.addEventListener("click", function(e) {
    const songElement = e.target.closest('.song:not(.active)');
    if (songElement) {
        const songElementActived = musicPlaylists.querySelector('.song.active');
        songElementActived.classList.remove("active");
        songElement.classList.add("active");
        let newIndexSong = songElement.getAttribute('data-index');
        isPlaying = true;
        init(newIndexSong)
        playPause();
    }
})

const thumbWidth = musicThumbnail.offsetWidth;
const playlistsHeight = musicPlaylists.offsetHeight;
const playlistsMaxHeight = thumbWidth + playlistsHeight;
musicPlaylists.onscroll = () => {
    const scrollTop = musicPlaylists.scrollTop;

    const newThumbWidth = thumbWidth - scrollTop;
    musicThumbnail.style.width = newThumbWidth > 0 ? newThumbWidth + 'px' : 0;
    musicThumbnail.style.height = newThumbWidth > 0 ? newThumbWidth + 'px' : 0;

    const newPlaylistsHeight = playlistsHeight + scrollTop;
    musicPlaylists.style.height = newPlaylistsHeight > playlistsMaxHeight ? playlistsMaxHeight + 'px' : newPlaylistsHeight + 'px';
}

playRepeat.addEventListener("click", function() {
    if (isRepeat) {
        isRepeat = false;
        playRepeat.removeAttribute("style");
    } else {
        isRepeat = true;
        playRepeat.style.color = "#ff6bcb";
    }
})
playRandom.addEventListener("click", function() {
    if (isRandom) {
        isRandom = false;
        playRandom.removeAttribute("style");
    } else {
        isRandom = true;
        playRandom.style.color = "#ff6bcb";
    }
})
nextBtn.addEventListener("click", function() {
    changeSong(1);
})
prevBtn.addEventListener("click", function() {
    changeSong(-1);
})
audio.addEventListener("ended", handleEndedSong);

function handleEndedSong() {
    if (isRepeat) {
        isPlaying = true;
        playPause();
    } else if (isRandom) {
        handleRandomSong();
    } else {
        changeSong(1);
    }
}

function handleRandomSong() {
    let newIndexSong = Math.floor(Math.random() * musics.length);
    isPlaying = true;
    init(newIndexSong)
    playPause();
}

function changeSong(dir) {
    if (dir === 1) {
        // next song
        indexSong++;
        if (indexSong >= musics.length) {
            indexSong = 0;
        }
        isPlaying = true;
    } else if (dir === -1) {
        // prev song
        indexSong--;
        if (indexSong < 0) {
            indexSong = musics.length - 1;
        }
        isPlaying = true;
    }
    init(indexSong)
    playPause();
}

playBtn.addEventListener("click", playPause);

function playPause() {
    if (isPlaying) {
        audio.play();
        playBtn.innerHTML = `<ion-icon name="pause"></ion-icon>`;
        timer = setInterval(displayTimer, 500)
        musicThumbnail.classList.add("is-playing");
    } else {
        audio.pause();
        playBtn.innerHTML = `<ion-icon name="play"></ion-icon>`;
        clearInterval(timer)
        musicThumbnail.classList.remove("is-playing");
    }
    isPlaying = !isPlaying;
}

function displayTimer() {
    const { duration, currentTime } = audio;
    rangeBar.max = duration;
    rangeBar.value = currentTime;

    remainingTime.textContent = formatTimer(currentTime)
    if (!duration) {
        durationTime.textContent = "00:00"
    } else {
        durationTime.textContent = formatTimer(duration);
    }
}

function formatTimer(number) {
    const minutes = Math.floor(number / 60);
    const seconds = Math.floor(number - minutes * 60);
    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

rangeBar.addEventListener("change", handleChangeBar);

function handleChangeBar() {
    audio.currentTime = rangeBar.value;
}

function init(indexSong) {
    audio.setAttribute("src", `./music/${musics[indexSong].file}`);
    musicName.textContent = musics[indexSong].title;
    musicImage.setAttribute("src", musics[indexSong].image);

    const songElementActived = musicPlaylists.querySelector('.song.active');
    songElementActived.classList.remove("active");
    musicPlaylists.querySelector(`.song[data-index='${indexSong}']`).classList.add("active");
}
displayTimer();
init(indexSong);