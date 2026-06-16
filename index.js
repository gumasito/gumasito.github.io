if (window.location.pathname.includes("index.html")) {
    function showMusicWarning() {
        const warning =
            document.createElement("div");
        warning.className = "music-warning";
        warning.textContent = "♫ Music incoming!!";
        document.body.appendChild(
            warning);
        setTimeout(
            () => warning.remove(), 10000
        );
    };
    showMusicWarning()
}
if (window.location.pathname.includes("index2.html")) {
    function showMusicWarning() {
        const warning =
            document.createElement("div");
        warning.className = "music-warning";
        warning.textContent = "♫ HI AGAIN!!";
        document.body.appendChild(
            warning);
        setTimeout(
            () => warning.remove(), 10000
        );
    }
    showMusicWarning();
    //! Swiper
    //! Abajo CHICO
    var swiper = new Swiper(".mySwiper", {
        spaceBetween: 10,
        slidesPerView: 4,
        freeMode: true,
        watchSlidesProgress: true,
    });
    //! GRANDE
    var swiper2 = new Swiper(".mySwiper2", {
        spaceBetween: 10,
        thumbs: {
            swiper: swiper,
        },
        loop: true,
    });
    //! GRID
    var swiper3 = new Swiper(".mySwiper3", {
        slidesPerView: 3,
        loop: true,
        /*autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },*/
        grid: {
            rows: 2,
        },
        spaceBetween: 30,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
            type: "fraction" //bullets - fraction - progressbar
        }, scrollbar: {
            el: ".swiper-scrollbar",
            draggable: true,
            direction: "horizontal",
        },
        mousewheel: true,
        //effect:fade - slide - cube - cards - coverflows
        //centeredSlides: true,
        /*breakpoints: {
            640: {
                slidesPerView: 1,
            },
            1024: {
                slidesPerView: 3,
            }
        }*/
    });
}
if (window.location.pathname.includes("index3.html")) {
    var swiper = new Swiper(".carrusel-flores", {
        slidesPerView: 4,
        loop: true,
        /*autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },*/
        grid: {
            rows: 2,
        },
        spaceBetween: 5,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
            type: "fraction" //bullets - fraction - progressbar
        }
    })

    var swiper2 = new Swiper(".carrusel-flores2", {
        slidesPerView: 4,
        loop: true,
        /*autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },*/
        grid: {
            rows: 2,
        },
        spaceBetween: 10,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
            type: "fraction" //bullets - fraction - progressbar
        }
    })
}


//! Cargar datos de canción
const savedTrackIndex = localStorage.getItem("trackIndex");
const savedTime = localStorage.getItem("songTime");
const savedPaused = localStorage.getItem("songPaused");

const progress = document.getElementById("progress");
const songName = document.getElementById("song-name");
const canvas = document.getElementById("visualizer");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
const ctx = canvas.getContext("2d");

let audioContext;
let analyser;
let dataArray;
let bufferLength;

//! seccion para mirar imagenes mas grandes
const images = document.querySelectorAll(".intro--img");
const overlay = document.getElementById("overlay");
const overlayImg = document.getElementById("overlayImg");
const overlayText = document.getElementById("overlayText");

function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
}
const scrollbarWidth = getScrollbarWidth();
images.forEach(img => {
    img.addEventListener("click", () => {
        overlayImg.src = img.src;
        if (window.location.pathname.includes("index.html")) {
            overlayText.textContent = img.dataset.text;
        }
        overlay.classList.add("active");
        document.body.classList.add("no-scroll");
        if (scrollbarWidth > 0) {
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        }
    });
});

overlay.addEventListener("click", () => {
    overlay.classList.remove("active");
    document.body.classList.remove("no-scroll");
    document.body.style.paddingRight = '';
});
//! Seccion para copiar IDs dentro de la pagina
document.querySelectorAll(".copy-text").forEach(el => {
    el.addEventListener("click", async () => {

        await navigator.clipboard.writeText(el.textContent);

        const aviso = document.createElement("div");
        aviso.textContent = "✓ Copiado";
        aviso.className = "copied-toast";

        document.body.appendChild(aviso);

        setTimeout(() => aviso.remove(), 1500);
    });
});

//! Musica
const tracks = document.querySelectorAll(".track");
const player = document.getElementById("music--player");


//! volumen slider control
const volumeSlider = document.getElementById("volume-slider");

