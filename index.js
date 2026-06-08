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
}
//! seccion para mirar imagenes mas grandes
const images = document.querySelectorAll(".intro--img");
const overlay = document.getElementById("overlay");
const overlayImg = document.getElementById("overlayImg");
const overlayText = document.getElementById("overlayText");

images.forEach(img => {
    img.addEventListener("click", () => {
        overlayImg.src = img.src;
        overlayText.textContent = img.dataset.text;
        overlay.classList.add("active");
    });
});

overlay.addEventListener("click", () => {
    overlay.classList.remove("active");
});
//! seccion para evitar el scroll al mirar una imagen
images.forEach(img => {
    img.addEventListener("click", () => {
        overlayImg.src = img.src;
        overlay.classList.add("active");
        document.body.classList.add("no-scroll");
    });
});

overlay.addEventListener("click", () => {
    overlay.classList.remove("active");
    document.body.classList.remove("no-scroll");
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
const volumeSlider =
    document.getElementById(
        "volume-slider"
    );

volumeSlider.addEventListener(
    "input",
    () => {

        player.volume =
            volumeSlider.value / 100;

    });
let currentTrack = null;

tracks.forEach(track => {

    track.addEventListener("click", () => {
        const img = track.querySelector("img");
        if (img) {
            cursor.style.backgroundImage = `url('${img.src}')`;
            volume_ball.style.setProperty(
                "--thumb-image",
                `url('${img.src}')`
            );

        }

        if (currentTrack == track) {

            if (!player.paused) {
                volumeSlider.classList.remove("rotating");
                player.pause();
                const img = track.querySelector("img");
                img.src = track.dataset.static;
                track.classList.remove("active");
            } else {
                player.play();
                volumeSlider.classList.add("rotating");
                const img = track.querySelector("img");
                track.classList.add("active");
            }
            return;
        }
        if (currentTrack) {

            const oldImg = currentTrack.querySelector("img");

            oldImg.src = currentTrack.dataset.static;

            currentTrack.classList.remove("active");
        }

        setupVisualizer();
        player.src = track.dataset.song;
        songName.textContent =
            track.dataset.song
                .split("/")
                .pop()
                .replace("mp3", "");
        player.volume = .2;
        player.play();


        track.classList.add("active");
        volumeSlider.classList.add("rotating");
        currentTrack = track;
    });
});
//! INICIO CONTROLADOR MUSICA
const progress =
    document.getElementById(
        "progress"
    );
const songName =
    document.getElementById(
        "song-name"
    );
const canvas =
    document.getElementById(
        "visualizer"
    );
canvas.width =
    canvas.offsetWidth;
canvas.height =
    canvas.offsetHeight;
const ctx =
    canvas.getContext(
        "2d"
    );

let audioContext;
let analyser;
let dataArray;
let bufferLength;

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

    requestAnimationFrame(
        bounce
    );
    if (!analyser)
        return;
    analyser.getByteFrequencyData(
        dataArray
    );
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
    let barWidth =
        canvas.width /
        bufferLength;
    for (
        let i = 0;
        i < bufferLength;
        i++
    ) {
        const smoothData =
            new Array(
                bufferLength
            ).fill(0);
        smoothData[i] +=
            (dataArray[i] - smoothData[i]) * 0.2;
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

        currentTrack.classList.remove("active");
        volumeSlider.classList.remove("rotating");
        progress.value = 0;

        songName.textContent =
            "No song";
        currentTrack = null;
    }
});
const playlist = document.querySelector(".playlist");
const toggleBtn = document.getElementById("togglePlaylist");
const volumeBox = document.querySelector(".volume--container");
toggleBtn.addEventListener("click", () => {
    playlist.classList.toggle("open");
    volumeBox.classList.toggle("open");
    toggleBtn.textContent =
        playlist.classList.contains("open")
            ? "[X]"
            : "[O]";
});
//! cursor
const cursor = document.createElement("div");
//! slider volume
const volume_ball = document.querySelector(".volume--slider-input");
cursor.classList.add("cursor");
document.body.appendChild(cursor);

let mouseX = 0;
let mouseY = 0;
let currentX = 0;
let currentY = 0;

document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});
let rotation = 0;
function animate() {
    currentX += (mouseX - currentX) * 0.2;
    currentY += (mouseY - currentY) * 0.2;
    rotation += 2;
    cursor.style.left = currentX + "px";
    cursor.style.top = currentY + "px";
    cursor.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;

    requestAnimationFrame(animate);
}

animate();

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
});
//! GRID
var swiper3 = new Swiper(".mySwiper3", {
    slidesPerView: 3,
    loop: true,
    autoplay: {
        delay: 4000,
        disableOnInteraction: false,
    },
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

