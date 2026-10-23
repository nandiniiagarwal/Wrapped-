// Initial Track List
let tracks = [
  {
    title: "Ambient Horizon",
    artist: "Soundscape",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80"
  },
  {
    title: "Electric Pulse",
    artist: "Neon Waves",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80"
  },
  {
    title: "Midnight Drive",
    artist: "Retro Synth",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80"
  },
  {
    title: "Acoustic Morning",
    artist: "Timber & Strings",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    cover: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&auto=format&fit=crop&q=80"
  },
  {
    title: "Urban Chillout",
    artist: "Lo-Fi Beats",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&auto=format&fit=crop&q=80"
  },
  {
    title: "Solar Flare",
    artist: "Cosmic Echoes",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80"
  },
  {
    title: "Velvet Groove",
    artist: "Smooth Soul",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=80"
  },
  {
    title: "Deep Focus",
    artist: "Mind Flow",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    cover: "https://images.unsplash.com/photo-1445985543468-39f35d18a483?w=500&auto=format&fit=crop&q=80"
  },
  {
    title: "Sunset Drift",
    artist: "Ocean Drive",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=80"
  },
  {
    title: "Starlight Echo",
    artist: "Astral Journey",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    cover: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=80"
  }
];

let currentTrackIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

// Audio Object
const audio = new Audio();

// DOM Elements
const playBtn = document.getElementById("play-btn");
const playIcon = document.getElementById("play-icon");
const pauseIcon = document.getElementById("pause-icon");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const shuffleBtn = document.getElementById("shuffle-btn");
const repeatBtn = document.getElementById("repeat-btn");

const trackTitle = document.getElementById("track-title");
const trackArtist = document.getElementById("track-artist");
const coverArt = document.getElementById("cover-art");

const seekSlider = document.getElementById("seek-slider");
const currentTimeEl = document.getElementById("current-time");
const totalDurationEl = document.getElementById("total-duration");
const volumeSlider = document.getElementById("volume-slider");

const playlistEl = document.getElementById("playlist");
const playlistCountEl = document.getElementById("playlist-count");
const fileInput = document.getElementById("file-input");

// Initialize Player
function initPlayer() {
  loadTrack(currentTrackIndex);
  renderPlaylist();
  audio.volume = volumeSlider.value / 100;
}

// Load Track Data
function loadTrack(index) {
  currentTrackIndex = index;
  const track = tracks[currentTrackIndex];

  trackTitle.textContent = track.title;
  trackArtist.textContent = track.artist;
  coverArt.src = track.cover;
  audio.src = track.src;

  seekSlider.value = 0;
  currentTimeEl.textContent = "0:00";
  totalDurationEl.textContent = "0:00";

  updatePlaylistUI();
}

// Play/Pause Control
function togglePlay() {
  if (isPlaying) {
    pauseTrack();
  } else {
    playTrack();
  }
}

function playTrack() {
  isPlaying = true;
  audio.play().catch(err => console.log("Playback error:", err));
  playIcon.style.display = "none";
  pauseIcon.style.display = "block";
}

function pauseTrack() {
  isPlaying = false;
  audio.pause();
  playIcon.style.display = "block";
  pauseIcon.style.display = "none";
}

// Next / Prev Track Controls
function nextTrack() {
  if (isShuffle) {
    let randomIndex = Math.floor(Math.random() * tracks.length);
    currentTrackIndex = randomIndex;
  } else {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  }
  loadTrack(currentTrackIndex);
  if (isPlaying) playTrack();
}

function prevTrack() {
  currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
  loadTrack(currentTrackIndex);
  if (isPlaying) playTrack();
}

// Seek Slider Logic
audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    const progress = (audio.currentTime / audio.duration) * 100;
    seekSlider.value = progress;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    totalDurationEl.textContent = formatTime(audio.duration);
  }
});

seekSlider.addEventListener("input", () => {
  if (audio.duration) {
    audio.currentTime = (seekSlider.value / 100) * audio.duration;
  }
});

// Volume Slider Logic
volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value / 100;
});

// Auto Advance Track End
audio.addEventListener("ended", () => {
  if (isRepeat) {
    playTrack();
  } else {
    nextTrack();
  }
});

// Shuffle & Repeat Toggles
shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("active", isShuffle);
});

repeatBtn.addEventListener("click", () => {
  isRepeat = !isRepeat;
  repeatBtn.classList.toggle("active", isRepeat);
});

// Format Seconds to MM:SS
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

// Render Playlist
function renderPlaylist() {
  playlistEl.innerHTML = "";
  playlistCountEl.textContent = `${tracks.length} tracks`;

  tracks.forEach((track, index) => {
    const li = document.createElement("li");
    li.className = `playlist-item ${index === currentTrackIndex ? "active" : ""}`;
    li.innerHTML = `
      <div class="playlist-item-info">
        <div class="playlist-item-title">${track.title}</div>
        <div class="playlist-item-artist">${track.artist}</div>
      </div>
    `;
    li.addEventListener("click", () => {
      loadTrack(index);
      playTrack();
    });
    playlistEl.appendChild(li);
  });
}

function updatePlaylistUI() {
  const items = playlistEl.querySelectorAll(".playlist-item");
  items.forEach((item, idx) => {
    if (idx === currentTrackIndex) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

// Handle Local Audio Uploads
fileInput.addEventListener("change", (e) => {
  const files = Array.from(e.target.files);
  if (files.length === 0) return;

  files.forEach(file => {
    const objectURL = URL.createObjectURL(file);
    tracks.push({
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: "Local Track",
      src: objectURL,
      cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80"
    });
  });

  renderPlaylist();
});

// Event Listeners for Buttons
playBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", nextTrack);
prevBtn.addEventListener("click", prevTrack);

// Run on startup
initPlayer();