volumeSlider.addEventListener("input", () => {
    player.volume = volumeSlider.value / 100;
});
let currentTrack = null;
if (savedTrackIndex !== null) {
    const track = tracks[savedTrackIndex];
    currentTrack = track;
    player.src = track.dataset.song;
    songName.textContent =
        track.dataset.song
            .split("/")
            .pop()
            .replace(".mp3", "");
    player.onloadedmetadata = () => {
        if (savedTime) {
            player.currentTime = Number(savedTime);
        } if (savedPaused === "false") {
            player.play();
        } if (savedPaused === "false" && animateDisks) {
            track.classList.add("active");
            volumeSlider.classList.add("rotating");
        }
        player.onloadedmetadata = null;
    }
}
tracks.forEach((track, index) => {
    track.addEventListener("click", () => {
        const img = track.querySelector("img");
        localStorage.setItem("trackIndex", index);
        if (img) {
            cursor.style.backgroundImage = `url('${img.src}')`;
            volume_ball.style.setProperty(
                "--thumb-image",
                `url('${img.src}')`
            );
        }
        if (currentTrack == track) {
            if (!player.paused) {
                player.pause();
                localStorage.setItem("songPaused", true);
                const img = track.querySelector("img");
                img.src = track.dataset.static;
                if (animateDisks) {
                    volumeSlider.classList.remove("rotating");
                    track.classList.remove("active");
                }
            } else {
                player.play();
                localStorage.setItem("songPaused", false);
                const img = track.querySelector("img");
                if (animateDisks) {
                    volumeSlider.classList.add("rotating");
                    track.classList.add("active");
                }
            }
            return;
        }
        if (currentTrack) {
            const oldImg = currentTrack.querySelector("img");
            oldImg.src = currentTrack.dataset.static;
            if (animateDisks) currentTrack.classList.remove("active");
        }

        setupVisualizer();
        player.src = track.dataset.song;
        songName.textContent =
            track.dataset.song
                .split("/")
                .pop()
                .replace("mp3", "");
        progress.value = 0;
        localStorage.setItem("songTime", 0);
        player.volume = .10;
        player.play();

        if (animateDisks) {
            track.classList.add("active");
            volumeSlider.classList.add("rotating");
        }
        currentTrack = track;
        return;
    });
});
//! INICIO CONTROLADOR MUSICA
function setupVisualizer() {
    if (audioContext) return;
    audioContext = new AudioContext();
    const source = audioContext.createMediaElementSource(player);
    analyser = audioContext.createAnalyser();
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
}

function bounce() {

    requestAnimationFrame(bounce);
    if (!analyser) return;
    analyser.getByteFrequencyData(dataArray);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let barWidth = canvas.width / bufferLength;
    for (let i = 0; i < bufferLength; i++) {
        const smoothData = new Array(bufferLength).fill(0);
        smoothData[i] += (dataArray[i] - smoothData[i]) * 0.2;
        let height = smoothData[i];
        ctx.fillStyle = `hsl(${height},100%,50%)`;
        ctx.fillRect(
            i * barWidth,
            canvas.height - height,
            barWidth - 2,
            height
        );
    }
}
bounce();
player.addEventListener(
    "timeupdate",
    () => {
        if (player.duration) {
            progress.value = (player.currentTime / player.duration) * 100;
            localStorage.setItem("songTime", player.currentTime);
        }
    }
);
progress.addEventListener(
    "input",
    () => {
        player.currentTime = (progress.value / 100) * player.duration;
    }
);
//!FIN CONTROLADOR MUSICA
player.addEventListener("ended", () => {
    if (currentTrack) {
        const img = currentTrack.querySelector("img");
        img.src = currentTrack.dataset.static;
        if (animateDisks) {
            currentTrack.classList.remove("active");
            volumeSlider.classList.remove("rotating");
        }
        progress.value = 0;

        songName.textContent = "No song";
        currentTrack = null;
        localStorage.removeItem("trackIndex");
        localStorage.removeItem("songTime");
        localStorage.removeItem("songPaused");
    }
});
const playlist = document.querySelector(".playlist");
const toggleBtn = document.getElementById("togglePlaylist");
const volumeBox = document.querySelector(".volume--container");
toggleBtn.addEventListener("click", () => {
    playlist.classList.toggle("open");
    volumeBox.classList.toggle("open");
    toggleBtn.textContent = playlist.classList.contains("open") ? "[X]" : "[O]";
});


let rotation = 0;
function animate() {
    if (!animateCursor) {
        return;
    }
    else {
        currentX += (mouseX - currentX) * 0.2;
        currentY += (mouseY - currentY) * 0.2;
        rotation += 2;
        cursor.style.left = currentX + "px";
        cursor.style.top = currentY + "px";
        cursor.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
        requestAnimationFrame(animate);
    }
}

//! cursor
const cursor = document.createElement("div");
//! slider volume
const volume_ball = document.querySelector(".volume--slider-input");
let mouseX = 0;
let mouseY = 0;
let currentX = 0;
let currentY = 0;

document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});


//! Animations
let animateDisks =
    localStorage.getItem("animateDisks") === "true";

let animateCursor =
    localStorage.getItem("animateCursor") === "true";

let animateHover =
    localStorage.getItem("animateHover") === "true";

let changeTheme =
    localStorage.getItem("changeTheme") === "true";
cursor.style.display = "none";
document.body.classList.add("normal-cursor");
volumeSlider.classList.remove("rotating");
updateAnimations();
const toggleAnm = document.getElementById("toggleAnimation");
const gatesSettings = document.querySelector(".GateOpened");

toggleAnm.addEventListener("click", () => {
    gatesSettings.classList.toggle("active");
    toggleAnm.classList.toggle("open");
});

const configs = document.querySelectorAll(".botonesTocables");
configs.forEach(button => {

    switch (button.id) {

        case "AnimateDiscos":

            if (animateDisks) {
                button.classList.add("selected");
                button.textContent =
                    "- Animate Discos";
            }

            break;

        case "AnimateRotation":

            if (animateCursor) {
                button.classList.add("selected");
                button.textContent =
                    "- Animate Cursor";
            }

            break;

        case "AnimateHover":

            if (animateHover) {
                button.classList.add("selected");
                button.textContent =
                    "- Animate Hover";
            }

            break;

        case "ChangeColor":

            if (changeTheme) {
                button.classList.add("selected");
                button.textContent =
                    "Theme Purple";
            }

            break;
    }
});
configs.forEach(button => {
    button.addEventListener("click", () => {
        button.classList.toggle("selected");
        switch (button.id) {

            case "AnimateDiscos":
                button.textContent = button.classList.contains("selected") ? "- Animate Discos" : "+ Animate Discos";
                animateDisks = !animateDisks;
                updateAnimations();
                localStorage.setItem(
                    "animateDisks",
                    animateDisks
                );
                break;

            case "AnimateRotation":
                button.textContent = button.classList.contains("selected") ? "- Animate Cursor" : "+ Animate Cursor";
                animateCursor = !animateCursor;
                updateAnimations();
                localStorage.setItem(
                    "animateCursor",
                    animateCursor
                );
                break;

            case "AnimateHover":
                button.textContent = button.classList.contains("selected") ? "- Animate Hover" : "+ Animate Hover";
                animateHover = !animateHover;
                updateAnimations();
                localStorage.setItem(
                    "animateHover",
                    animateHover
                );
                break;

            case "ChangeColor":
                changeTheme = !changeTheme;
                button.textContent = button.classList.contains("selected") ? "Theme Purple" : "Theme Red";
                localStorage.setItem(
                    "changeTheme",
                    changeTheme
                );
                updateAnimations();
                break;

        }

    });
});

function updateAnimations() {
    const backImg = document.querySelectorAll(".fondo--img");
    const titleImg = document.querySelector("h1 .intro--title");
    if (!animateDisks) {
        volumeSlider.classList.remove("rotating");
        tracks.forEach(track => {
            track.classList.remove("active");
        })
    } else {
        if (!player.paused) {
            volumeSlider.classList.add("rotating");
            if (currentTrack) {
                currentTrack.classList.add("active")
            }
        }
    } if (!animateCursor) {
        cursor.style.display = "none";
        document.body.classList.add("normal-cursor");
    } else {
        cursor.style.display = "block";
        animate();
        cursor.classList.add("cursor");
        document.body.appendChild(cursor);
        document.body.classList.remove("normal-cursor");
    } if (!animateHover) {
        document.body.classList.add("no-transitions");
    } else {
        document.body.classList.remove("no-transitions");
    } if (!changeTheme) {
        document.body.classList.add("theme_red");
        document.body.classList.remove("theme_purple");
    } else {
        document.body.classList.remove("theme_red");
        document.body.classList.add("theme_purple");
    }
    //! IMAGENES THEMES
    backImg.forEach(img => {

        if (document.body.classList.contains("theme_purple")) {
            img.src = img.dataset.purple;
            titleImg.src = titleImg.dataset.purple;
        }
        if (document.body.classList.contains("theme_red")) {
            img.src = img.dataset.red;
            titleImg.src = titleImg.dataset.red;
        }
    });
}

