// =========================================================================
// 1. LOGIN & SECURITY CONTROLLER
// =========================================================================
let enteredPin = "";
const CORRECT_PIN = "20062021";

function updatePinDisplay() {
  for (let i = 0; i < 8; i++) {
    const dot = document.getElementById(`dot-${i}`);
    if (dot) {
      if (i < enteredPin.length) {
        dot.innerText = enteredPin[i];
        dot.classList.add('bg-primary/40');
      } else {
        dot.innerText = "";
        dot.classList.remove('bg-primary/40');
      }
    }
  }
}

function enterDigit(digit) {
  if (enteredPin.length < 8) {
    enteredPin += digit;
    updatePinDisplay();
  }
}

function clearPin() {
  if (enteredPin.length > 0) {
    enteredPin = enteredPin.slice(0, -1);
    updatePinDisplay();
  }
}

function submitUnlock() {
  const feedback = document.getElementById('unlock-feedback');
  const lockIcon = document.getElementById('lock-icon');
  
  if (enteredPin === CORRECT_PIN) {
    feedback.innerText = "Access Granted! Welcome to your Sanctuary ✨";
    feedback.classList.remove('text-error');
    feedback.classList.add('text-primary');
    lockIcon.innerText = "lock_open";
    
    setTimeout(() => {
      transitionToSanctuary();
    }, 1200);
  } else {
    feedback.innerText = "Incorrect Keycode. Please try again.";
    feedback.classList.remove('text-primary');
    feedback.classList.add('text-error', 'animate-pulse');
    
    setTimeout(() => {
      feedback.classList.remove('animate-pulse');
    }, 1000);
    
    enteredPin = "";
    updatePinDisplay();
  }
}

function playAudioChime() {
  const feedback = document.getElementById('unlock-feedback');
  feedback.innerText = "Playing sweet chime... 🎵";
  feedback.classList.remove('text-error');
  feedback.classList.add('text-primary');
  
  setTimeout(() => {
    if (enteredPin.length === 0) {
      feedback.innerText = "Awaiting your keycode... ✨";
    }
  }, 3000);
}

function transitionToSanctuary() {
  const loginView = document.getElementById('login-view');
  const mainView = document.getElementById('main-view');

  loginView.classList.replace('opacity-100', 'opacity-0');

  setTimeout(() => {
    loginView.classList.add('hidden');
    mainView.classList.remove('hidden');
    void mainView.offsetWidth; 
    mainView.classList.replace('opacity-0', 'opacity-100');
    startSakuraAnimation();
  }, 1000);
}

document.addEventListener('keydown', (e) => {
  const loginView = document.getElementById('login-view');
  if (loginView && !loginView.classList.contains('hidden')) {
    if (e.key >= '0' && e.key <= '9') {
      enterDigit(e.key);
    } else if (e.key === 'Backspace') {
      clearPin();
    } else if (e.key === 'Enter') {
      submitUnlock();
    }
  }
});

// =========================================================================
// 2. REAL HTML5 AUDIO ENGINE & TIMELINE CONTROLLER
// =========================================================================
const audio = new Audio();
let isPlaying = false;
let isLooping = false;
let isDraggingTimeline = false;
let currentTrackIndex = 0;
let activePlayingId = null;
let activePlayingTitle = "APT. (with Bruno Mars)";

let currentVaultCategory = "all";
let currentBtsCategory = "all";
let previousVolume = 1;

// =========================================================================
// 3. TRACK DATABASES (BLACKPINK, BTS, JAPANESE, ENGLISH, BENGALI, HINDI)
// =========================================================================

// --- BLACKPINK TRACKS ---
const blackpinkTracks = [
  { id: 1, title: "Champion", artist: "BLACKPINK", category: "ot4", album: "Official Single", duration: "3:12", file: "music/BLACKPINK/BLACKPINK - ‘Champion’ (Official Audio) - BLACKPINK.mp3" },
  { id: 2, title: "Fxxkboy", artist: "BLACKPINK", category: "ot4", album: "Vault Edition", duration: "3:04", file: "music/BLACKPINK/BLACKPINK - ‘Fxxxboy’ (Official Audio) - BLACKPINK.mp3" },
  { id: 3, title: "GO", artist: "BLACKPINK", category: "ot4", album: "Official Music", duration: "3:18", file: "music/BLACKPINK/BLACKPINK - ‘GO’ M_V - BLACKPINK.mp3" },
  { id: 4, title: "Hard to Love", artist: "BLACKPINK", category: "ot4", album: "BORN PINK", duration: "2:43", file: "music/BLACKPINK/BLACKPINK - ‘Hard to Love’ (Official Audio) - BLACKPINK.mp3" },
  { id: 5, title: "Me and my", artist: "BLACKPINK", category: "ot4", album: "Official Audio", duration: "3:10", file: "music/BLACKPINK/BLACKPINK - ‘Me and my’ (Official Audio) - BLACKPINK.mp3" },
  { id: 6, title: "Pink Venom", artist: "BLACKPINK", category: "ot4", album: "BORN PINK", duration: "3:06", file: "music/BLACKPINK/BLACKPINK - ‘Pink Venom’ M_V - BLACKPINK.mp3" },
  { id: 7, title: "Shut Down", artist: "BLACKPINK", category: "ot4", album: "BORN PINK", duration: "2:55", file: "music/BLACKPINK/BLACKPINK - ‘Shut Down’ M_V - BLACKPINK.mp3" },
  { id: 8, title: "The Happiest Girl", artist: "BLACKPINK", category: "ot4", album: "BORN PINK", duration: "3:42", file: "music/BLACKPINK/BLACKPINK - ‘The Happiest Girl’ (Official Audio) - BLACKPINK.mp3" },
  { id: 9, title: "Typa Girl", artist: "BLACKPINK", category: "ot4", album: "BORN PINK", duration: "2:59", file: "music/BLACKPINK/BLACKPINK - ‘Typa Girl’ (Official Audio) - BLACKPINK.mp3" },
  { id: 10, title: "DDU-DU DDU-DU (뚜두뚜두)", artist: "BLACKPINK", category: "ot4", album: "SQUARE UP", duration: "3:29", file: "music/BLACKPINK/BLACKPINK - ‘뚜두뚜두 (DDU-DU DDU-DU)’ M_V - BLACKPINK.mp3" },
  { id: 11, title: "JUMP (뛰어)", artist: "BLACKPINK", category: "ot4", album: "Vault Edition", duration: "3:15", file: "music/BLACKPINK/BLACKPINK - ‘뛰어(JUMP)’ M_V - BLACKPINK.mp3" },
  { id: 12, title: "How You Like That", artist: "BLACKPINK", category: "ot4", album: "The Album", duration: "3:01", file: "music/BLACKPINK/BLACKPINK - 'How You Like That' DANCE PERFORMANCE VIDEO - BLACKPINK.mp3" },
  { id: 13, title: "Ice Cream (with Selena Gomez)", artist: "BLACKPINK", category: "ot4", album: "The Album", duration: "2:56", file: "music/BLACKPINK/BLACKPINK - 'Ice Cream (with Selena Gomez)' M_V - BLACKPINK.mp3" },
  { id: 14, title: "Kill This Love", artist: "BLACKPINK", category: "ot4", album: "Kill This Love", duration: "3:09", file: "music/BLACKPINK/BLACKPINK - 'Kill This Love' M_V - BLACKPINK.mp3" },
  { id: 15, title: "Lovesick Girls", artist: "BLACKPINK", category: "ot4", album: "The Album", duration: "3:12", file: "music/BLACKPINK/BLACKPINK - 'Lovesick Girls' M_V - BLACKPINK.mp3" },
  { id: 16, title: "STAY", artist: "BLACKPINK", category: "ot4", album: "SQUARE TWO", duration: "3:50", file: "music/BLACKPINK/BLACKPINK - 'STAY' M_V - BLACKPINK.mp3" },
  { id: 17, title: "AS IF IT'S YOUR LAST (마지막처럼)", artist: "BLACKPINK", category: "ot4", album: "Single", duration: "3:33", file: "music/BLACKPINK/BLACKPINK - '마지막처럼 (AS IF IT'S YOUR LAST)' M_V - BLACKPINK.mp3" },
  { id: 18, title: "PLAYING WITH FIRE (불장난)", artist: "BLACKPINK", category: "ot4", album: "SQUARE TWO", duration: "3:17", file: "music/BLACKPINK/BLACKPINK - '불장난 (PLAYING WITH FIRE)' M_V - BLACKPINK.mp3" },
  { id: 19, title: "BOOMBAYAH (붐바야)", artist: "BLACKPINK", category: "ot4", album: "SQUARE ONE", duration: "4:01", file: "music/BLACKPINK/BLACKPINK - '붐바야 (BOOMBAYAH)' M_V - BLACKPINK.mp3" },
  { id: 20, title: "WHISTLE (휘파람)", artist: "BLACKPINK", category: "ot4", album: "SQUARE ONE", duration: "3:32", file: "music/BLACKPINK/BLACKPINK - '휘파람 (WHISTLE)' M_V - BLACKPINK.mp3" },
  { id: 21, title: "You & Me", artist: "JENNIE", category: "jennie", album: "Single", duration: "2:59", file: "music/BLACKPINK/JENNIE - ‘You & Me’ DANCE PERFORMANCE VIDEO - BLACKPINK (1).mp3" },
  { id: 22, title: "You & Me (Performance Mix)", artist: "JENNIE", category: "jennie", album: "Coachella Edition", duration: "3:02", file: "music/BLACKPINK/JENNIE - ‘You & Me’ DANCE PERFORMANCE VIDEO - BLACKPINK.mp3" },
  { id: 23, title: "FALLEN ANGEL", artist: "JENNIE", category: "jennie", album: "JennieRubyJane Era", duration: "3:14", file: "music/BLACKPINK/JENNIE - FALLEN ANGEL (Official Video) - JennieRubyJaneVEVO.mp3" },
  { id: 24, title: "Less than a Lover", artist: "JENNIE", category: "jennie", album: "JennieRubyJane Era", duration: "2:48", file: "music/BLACKPINK/JENNIE - Less than a Lover (Official Video) - JennieRubyJaneVEVO.mp3" },
  { id: 25, title: "like JENNIE", artist: "JENNIE", category: "jennie", album: "JennieRubyJane Era", duration: "3:05", file: "music/BLACKPINK/JENNIE - like JENNIE (Official Video) - JennieRubyJaneVEVO.mp3" },
  { id: 26, title: "Mantra", artist: "JENNIE", category: "jennie", album: "Single", duration: "2:16", file: "music/BLACKPINK/JENNIE - Mantra (Official Video) - JennieRubyJaneEVO.mp3" },
  { id: 27, title: "SOLO", artist: "JENNIE", category: "jennie", album: "SOLO Album", duration: "2:49", file: "music/BLACKPINK/JENNIE - 'SOLO' M_V - BLACKPINK.mp3" },
  { id: 28, title: "Flower (꽃)", artist: "JISOO", category: "jisoo", album: "ME", duration: "2:53", file: "music/BLACKPINK/JISOO - ‘꽃(FLOWER)’ M_V - BLACKPINK.mp3" },
  { id: 29, title: "CLICK", artist: "JISOO", category: "jisoo", album: "Single", duration: "3:08", file: "music/BLACKPINK/JISOO - CLICK (Official MV) - JISOO.mp3" },
  { id: 30, title: "earthquake", artist: "JISOO", category: "jisoo", album: "Single", duration: "2:58", file: "music/BLACKPINK/JISOO - earthquake (Official Music Video) - JISOO.mp3" },
  { id: 31, title: "FUTW (Vixi Solo Version)", artist: "LISA", category: "lisa", album: "LLOUD Era", duration: "3:11", file: "music/BLACKPINK/LISA - FUTW (Vixi Solo Version) (Official Music Video) - LLOUD Official.mp3" },
  { id: 32, title: "LALISA", artist: "LISA", category: "lisa", album: "LALISA", duration: "3:20", file: "music/BLACKPINK/LISA - 'LALISA' M_V - BLACKPINK.mp3" },
  { id: 33, title: "MONEY", artist: "LISA", category: "lisa", album: "LALISA", duration: "2:48", file: "music/BLACKPINK/LISA - 'MONEY' EXCLUSIVE PERFORMANCE VIDEO - BLACKPINK.mp3" },
  { id: 34, title: "NEW WOMAN (feat. Rosalía)", artist: "LISA", category: "lisa", album: "LLOUD Era", duration: "2:59", file: "music/BLACKPINK/LISA - New Woman feat ROSALÍA (Lyric Video) - LLOUD Official.mp3" },
  { id: 35, title: "ROCKSTAR", artist: "LISA", category: "lisa", album: "LLOUD Era", duration: "2:44", file: "music/BLACKPINK/LISA - ROCKSTAR (Official Music Video) - LLOUD Official.mp3" },
  { id: 36, title: "SaWaDiKa", artist: "LISA", category: "lisa", album: "Single", duration: "2:50", file: "music/BLACKPINK/LISA - SaWaDiKa (Official Music Video) - LISAOfficialVEVO.mp3" },
  { id: 37, title: "Gone", artist: "ROSÉ", category: "rose", album: "-R-", duration: "3:27", file: "music/BLACKPINK/ROSÉ - 'Gone' M_V - BLACKPINK.mp3" },
  { id: 38, title: "Messy (From F1® The Movie)", artist: "ROSÉ", category: "rose", album: "Soundtrack", duration: "3:01", file: "music/BLACKPINK/ROSÉ - Messy (From F1® The Movie) [Official Music Video] - ROSÉ.mp3" },
  { id: 39, title: "On The Ground", artist: "ROSÉ", category: "rose", album: "-R-", duration: "2:48", file: "music/BLACKPINK/ROSÉ - 'On The Ground' Dance Performance - BLACKPINK.mp3" },
  { id: 40, title: "toxic till the end", artist: "ROSÉ", category: "rose", album: "rosie", duration: "3:15", file: "music/BLACKPINK/ROSÉ - toxic till the end (OFFICIAL MUSIC VIDEO) - ROSÉ.mp3" },
  { id: 41, title: "APT. (with Bruno Mars)", artist: "ROSÉ & Bruno Mars", category: "rose", album: "rosie", duration: "2:50", file: "music/BLACKPINK/ROSÉ & Bruno Mars - APT. (Official Music Video) - ROSÉ.mp3" }
];

// --- BTS TRACKS ---
const btsTracks = [
  { id: 101, title: "Butter (Special Performance)", artist: "BTS", category: "all", album: "Butter Single", duration: "3:02", file: "music/BLACKPINK/BTS/[CHOREOGRAPHY] BTS (방탄소년단) 'Butter' Special Performance Video - BANGTANTV.mp3" },
  { id: 102, title: "Aliens", artist: "BTS", category: "all", album: "Bangtan Vault", duration: "3:15", file: "music/BLACKPINK/BTS/Aliens - BTS.mp3" },
  { id: 103, title: "Best Of Me (Japanese ver.)", artist: "BTS", category: "all", album: "Face Yourself", duration: "3:47", file: "music/BLACKPINK/BTS/Best Of Me - BTS.mp3" },
  { id: 104, title: "Blue & Grey", artist: "BTS", category: "all", album: "BE", duration: "4:15", file: "music/BLACKPINK/BTS/Blue & Grey - BTS.mp3" },
  { id: 105, title: "Body to Body", artist: "BTS", category: "all", album: "Bangtan Vault", duration: "3:10", file: "music/BLACKPINK/BTS/BTS (방탄소년단) 'Body to Body' (Color Coded Lyrics) - Jaeguchi.mp3" },
  { id: 106, title: "Boy With Luv (Japanese ver.)", artist: "BTS", category: "all", album: "Map of the Soul: 7", duration: "3:51", file: "music/BLACKPINK/BTS/Boy With Luv (Japanese ver.) - BTS.mp3" },
  { id: 107, title: "Le Jazz de", artist: "BTS", category: "all", album: "HYBE Labels Edition", duration: "3:20", file: "music/BLACKPINK/BTS/'Le Jazz de V' Live Clip 2023BTSFESTA - BANGTANTV.mp3" },
  { id: 108, title: "NORMAL", artist: "BTS", category: "all", album: "HYBE Labels Edition", duration: "3:18", file: "music/BLACKPINK/BTS/BTS (방탄소년단) ‘NORMAL’ Official MV - HYBE LABELS.mp3" },
  { id: 109, title: "SWIM", artist: "BTS", category: "all", album: "HYBE Labels Edition", duration: "3:25", file: "music/BLACKPINK/BTS/BTS (방탄소년단) ‘SWIM’ Official MV - HYBE LABELS.mp3" },
  { id: 110, title: "2.0", artist: "BTS", category: "all", album: "HYBE Labels Edition", duration: "3:05", file: "music/BLACKPINK/BTS/BTS (방탄소년단) '2.0' Official MV - HYBE LABELS.mp3" },
  { id: 111, title: "Black Swan", artist: "BTS", category: "all", album: "Map of the Soul: 7", duration: "3:18", file: "music/BLACKPINK/BTS/BTS (방탄소년단) 'Black Swan' Official MV - HYBE LABELS.mp3" },
  { id: 112, title: "DNA", artist: "BTS", category: "all", album: "Love Yourself: Her", duration: "3:43", file: "music/BLACKPINK/BTS/DNA - BTS.mp3" },
  { id: 113, title: "Dynamite (AGT 2020 Live)", artist: "BTS", category: "all", album: "Special Stage", duration: "3:21", file: "music/BLACKPINK/BTS/BTS (방탄소년단) 'Dynamite'  America's Got Talent 2020 - BANGTANTV.mp3" },
  { id: 114, title: "EPILOGUE: Young Forever", artist: "BTS", category: "all", album: "Young Forever", duration: "3:25", file: "music/BLACKPINK/BTS/BTS (방탄소년단) 'EPILOGUE  Young Forever' Official MV - HYBE LABELS.mp3" },
  { id: 115, title: "Film out", artist: "BTS", category: "all", album: "BTS, THE BEST", duration: "3:34", file: "music/BLACKPINK/BTS/BTS (방탄소년단) 'Film out' Official MV - HYBE LABELS.mp3" },
  { id: 116, title: "Hooligan", artist: "BTS", category: "all", album: "HYBE Labels Edition", duration: "3:12", file: "music/BLACKPINK/BTS/BTS (방탄소년단) 'Hooligan' Official MV - HYBE LABELS.mp3" },
  { id: 117, title: "IDOL", artist: "BTS", category: "all", album: "Love Yourself: Answer", duration: "3:43", file: "music/BLACKPINK/BTS/BTS (방탄소년단) 'IDOL' Official MV - HYBE LABELS.mp3" },
  { id: 118, title: "Life Goes On (In the forest)", artist: "BTS", category: "all", album: "BE Special", duration: "3:27", file: "music/BLACKPINK/BTS/BTS (방탄소년단) 'Life Goes On' Official MV  in the forest - HYBE LABELS.mp3" },
  { id: 119, title: "Epiphany", artist: "Jin (BTS)", category: "all", album: "Love Yourself: Answer", duration: "4:00", file: "music/BLACKPINK/BTS/BTS (방탄소년단) LOVE YOURSELF 結 Answer 'Epiphany' Comeback Trailer - HYBE LABELS.mp3" },
  { id: 120, title: "Stay Gold", artist: "BTS", category: "all", album: "Map of the Soul: 7 ~The Journey~", duration: "4:03", file: "music/BLACKPINK/BTS/BTS (방탄소년단) 'Stay Gold' Official MV - HYBE LABELS.mp3" },
  { id: 121, title: "Sweet Night", artist: "V (BTS)", category: "v", album: "Itaewon Class OST", duration: "3:34", file: "music/BLACKPINK/BTS/BTS (방탄소년단) V 'Sweet Night' MV - elisssa.mp3" },
  { id: 122, title: "Yet To Come (The Most Beautiful Moment)", artist: "BTS", category: "all", album: "Proof", duration: "3:13", file: "music/BLACKPINK/BTS/BTS (방탄소년단) 'Yet To Come (The Most Beautiful Moment)' Official MV - HYBE LABELS.mp3" },
  { id: 123, title: "Blood Sweat & Tears (피 땀 눈물)", artist: "BTS", category: "all", album: "WINGS", duration: "3:37", file: "music/BLACKPINK/BTS/BTS (방탄소년단) '피 땀 눈물 (Blood Sweat & Tears)' Official MV - HYBE LABELS.mp3" },
  { id: 124, title: "Lights", artist: "BTS", category: "all", album: "Lights / Boy With Luv", duration: "4:52", file: "music/BLACKPINK/BTS/BTS 'Lights' Official MV - UNIVERSAL MUSIC JAPAN.mp3" },
  { id: 125, title: "Dionysus (Japanese ver.)", artist: "BTS", category: "all", album: "Map of the Soul: 7", duration: "4:08", file: "music/BLACKPINK/BTS/BTS - Dionysus (방탄소년단 - Dionysus) [Color Coded Lyrics_Han_Rom_Eng_가사] - Lemoring.mp3" },
  { id: 126, title: "Don't Leave Me", artist: "BTS", category: "all", album: "Face Yourself", duration: "3:47", file: "music/BLACKPINK/BTS/Don't Leave Me - BTS.mp3" },
  { id: 127, title: "Falling (Harry Styles Cover)", artist: "Jung Kook (BTS)", category: "all", album: "Covers Collection", duration: "3:58", file: "music/BLACKPINK/BTS/Falling (Original Song Harry Styles) by JK of BTS - BANGTANTV.mp3" },
  { id: 128, title: "FYA", artist: "BTS", category: "all", album: "Bangtan Vault", duration: "3:14", file: "music/BLACKPINK/BTS/FYA - BTS.mp3" },
  { id: 129, title: "Go Go (Japanese ver.)", artist: "BTS", category: "all", album: "Face Yourself", duration: "3:55", file: "music/BLACKPINK/BTS/Go Go (Japanese ver.) - BTS.mp3" },
  { id: 130, title: "Into the Sun", artist: "BTS", category: "all", album: "Bangtan Vault", duration: "3:22", file: "music/BLACKPINK/BTS/Into the Sun - BTS.mp3" },
  { id: 131, title: "Like Animals", artist: "BTS", category: "all", album: "Bangtan Vault", duration: "3:08", file: "music/BLACKPINK/BTS/Like Animals - BTS.mp3" },
  { id: 132, title: "Make It Right (Japanese ver.)", artist: "BTS", category: "all", album: "Map of the Soul: 7", duration: "3:45", file: "music/BLACKPINK/BTS/Make It Right (Japanese ver.) - BTS.mp3" },
  { id: 133, title: "One More Night", artist: "BTS", category: "all", album: "Bangtan Vault", duration: "3:18", file: "music/BLACKPINK/BTS/One More Night - BTS.mp3" },
  { id: 134, title: "FRI(END)S", artist: "V (BTS)", category: "v", album: "Single", duration: "2:28", file: "music/BLACKPINK/BTS/V ‘FRI(END)S’ Official MV - HYBE LABELS.mp3" },
  { id: 135, title: "Blue", artist: "V (BTS)", category: "v", album: "Layover", duration: "2:29", file: "music/BLACKPINK/BTS/V 'Blue'  NAVER NPOP - BANGTANTV.mp3" },
  { id: 136, title: "For Us", artist: "V (BTS)", category: "v", album: "Layover", duration: "2:51", file: "music/BLACKPINK/BTS/V 'For Us' Official MV - HYBE LABELS.mp3" },
  { id: 137, title: "Love Me Again", artist: "V (BTS)", category: "v", album: "Layover", duration: "3:02", file: "music/BLACKPINK/BTS/V 'Love Me Again' Official MV - HYBE LABELS.mp3" },
  { id: 138, title: "Rainy Days", artist: "V (BTS)", category: "v", album: "Layover", duration: "2:59", file: "music/BLACKPINK/BTS/V 'Rainy Days' Official MV - HYBE LABELS.mp3" },
  { id: 139, title: "Winter Bear", artist: "V (BTS)", category: "v", album: "SoundCloud Release", duration: "2:24", file: "music/BLACKPINK/BTS/Winter Bear by V - BANGTANTV.mp3" },
  { id: 140, title: "Hate You", artist: "Jung Kook (BTS)", category: "all", album: "GOLDEN", duration: "2:34", file: "music/BLACKPINK/BTS/Jungkook Hate You Lyrics - Lemonade.mp3" },
  { id: 141, title: "The Astronaut", artist: "Jin (BTS)", category: "all", album: "Single", duration: "4:42", file: "music/BLACKPINK/BTS/진 (Jin) 'The Astronaut' Official MV - HYBE LABELS.mp3" }
];

// --- JAPANESE TRACKS (NEW) ---
const japaneseTracks = [
  { id: 601, title: "Amu to Imu no Uta", artist: "gryanxyouth", album: "Nobita and the New Steel Troops", duration: "4:00", file: "music/JAPANESE/『Amu to Imu no Uta _ アムとイムの歌』 Lyrics [Rom] Song from Doraemon Nobita and the New Steel Troops - gryanxyouth.mp3" },
  { id: 602, title: "Anata no Koibito ni Naritai", artist: "ChoQMay", album: "Single", duration: "3:30", file: "music/JAPANESE/『貴方の恋人になりたい』Music Video ／ チョーキューメイ - チョーキューメイ.mp3" },
  { id: 603, title: "NIGHT DANCER", artist: "imase", album: "Single", duration: "3:15", file: "music/JAPANESE/【imase】NIGHT DANCER（MV） - imase.mp3" },
  { id: 604, title: "Touhikou", artist: "imase", album: "Single", duration: "3:20", file: "music/JAPANESE/【imase】逃避行（MV） - imase.mp3" },
  { id: 605, title: "Bling-Bang-Bang-Born", artist: "Creepy Nuts", album: "MASHLE", duration: "2:50", file: "music/JAPANESE/Creepy Nuts｢Bling-Bang-Bang-Born｣ × TV Anime｢マッシュル-MASHLE-｣ Collaboration Music Video #BBBBダンス - Creepy Nuts.mp3" },
  { id: 606, title: "Uchiage Hanabi", artist: "DAOKO x Kenshi Yonezu", album: "Single", duration: "4:49", file: "music/JAPANESE/DAOKO × 米津玄師『打上花火』MUSIC VIDEO - daoko_jp.mp3" },
  { id: 607, title: "Akeboshi", artist: "LiSA", album: "Demon Slayer", duration: "4:05", file: "music/JAPANESE/Demon Slayer Mugen Train Opening (Full) -Akeboshi- Lyrics - ZEN.mp3" },
  { id: 608, title: "Dragon Night", artist: "SEKAI NO OWARI", album: "Dragon Night", duration: "3:49", file: "music/JAPANESE/Dragon Night - SEKAI NO OWARI.mp3" },
  { id: 609, title: "Grand Escape", artist: "RADWIMPS", album: "Weathering With You", duration: "5:38", file: "music/JAPANESE/Grand Escape  A Weathering With You AMV - Tranquility.mp3" },
  { id: 610, title: "SPECIALZ", artist: "King Gnu", album: "Jujutsu Kaisen", duration: "3:58", file: "music/JAPANESE/King Gnu - SPECIALZ - King Gnu official YouTube channel.mp3" },
  { id: 611, title: "Gurenge", artist: "LiSA", album: "Demon Slayer", duration: "3:58", file: "music/JAPANESE/LiSA - Gurenge (Demon Slayer Kimetsu no Yaiba OP) [Eng_Rom_漢字 Lyrics] - maxiebaku.mp3" },
  { id: 612, title: "LOVE STORY", artist: "SeyonGod", album: "Genshin Impact", duration: "3:40", file: "music/JAPANESE/LOVE STORY- Genshin Impact [AMV_GMV] - SeyonGod.mp3" },
  { id: 613, title: "Stay With Me", artist: "Miki Matsubara", album: "Club Mix", duration: "5:12", file: "music/JAPANESE/Miki Matsubara - Stay With Me HD (Club Mix) - KAMACHI PEACH.mp3" },
  { id: 614, title: "Nandemonaiya", artist: "RADWIMPS", album: "Your Name.", duration: "5:44", file: "music/JAPANESE/Nandemonaiya - movie ver. - Radwimps.mp3" },
  { id: 615, title: "Propose", artist: "natori", album: "Single", duration: "3:10", file: "music/JAPANESE/natori - Propose - なとり _ natori.mp3" },
  { id: 616, title: "Shounen Ki", artist: "Tetsuya Takeda", album: "Heavens Beat", duration: "4:00", file: "music/JAPANESE/Shounen Ki Lyrics [English & Japanese] - Tetsuya Takeda - Heavens Beat.mp3" },
  { id: 617, title: "Suki Dakara", artist: "Yuika ft. Ren", album: "Single", duration: "3:30", file: "music/JAPANESE/Suki Dakara_好きだから (Duet ver.) by Yuika ft. Ren 【Kan_Rom_Eng Lyrics】 - Takotenshii.mp3" },
  { id: 618, title: "Suzume", artist: "RADWIMPS feat. Toaka", album: "Suzume", duration: "3:58", file: "music/JAPANESE/Suzume (feat. Toaka) - Radwimps.mp3" },
  { id: 619, title: "Bansanka", artist: "tuki.", album: "Single", duration: "3:45", file: "music/JAPANESE/tuki.『晩餐歌』Official Music Video - tuki.(17).mp3" },
  { id: 620, title: "Monster", artist: "YOASOBI", album: "Single", duration: "3:26", file: "music/JAPANESE/YOASOBI「怪物」Official Music Video　(YOASOBI - Monster) - YOASOBI.mp3" },
  { id: 621, title: "Blue Bird", artist: "Ikimonogakari", album: "Single", duration: "3:35", file: "music/JAPANESE/いきものがかり 『ブルーバード』Music Video - いきものがかり.mp3" },
  { id: 622, title: "Sparkle", artist: "RADWIMPS", album: "Your Name.", duration: "6:48", file: "music/JAPANESE/スパークル [original ver.] -Your name. Music Video edition- 予告編 from new album「人間開花」初回盤DVD - RADWIMPS.mp3" },
  { id: 623, title: "Nemuru Machi", artist: "WhaleDontSleep ft. yama", album: "Single", duration: "3:20", file: "music/JAPANESE/ねむるまち (feat. yama) - WhaleDontSleep.mp3" },
  { id: 624, title: "Akuma no Ko", artist: "Ai Higuchi", album: "Attack on Titan", duration: "3:50", file: "music/JAPANESE/ヒグチアイ _ 悪魔の子 (アニメスペシャルVer.)  Ai Higuchi “Akuma no Ko” Anime Special Ver. - ヒグチアイ.mp3" },
  { id: 625, title: "Hana ni Bourei", artist: "Yorushika", album: "Single", duration: "4:00", file: "music/JAPANESE/ヨルシカ - 花に亡霊（OFFICIAL VIDEO） - ヨルシカ _ n-buna Official.mp3" },
  { id: 626, title: "One Voice", artist: "Rokudenashi", album: "Single", duration: "3:45", file: "music/JAPANESE/ロクデナシ「ただ声一つ」_ Rokudenashi - One Voice【Official Music Video】 - ロクデナシ.mp3" },
  { id: 627, title: "Kaikai Kitan", artist: "Eve", album: "Jujutsu Kaisen", duration: "3:40", file: "music/JAPANESE/廻廻奇譚 - Eve MV - Eve.mp3" },
  { id: 628, title: "Baby you", artist: "Yuka", album: "Single", duration: "3:20", file: "music/JAPANESE/有華「Baby you」Music Video(Yuka Ver.) - 有華 Official YouTube Channel.mp3" },
  { id: 629, title: "Young Girl A", artist: "siinamota", album: "Single", duration: "3:30", file: "music/JAPANESE/椎名もた(siinamota) - Young Girl A _ 少女A - U_M_A_A Inc..mp3" },
  { id: 630, title: "Crying for Rain", artist: "Minami", album: "Domestic Girlfriend", duration: "4:15", file: "music/JAPANESE/美波「カワキヲアメク」MV - 美波.mp3" }
];


// --- ENGLISH TRACKS ---
const englishTracks = [
  { id: 201, title: "A Thousand Years", artist: "Christina Perri", album: "Single", duration: "4:45", file: "music/ENGLISH/A Thousand Years - Christina Perri [ Lyrics + Vietsub ] - FinGateway.mp3" },
  { id: 202, title: "Daylight", artist: "David Kushner", album: "Single", duration: "3:32", file: "music/ENGLISH/David Kushner - Daylight (Official Music Video) - DavidKushnerVEVO.mp3" },
  { id: 203, title: "Training Season", artist: "Dua Lipa", album: "Single", duration: "3:29", file: "music/ENGLISH/Dua Lipa - Training Season - LatinHype.mp3" },
  { id: 204, title: "Perfect", artist: "Ed Sheeran", album: "Single", duration: "4:23", file: "music/ENGLISH/Ed Sheeran - Perfect (Lyrics) - 7clouds.mp3" },
  { id: 205, title: "Can't Help Falling In Love", artist: "Elvis Presley", album: "Single", duration: "3:02", file: "music/ENGLISH/Elvis Presley — Can't Help Falling In Love [Sub. Español] - armxndo.mp3" },
  { id: 206, title: "I Think They Call This Love", artist: "Matthew Ifield", album: "Single", duration: "2:50", file: "music/ENGLISH/I Think They Call This Love - Matthew Ifield [Sub español + Eng] Official Video - IMAGINA si....mp3" },
  { id: 207, title: "I Wanna Be Yours", artist: "Arctic Monkeys", album: "Single", duration: "3:04", file: "music/ENGLISH/I wanna be yours - arctic monkeys - 𝙊𝙝𝙚𝙚 𝙘𝙧𝙚𝙖𝙩𝙞𝙤𝙣.mp3" },
  { id: 208, title: "her", artist: "JVKE", album: "Single", duration: "2:45", file: "music/ENGLISH/JVKE - her (official lyric video) - JVKE.mp3" },
  { id: 209, title: "Die With A Smile", artist: "Lady Gaga, Bruno Mars", album: "Single", duration: "4:11", file: "music/ENGLISH/Lady Gaga, Bruno Mars - Die With A Smile (Official Music Video) - LadyGagaVEVO.mp3" },
  { id: 210, title: "Summertime Sadness", artist: "Lana Del Rey", album: "Single", duration: "4:25", file: "music/ENGLISH/Lana Del Rey - Summertime Sadness (Official Music Video) - LanaDelReyVEVO.mp3" },
  { id: 211, title: "The Night We Met", artist: "Lord Huron", album: "Single", duration: "3:28", file: "music/ENGLISH/Lord Huron - The Night We Met (Lyrics) - Vibe Music.mp3" },
  { id: 212, title: "Co2", artist: "Prateek Kuhad", album: "Single", duration: "3:05", file: "music/ENGLISH/Prateek Kuhad - Co2 (Official Audio) - Prateek Kuhad.mp3" },
  { id: 213, title: "Espresso", artist: "Sabrina Carpenter", album: "Single", duration: "2:55", file: "music/ENGLISH/Sabrina Carpenter - Espresso - LatinHype.mp3" },
  { id: 214, title: "Snowman", artist: "Sia", album: "Single", duration: "2:45", file: "music/ENGLISH/Sia - Snowman [Official Video] - Sia.mp3" },
  { id: 215, title: "Until I Found You", artist: "Stephen Sanchez", album: "Single", duration: "2:57", file: "music/ENGLISH/Stephen Sanchez, Em Beihold - Until I Found You (Lyrics)(I would never fall in love again) - Alpha Noise.mp3" },
  { id: 216, title: "Delicate", artist: "Taylor Swift", album: "Single", duration: "3:52", file: "music/ENGLISH/Taylor Swift - Delicate - Taylor Swift.mp3" },
  { id: 217, title: "I Knew It, I Knew You", artist: "Taylor Swift", album: "Single", duration: "3:20", file: "music/ENGLISH/Taylor Swift - I Knew It, I Knew You (Piano Version) (Official Music Video) - Taylor Swift.mp3" },
  { id: 218, title: "Lover", artist: "Taylor Swift", album: "Single", duration: "3:41", file: "music/ENGLISH/Taylor Swift - Lover (Official Music Video) - Taylor Swift.mp3" },
  { id: 219, title: "The Way I Loved You", artist: "Taylor Swift", album: "Single", duration: "4:03", file: "music/ENGLISH/Taylor Swift - The Way I Loved You (Taylor's Version) (Lyric Video) - Taylor Swift.mp3" },
  { id: 220, title: "I Love You So", artist: "The Walters", album: "Single", duration: "2:40", file: "music/ENGLISH/The Walters - I Love You So - the guy who edits.mp3" },
  { id: 221, title: "blue", artist: "yung kai", album: "Single", duration: "2:25", file: "music/ENGLISH/yung kai - blue (official music video) - yung kai.mp3" }
];

// --- BENGALI TRACKS ---
const bengaliTracks = [
  { id: 301, title: "Aalote Chol", artist: "Srikanto", album: "Single", duration: "4:15", file: "music/BENGALI/Aalote Chol - Lyrical (আলোতে চল)  Srikanto  Rishav - Sohini  Debayan  Anis  Pralay  SVF Music - SVF Music.mp3" },
  { id: 302, title: "Amake Nao", artist: "Srikanto", album: "Single", duration: "3:45", file: "music/BENGALI/Amake Nao(আমাকে নাও)Srikanto Angana-Sukrit-Rishav-Sohini Debayan,Pralay,Jyoti Hoichoi SVF Music - SVF Music.mp3" },
  { id: 303, title: "Baundule Ghuri", artist: "Dawshom Awbotaar", album: "Single", duration: "4:20", file: "music/BENGALI/Baundule Ghuri (বাউন্ডুলে ঘুড়ি)Dawshom Awbotaar  Jaya, Anirban  Arijit, Shreya, Anupam SVF Music - SVF Music.mp3" },
  { id: 304, title: "Behaya", artist: "Ekannoborti", album: "Single", duration: "3:50", file: "music/BENGALI/Behaya (বেহায়া)-Lyrical  Ekannoborti  Lagnajita  Prasener Dolbol  Mainak SVF Music - SVF Music.mp3" },
  { id: 305, title: "Bhalobasha Jaari Achhey", artist: "Talmar Romeo Juliet", album: "Single", duration: "4:10", file: "music/BENGALI/Bhalobasha Jaari Achhey  Talmar Romeo Juliet  Debdutta,Hiya  Anirban,Debraj,Surangana  SVF Music - SVF Music.mp3" },
  { id: 306, title: "Bhalobashar Morshum", artist: "X=Prem", album: "Single", duration: "3:38", file: "music/BENGALI/Bhalobashar Morshum (ভালবাসার মরশুম)  XPrem  Shreya Ghoshal  Sanai  Srijit  SVF - SVF.mp3" },
  { id: 307, title: "Darale Duaarey", artist: "Coke Studio Bangla", album: "Single", duration: "4:30", file: "music/BENGALI/Darale Duaarey  Coke Studio Bangla  Season 2  Nandita X Ishaan - Coke Studio Bangla.mp3" },
  { id: 308, title: "Du Haatey Mutho Bhorey", artist: "Talmar Romeo Juliet", album: "Single", duration: "3:55", file: "music/BENGALI/Du Haatey Mutho Bhorey  Talmar Romeo Juliet Debdutta, Hiya, Debraj, Subhadeep, Nilanjan SVF Music - SVF Music.mp3" },
  { id: 309, title: "Egiye de (Reprise)", artist: "Shudhu Tomari Jonyo", album: "Single", duration: "4:05", file: "music/BENGALI/Egiye de (Reprise)  Shudhu Tomari Jonyo  Arijit  Dev  Srabanti  Mimi  Soham  SVF - SVF.mp3" },
  { id: 310, title: "EI MAYABI CHANDER RAATE", artist: "Baba Baby O", album: "Single", duration: "3:48", file: "music/BENGALI/EI MAYABI CHANDER RAATE এই মায়াবী চাঁদের রাতে Baba Baby O - Jisshu, Solanki, Chamok Hasan, Bengali - Times Music Bangla.mp3" },
  { id: 311, title: "Ek Minute Er Chumu", artist: "Hooligaanism", album: "Single", duration: "3:25", file: "music/BENGALI/Ek Minute Er Chumu (এক মিনিটের চুমু) - Lyrical Version  Debraj,Anirban,Subhadeep  Hooligaanism - HooliGaanism.mp3" },
  { id: 312, title: "Ekhon Onek Raat", artist: "Hemlock Society", album: "Single", duration: "4:12", file: "music/BENGALI/Ekhon Onek Raat (এখন অনেক রাত)  Lyrical  Hemlock Society  Anupam  Parambrata  Koel  SVF Music - SVF Music.mp3" },
  { id: 313, title: "Gulbahar", artist: "Ishaan", album: "Single", duration: "3:35", file: "music/BENGALI/Gulbahar  গুলবাহার  Ishaan এর Gaan  Shuvendu Das Shuvo  Official Music Video - Ishaan এর Gaan.mp3" },
  { id: 314, title: "Hridoyer Rong", artist: "Ghare And Baire", album: "Single", duration: "4:00", file: "music/BENGALI/Hridoyer Rong  Ghare And Baire  Jisshu  Koel  Anupam Roy  Lagnajita  Mainak Bhaumik - Surinder  Films.mp3" },
  { id: 315, title: "Jawl Phoring", artist: "Hemlock Society", album: "Single", duration: "4:18", file: "music/BENGALI/Jawl Phoring ( জল ফড়িং )  Hemlock Society  Parambrata  Koel  Silajit  Anupam  Srijit  SVF - SVF.mp3" },
  { id: 316, title: "Je Kawta Din", artist: "Dwitiyo Purush", album: "Single", duration: "3:58", file: "music/BENGALI/Je Kawta Din ( যে কটা দিন ) - Reprise  Dwitiyo Purush  Anupam Roy  Iman Chakraborty  SVF Music - SVF Music.mp3" },
  { id: 317, title: "Jodi Abar", artist: "Angel Noor", album: "Single", duration: "4:22", file: "music/BENGALI/Jodi Abar ( যদি আবার ) OFFICIAL MUSIC VIDEO  Angel Noor Bangla new song 2024. - Angel Noor.mp3" },
  { id: 318, title: "Laal Rong", artist: "Talmar Romeo Juliet", album: "Single", duration: "3:40", file: "music/BENGALI/Laal Rong (লাল রং)  Talmar Romeo Juliet  Debdutta, Hiya, Anirban, Debayan, Debraj  SVF Music - SVF Music.mp3" },
  { id: 319, title: "Long Distance Love", artist: "Coke Studio Bangla", album: "Single", duration: "3:55", file: "music/BENGALI/Long Distance Love  Coke Studio Bangla  Season 3  Ankan X Afrin  Shuvendu - Coke Studio Bangla.mp3" },
  { id: 320, title: "Notun Premer Gaan", artist: "Ballabhpurer Roopkotha", album: "Single", duration: "4:10", file: "music/BENGALI/Notun Premer Gaan (From Ballabhpurer Roopkotha) - Debraj Bhattacharya.mp3" },
  { id: 321, title: "Ogochhalo Mon", artist: "Taalpatar Shepai", album: "Single", duration: "3:33", file: "music/BENGALI/Ogochhalo Mon (From Turu Love) - Taalpatar Shepai.mp3" },
  { id: 322, title: "Oviman", artist: "Tanveer Evan", album: "Single", duration: "4:05", file: "music/BENGALI/Oviman  অভিমান  Tanveer Evan  Piran Khan  Jovan  Mehazabien  Best Friend 3 Drama Song - CD Choice.mp3" },
  { id: 323, title: "Preme Pora Baron", artist: "Sweater", album: "Single", duration: "4:15", file: "music/BENGALI/Preme Pora Baron  Full Song  Sweater  Ishaa  Lagnajita  Bengali Movie 2019 - Pluto Music.mp3" },
  { id: 324, title: "Raikamal", artist: "Omorshongi", album: "Single", duration: "3:50", file: "music/BENGALI/Raikamal  Omorshongi  Vikram Chatterjee, Sohini Sarkar  Chakropani Dev  Tamalika Golder Dibya C - Zee Music Bangla.mp3" },
  { id: 325, title: "Shudhu Tomakei Bhalobese", artist: "Nilanjan", album: "Single", duration: "4:02", file: "music/BENGALI/Shudhu Tomakei Bhalobese(শুধু তোমাকেই ভালোবেসে)  Bengali Original Song  Nilanjan, Sudhaborshy - Nilanjan Ghosal.mp3" },
  { id: 326, title: "Shudhu Tomari Jonyo", artist: "Title Track", album: "Single", duration: "4:25", file: "music/BENGALI/Shudhu Tomari Jonyo - Title Track  Dev, Srabanti, Mimi, Soham  Arijit  Shreya  Indraadip  SVF - SVF.mp3" },
  { id: 327, title: "Takey Olpo Kachhe Dakchhi", artist: "Prem Tame", album: "Single", duration: "3:45", file: "music/BENGALI/Takey Olpo Kachhe Dakchhi  Lyrical  Mahtim Soumya, Susmita,Sweta  Shibabrata Anindya SVF Music - SVF Music.mp3" },
  { id: 328, title: "Tomake", artist: "Parineeta", album: "Single", duration: "4:10", file: "music/BENGALI/Tomake  তোমাকে  Parineeta  Arko  Shreya Ghoshal  Subhashree  Ritwick  Raj Chakraborty - RAJ CHAKRABORTY ENTERTAINMENT.mp3" },
  { id: 329, title: "Tomar Pichu Charbo Na", artist: "Nahid Hasan", album: "Single", duration: "3:58", file: "music/BENGALI/Tomar Pichu Charbo Na  Nahid Hasan  Autumnal Moon  Imran Ahmed Saudagar  Loren Mendes - Dhruba Music Station.mp3" },
  { id: 330, title: "Tumi Bristi Cheyecho Bole", artist: "Mahtim Sakib", album: "Single", duration: "4:00", file: "music/BENGALI/Tumi Bristi Cheyecho Bole  ( তুমি বৃষ্টি চেয়েছো বলে )  Mahtim sakib  New Lyrical Song 2024 - ABACUS ORIGINALS.mp3" }
];

// --- BENGALI SPECIAL TRACKS ---
const bengaliSpecialTracks = [
  { id: 401, title: "Tomar Ghore Bosot Kore Koyjona", artist: "Anirban Sur", album: "Special Collection", duration: "3:30", file: "music/BENGALI/Tomar Ghore Bosot Kore Koyjona Anirban Sur  Official Lyrical Video - Anirban Sur.mp3" },
  { id: 402, title: "Ami Chini Go - Rock Version", artist: "Maxim Pictures", album: "Special Collection", duration: "4:00", file: "music/BENGALI/Ami Chini Go - Rock Version  Adda  Soumitra  Saayoni  Sourav  Indrasish  Suvam  Joydeep - Maxim Pictures.mp3" },
  { id: 403, title: "Sraboner Dhara Moto", artist: "Amara Muzik Bengali", album: "Special Collection", duration: "3:45", file: "music/BENGALI/Sraboner Dhara Moto (শ্রাবনের ধারার মতো)  Sraboner Dhara  Audio Song  Jayati  Rabindra Sangeet - Amara Muzik Bengali.mp3" },
  { id: 404, title: "Megh Bolechhe Jabo Jabo", artist: "Somlata", album: "Special Collection", duration: "4:10", file: "music/BENGALI/Megh Bolechhe Jabo Jabo  Somlata Acharyya Chowdhury  Joy Sarkar  Rabindra Sangeet  Music Video - Somlata Acharyya Chowdhury.mp3" },
  { id: 405, title: "Dekhechhi Rupshagore", artist: "SVF Music", album: "Special Collection", duration: "3:20", file: "music/BENGALI/Dekhechhi Rupshagore (দেখেছি রূপসাগরে) - Lyrical  Mahtim,Arindom  Ditipriya,Dibyojyoti  SVF Music - SVF Music.mp3" },
  { id: 406, title: "Majhe Majhe Tobo Dekha Pai", artist: "Mahtim Shakib", album: "Special Collection", duration: "3:55", file: "music/BENGALI/Majhe Majhe Tobo Dekha Pai - Mahtim Shakib.mp3" },
  { id: 407, title: "Sokhi Bhabona Kahare Bole", artist: "T-Series Bangla", album: "Special Collection", duration: "4:20", file: "music/BENGALI/Sokhi Bhabona Kahare Bole সখী ভাবনা কাহারে বলে (Rabindra Sangeet)  Senjuti Das  Sayak Chakraborty - T-Series Bangla.mp3" },
  { id: 408, title: "Bhalobeshe Shokhi", artist: "SVF Music", album: "Special Collection", duration: "3:40", file: "music/BENGALI/Bhalobeshe Shokhi(ভালোবেসে সখী)- Lyrical Somlata Acharyya ChowdhuryArindom RNT Project SVF Music - SVF Music.mp3" },
  { id: 409, title: "Borne gondhe Chande gitite", artist: "Rishi Panda", album: "Special Collection", duration: "3:15", file: "music/BENGALI/Borne gondhe Chande gitite  বর্ণে গন্ধে । Tumi Shudhu Tumi  Rishi Panda cover - Rishi Panda.mp3" },
  { id: 410, title: "Oboseshe", artist: "Chobiigharr", album: "Special Collection", duration: "4:05", file: "music/BENGALI/Oboseshe  Kishmish  অবশেষে  Arijit Singh  Hriday  Sristi  Rahool  Nilayan  Official Video - Chobiigharr.mp3" }
];

// --- HINDI TRACKS ---
const hindiTracks = [
  { id: 501, title: "Pal Pal", artist: "AFUSIC", album: "Single", duration: "3:20", file: "music/HINDI/Afusic - Pal Pal (Official Music Video) Prod. AliSoomroMusic - AFUSIC.mp3" },
  { id: 502, title: "ALAG AASMAAN", artist: "Anuv Jain", album: "Single", duration: "3:45", file: "music/HINDI/Anuv Jain - ALAG AASMAAN (a song on the ukulele) - Anuv Jain.mp3" },
  { id: 503, title: "GUL", artist: "Anuv Jain", album: "Single", duration: "3:10", file: "music/HINDI/Anuv Jain - GUL (Studio) - Anuv Jain.mp3" },
  { id: 504, title: "HUSN", artist: "Anuv Jain", album: "Single", duration: "3:55", file: "music/HINDI/Anuv Jain - HUSN (Official Video) - Anuv Jain.mp3" },
  { id: 505, title: "Arz Kiya Hai", artist: "Anuv Jain, Lost Stories", album: "Single", duration: "4:10", file: "music/HINDI/Anuv Jain X Lost Stories - Arz Kiya Hai (Official Video)  Coke Studio Bharat - Coke Studio India.mp3" },
  { id: 506, title: "Tainu Khabar Nahi", artist: "Arijit Singh", album: "Munjya", duration: "4:30", file: "music/HINDI/Arijit Singh - Tainu Khabar Nahi ❤️ Munjya  Sharvari, Abhay Verma  Sachin-Jigar - Soulful Arijit Singh Songs.mp3" },
  { id: 507, title: "Aaya Na Tu", artist: "Arjun Kanungo, Momina", album: "Single", duration: "4:45", file: "music/HINDI/Arjun Kanungo, Momina Mustehsan - Aaya Na Tu  Kunaal Vermaa - Universal Music India.mp3" },
  { id: 508, title: "Hawa Banke", artist: "Darshan Raval", album: "Single", duration: "3:30", file: "music/HINDI/Darshan Raval - Hawa Banke(Official Video) - DarshanRavalVEVO.mp3" },
  { id: 509, title: "Dil Tu Jaan Tu", artist: "Gurnazar", album: "Single", duration: "4:10", file: "music/HINDI/Dil Tu Jaan Tu (Full Video) Gurnazar Ft. Kritika Yadav  New Punjabi Viral Song  Chet Singh - Jhankar Music Punjabi.mp3" },
  { id: 510, title: "Farq Hai", artist: "Suzonn", album: "Single", duration: "3:40", file: "music/HINDI/Farq Hai - Suzonn (Official Music Video) - Suzonn.mp3" },
  { id: 511, title: "Finding Her", artist: "Tanishka Bahl", album: "Single", duration: "3:25", file: "music/HINDI/Finding Her (Female Version)  Tanishka Bahl  Kushagra  Bharath  Saaheal  UR Debut  New Songs - UR DEBUT.mp3" },
  { id: 512, title: "Hona Tha Pyar", artist: "Atif Aslam", album: "Bol", duration: "4:15", file: "music/HINDI/Hona Tha Pyar Full Video - Bol  Atif Aslam & Mahira Khan  Atif Aslam & Hadiqa Kiani - Music Beats.mp3" },
  { id: 513, title: "Jhol", artist: "Maanu, Annural Khalid", album: "Coke Studio", duration: "3:50", file: "music/HINDI/Jhol  Coke Studio Pakistan  Season 15  Maanu x Annural Khalid - Coke Studio Pakistan.mp3" },
  { id: 514, title: "Kahani Suno 2.0", artist: "Kaifi Khalil", album: "Single", duration: "4:05", file: "music/HINDI/Kaifi Khalil - Kahani Suno 2.0 [Official Music Video] - Kaifi Khalil.mp3" },
  { id: 515, title: "Kalyani", artist: "ARJN, Shreya Ghoshal", album: "Single", duration: "3:40", file: "music/HINDI/KALYANI (with Shreya Ghoshal) OFFICIAL MUSIC VIDEO  ARJN  KDS  FIFTY4  RONN  SHREYA GHOSHAL - King Of Loisingha.mp3" },
  { id: 516, title: "Kashish", artist: "Ashish Bhatia", album: "Single", duration: "3:25", file: "music/HINDI/KASHISH (Official Music Video) Ashish Bhatia  Kashish Ratnani  Omkar Singh - Ashish Bhatia.mp3" },
  { id: 517, title: "Keh Do Na", artist: "Nihal Ahmed", album: "Single", duration: "4:00", file: "music/HINDI/Keh Do Na - Nihal Ahmed ( Official Video ) - Nihal Ahmed.mp3" },
  { id: 518, title: "Tu Aake Dekhle", artist: "King", album: "The Carnival", duration: "3:15", file: "music/HINDI/King - Tu Aake Dekhle  The Carnival  The Last Ride  Prod. by Shahbeatz  Latest Hit Songs 2020 - King.mp3" },
  { id: 519, title: "Maand", artist: "Bayaan, Hasan Raheem", album: "Single", duration: "3:50", file: "music/HINDI/Maand (Lyrics) - Bayaan, Hasan Raheem, Rovalio - seventyskye.mp3" },
  { id: 520, title: "Majboor", artist: "Sheheryar Rehan", album: "Single", duration: "4:20", file: "music/HINDI/MAJBOOR  مجبور - Sheheryar Rehan x Zoha Waseem   Majboor  Audio - ShahStudio.mp3" },
  { id: 521, title: "Nadaaniyan", artist: "Akshath", album: "Single", duration: "3:10", file: "music/HINDI/Nadaaniyan (Official Music Video) Akshath  Aisha Ahmed  Hit Song 2024 - Universal Music India.mp3" },
  { id: 522, title: "Nafrat", artist: "Darshan Raval", album: "Single", duration: "4:15", file: "music/HINDI/Nafrat Official Music Video  Darshan Raval  Sandipa D  Akshay K  Naushad Khan  Indie Music - Indie Music Label.mp3" },
  { id: 523, title: "Aarzu", artist: "Noor, Khan, Madhurxo", album: "Single", duration: "3:40", file: "music/HINDI/Noor, Khan, Madhurxo - Aarzu (Official Music Video) - Noor.mp3" },
  { id: 524, title: "O Meri Laila", artist: "Atif Aslam, Jyotica", album: "Laila Majnu", duration: "4:25", file: "music/HINDI/O Meri Laila - Lyrical  Laila Majnu  Jyotica Tangri  Avinash Tiwary & Tripti Dimri - Dance Masti Hits.mp3" },
  { id: 525, title: "Dooron Dooron", artist: "Paresh Pahuja", album: "Live", duration: "3:50", file: "music/HINDI/Paresh Pahuja - Dooron Dooron (Live from The Voice Notes Concert) - Paresh Pahuja.mp3" },
  { id: 526, title: "Saari Ki Saari 2.0", artist: "Darshan Raval, Asees Kaur", album: "Single", duration: "4:10", file: "music/HINDI/Saari Ki Saari 2.0 - Darshan Raval  Official Video  Asees Kaur  Lijo George  Naushad Khan - Indie Music Label.mp3" },
  { id: 527, title: "Sajna", artist: "Darshan Raval", album: "Single", duration: "3:45", file: "music/HINDI/Sajna - Darshan Raval, Dharal Surelia (Official Video) - DarshanRavalDZ.mp3" },
  { id: 528, title: "Tera Zikr", artist: "Darshan Raval", album: "Single", duration: "3:30", file: "music/HINDI/Tera Zikr - Darshan Raval  Official Video - Latest New Hit Song - Sony Music India.mp3" },
  { id: 529, title: "Teri Aankhon Mein", artist: "Darshan R, Neha K", album: "Single", duration: "4:15", file: "music/HINDI/Teri Aankhon Mein (LYRICAL) Divya K  Darshan R, Neha K Pearl V Manan B  Radhika, Vinay Bhushan K - T-Series.mp3" },
  { id: 530, title: "Maahiya", artist: "Tushar Joshi, Neeti Mohan", album: "The Revolutionaries", duration: "3:45", file: "music/HINDI/The Revolutionaries Maahiya (Song)  Rohit Saraf,Pratibha Ranta Akashdeep,Tushar Joshi,Neeti Mohan - T-Series.mp3" },
  { id: 531, title: "Tum Ho Toh", artist: "Vishal Mishra", album: "Saiyaara", duration: "4:10", file: "music/HINDI/Tum Ho Toh Song  Saiyaara  Ahaan Panday, Aneet Padda  Vishal Mishra, Hansika Pareek  Raj Shekhar - YRF.mp3" },
  { id: 532, title: "Vaaroon Forever", artist: "Shreya Ghoshal", album: "Mirzapur The Movie", duration: "4:35", file: "music/HINDI/Vaaroon Forever (Official Video)  Mirzapur The Movie  Shreya Ghoshal  Romy  Anand B  Ginny D - Excel Movies.mp3" }
];

const masterPlaylist = [
  ...blackpinkTracks,
  ...btsTracks,
  ...japaneseTracks,
  ...englishTracks,
  ...bengaliTracks,
  ...bengaliSpecialTracks,
  ...hindiTracks
];

let activePlaylist = masterPlaylist; 

// =========================================================================
// 4. MUSIC CONTROLS & LOGIC
// =========================================================================
function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function showFileNotice(message) {
  let notice = document.getElementById('audio-toast-notice');
  if (!notice) {
    notice = document.createElement('div');
    notice.id = 'audio-toast-notice';
    notice.className = 'fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-4 py-2.5 rounded-full bg-red-950/90 text-red-200 border border-red-500/40 shadow-2xl text-xs backdrop-blur-xl transition-all duration-300 pointer-events-none';
    document.body.appendChild(notice);
  }
  notice.innerText = message;
  notice.style.opacity = '1';
  setTimeout(() => { notice.style.opacity = '0'; }, 4500);
}

function updatePlaybackUI(playing) {
  isPlaying = playing;

  const dockPlayIcon = document.getElementById('dock-play-icon');
  if (dockPlayIcon) dockPlayIcon.innerText = playing ? 'pause' : 'play_arrow';

  const discCover = document.getElementById('dock-cover');
  if (discCover) {
    if (playing) discCover.classList.remove('paused');
    else discCover.classList.add('paused');
  }

  const vaultBigBtnIcon = document.querySelector('#spotify-vault-modal button[title="Play All"] span');
  if (vaultBigBtnIcon) vaultBigBtnIcon.innerText = playing ? 'pause' : 'play_arrow';

  const btsBigBtnIcon = document.querySelector('#bts-spotify-vault-modal button[title="Play All"] span');
  if (btsBigBtnIcon) btsBigBtnIcon.innerText = playing ? 'pause' : 'play_arrow';
  
  const japaneseBigBtnIcon = document.querySelector('#japanese-spotify-vault-modal button[title="Play All"] span');
  if (japaneseBigBtnIcon) japaneseBigBtnIcon.innerText = playing ? 'pause' : 'play_arrow';
  
  const bengaliSpecialBigBtnIcon = document.querySelector('#bengali-special-vault-modal button[title="Play All"] span');
  if (bengaliSpecialBigBtnIcon) bengaliSpecialBigBtnIcon.innerText = playing ? 'pause' : 'play_arrow';

  renderSpotifyVaultTracks(getFilteredVaultList());
  renderBtsVaultTracks(getFilteredBtsVaultList());
  renderJapaneseVaultTracks(getFilteredJapaneseVaultList());
  renderBengaliSpecialTracks();
}

function handleUniversalTrackClick(trackId, trackList) {
  const track = trackList.find(t => t.id === trackId);
  if (!track) return;

  if (activePlayingId === track.id) {
    if (!audio.paused) {
      audio.pause();
      updatePlaybackUI(false);
    } else {
      audio.play().then(() => updatePlaybackUI(true)).catch(() => updatePlaybackUI(false));
    }
    return;
  }

  activePlaylist = trackList; 
  playAudioTrack(track.title, track.artist, track.album, track.file, track.id);
}

function playAudioTrack(title, artist, album, filePath = null, trackId = null) {
  activePlayingTitle = title;
  activePlayingId = trackId;

  let foundInActiveIndex = activePlaylist.findIndex(t => t.title.toLowerCase().trim() === title.toLowerCase().trim());
  
  if (foundInActiveIndex !== -1) {
    currentTrackIndex = foundInActiveIndex;
  } else {
    if (englishTracks.some(t => t.title.toLowerCase() === title.toLowerCase())) activePlaylist = englishTracks;
    else if (bengaliTracks.some(t => t.title.toLowerCase() === title.toLowerCase())) activePlaylist = bengaliTracks;
    else if (japaneseTracks.some(t => t.title.toLowerCase() === title.toLowerCase())) activePlaylist = japaneseTracks;
    else if (hindiTracks.some(t => t.title.toLowerCase() === title.toLowerCase())) activePlaylist = hindiTracks;
    else if (bengaliSpecialTracks.some(t => t.title.toLowerCase() === title.toLowerCase())) activePlaylist = bengaliSpecialTracks;
    else activePlaylist = masterPlaylist;
    
    currentTrackIndex = activePlaylist.findIndex(t => t.title.toLowerCase().trim() === title.toLowerCase().trim());
    if (currentTrackIndex === -1) currentTrackIndex = 0; 
  }

  let foundTrack = activePlaylist[currentTrackIndex] || masterPlaylist.find(t => t.title.toLowerCase().trim() === title.toLowerCase().trim());
  let targetFile = filePath || (foundTrack ? foundTrack.file : null);
  
  if (!activePlayingId && foundTrack && foundTrack.id) activePlayingId = foundTrack.id;

  const dockTitle = document.getElementById('dock-title');
  const dockArtist = document.getElementById('dock-artist');
  if (dockTitle && dockArtist) {
    dockTitle.innerText = title;
    dockArtist.innerText = `${artist} • ${album}`;
  }

  const totalDurationEl = document.getElementById('total-duration');
  if (totalDurationEl && foundTrack && foundTrack.duration) {
    totalDurationEl.innerText = foundTrack.duration;
  }

  if (targetFile) {
    audio.src = encodeURI(targetFile).replace(/#/g, '%23');
    audio.play().then(() => {
      updatePlaybackUI(true);
    }).catch(err => {
      console.error("Playback error:", targetFile, err);
      showFileNotice(`⚠️ File not found at: ${targetFile}`);
      updatePlaybackUI(true);
    });
  }
}

function playSection(sectionName) {
  let list = [];
  if (sectionName === 'english') list = englishTracks;
  if (sectionName === 'bengali') list = bengaliTracks;
  if (sectionName === 'hindi') list = hindiTracks;
  
  if (list.length > 0) {
    activePlaylist = list;
    currentTrackIndex = 0;
    const track = list[currentTrackIndex];
    playAudioTrack(track.title, track.artist, track.album, track.file, track.id);
  }
}

function shuffleSection(sectionName) {
  let list = [];
  if (sectionName === 'english') list = englishTracks;
  if (sectionName === 'bengali') list = bengaliTracks;
  if (sectionName === 'hindi') list = hindiTracks;
  
  if (list.length > 0) {
    activePlaylist = list;
    const randomIndex = Math.floor(Math.random() * list.length);
    currentTrackIndex = randomIndex;
    const track = list[currentTrackIndex];
    playAudioTrack(track.title, track.artist, track.album, track.file, track.id);
  }
}

function togglePlayState() {
  if (audio.paused) {
    if (!audio.src) {
      handleUniversalTrackClick(1, blackpinkTracks);
      return;
    }
    audio.play().then(() => updatePlaybackUI(true)).catch(() => showFileNotice("Please select a song first!"));
  } else {
    audio.pause();
    updatePlaybackUI(false);
  }
}

function changeTrack(direction) {
  if (!activePlaylist || activePlaylist.length === 0) activePlaylist = masterPlaylist;
  currentTrackIndex = (currentTrackIndex + direction + activePlaylist.length) % activePlaylist.length;
  const nextTrack = activePlaylist[currentTrackIndex];
  playAudioTrack(nextTrack.title, nextTrack.artist, nextTrack.album, nextTrack.file, nextTrack.id || null);
}

function shuffleCurrentPlaylist() {
  if (!activePlaylist || activePlaylist.length === 0) activePlaylist = masterPlaylist;
  const randomIndex = Math.floor(Math.random() * activePlaylist.length);
  currentTrackIndex = randomIndex;
  const track = activePlaylist[currentTrackIndex];
  playAudioTrack(track.title, track.artist, track.album, track.file, track.id || null);
}

function toggleRepeat() {
  isLooping = !isLooping;
  audio.loop = isLooping;
  const repeatBtn = document.getElementById('repeat-btn');
  if (repeatBtn) {
    if (isLooping) {
      repeatBtn.classList.add('text-primary');
      repeatBtn.classList.remove('text-on-surface-variant');
    } else {
      repeatBtn.classList.remove('text-primary');
      repeatBtn.classList.add('text-on-surface-variant');
    }
  }
}

audio.addEventListener('ended', () => { if (!isLooping) changeTrack(1); });

audio.addEventListener('loadedmetadata', () => {
  const totalDurationEl = document.getElementById('total-duration');
  if (totalDurationEl && audio.duration) {
    totalDurationEl.innerText = formatTime(audio.duration);
  }
});

audio.addEventListener('timeupdate', () => {
  if (audio.duration && !isDraggingTimeline) {
    const currentTimeEl = document.getElementById('current-time');
    const totalDurationEl = document.getElementById('total-duration');
    const timelineSlider = document.getElementById('timeline-slider');

    if (currentTimeEl) currentTimeEl.innerText = formatTime(audio.currentTime);
    if (totalDurationEl && !isNaN(audio.duration)) totalDurationEl.innerText = formatTime(audio.duration);
    
    if (timelineSlider) {
      const progressPercent = (audio.currentTime / audio.duration) * 100;
      timelineSlider.value = progressPercent;
      timelineSlider.style.background = `linear-gradient(to right, #ffcbe2 ${progressPercent}%, rgba(60, 48, 68, 0.8) ${progressPercent}%)`;
    }
  }
});

// =========================================================================
// 5. DRAGGABLE TIMELINE & VOLUME
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
  const timelineSlider = document.getElementById('timeline-slider');
  const currentTimeEl = document.getElementById('current-time');
  const volumeSlider = document.getElementById('volume-slider');
  const volumeIcon = document.getElementById('volume-icon');

  if (timelineSlider) {
    timelineSlider.addEventListener('input', (e) => {
      isDraggingTimeline = true;
      const seekPercent = e.target.value;
      if (audio.duration) {
        const seekTime = (seekPercent / 100) * audio.duration;
        if (currentTimeEl) currentTimeEl.innerText = formatTime(seekTime);
        timelineSlider.style.background = `linear-gradient(to right, #ffcbe2 ${seekPercent}%, rgba(60, 48, 68, 0.8) ${seekPercent}%)`;
      }
    });
    timelineSlider.addEventListener('change', (e) => {
      if (audio.duration) {
        const seekPercent = e.target.value;
        audio.currentTime = (seekPercent / 100) * audio.duration;
      }
      isDraggingTimeline = false;
    });
  }

  if (volumeSlider) {
    volumeSlider.style.background = `linear-gradient(to right, #ffcbe2 100%, rgba(60, 48, 68, 0.8) 100%)`;
    volumeSlider.addEventListener('input', (e) => {
      const vol = parseFloat(e.target.value);
      audio.volume = vol;
      const volPercent = vol * 100;
      volumeSlider.style.background = `linear-gradient(to right, #ffcbe2 ${volPercent}%, rgba(60, 48, 68, 0.8) ${volPercent}%)`;
      
      if (volumeIcon) {
        if (vol === 0) volumeIcon.innerText = 'volume_off';
        else if (vol < 0.5) volumeIcon.innerText = 'volume_down';
        else volumeIcon.innerText = 'volume_up';
      }
    });
  }
});

function toggleMute() {
  const volumeSlider = document.getElementById('volume-slider');
  const volumeIcon = document.getElementById('volume-icon');

  if (audio.volume > 0) {
    previousVolume = audio.volume;
    audio.volume = 0;
    if (volumeSlider) {
      volumeSlider.value = 0;
      volumeSlider.style.background = `linear-gradient(to right, #ffcbe2 0%, rgba(60, 48, 68, 0.8) 0%)`;
    }
    if (volumeIcon) volumeIcon.innerText = 'volume_off';
  } else {
    audio.volume = previousVolume || 1;
    const volPercent = (audio.volume) * 100;
    if (volumeSlider) {
      volumeSlider.value = audio.volume;
      volumeSlider.style.background = `linear-gradient(to right, #ffcbe2 ${volPercent}%, rgba(60, 48, 68, 0.8) ${volPercent}%)`;
    }
    if (volumeIcon) volumeIcon.innerText = audio.volume < 0.5 ? 'volume_down' : 'volume_up';
  }
}

// =========================================================================
// 6. VAULT & MODAL CONTROLS
// =========================================================================
function getFilteredVaultList() {
  const searchInput = document.getElementById('vault-search-input');
  const term = searchInput ? searchInput.value.toLowerCase().trim() : '';
  let filtered = blackpinkTracks;
  if (currentVaultCategory !== 'all') filtered = filtered.filter(t => t.category === currentVaultCategory);
  if (term) {
    filtered = filtered.filter(t => t.title.toLowerCase().includes(term) || t.artist.toLowerCase().includes(term) || t.album.toLowerCase().includes(term));
  }
  return filtered;
}

function renderSpotifyVaultTracks(tracksToRender) {
  const container = document.getElementById('vault-tracks-container');
  if (!container) return;
  const counterEl = document.getElementById('vault-track-counter');
  if (counterEl) counterEl.innerText = `${tracksToRender.length} songs`;

  container.innerHTML = tracksToRender.map((track) => {
    const isThisTrack = track.id === activePlayingId;
    const isPlayingCurrent = isThisTrack && !audio.paused;
    const serialNumber = String(track.id).padStart(2, '0');
    let badgeColor = "bg-primary/20 text-primary";
    if (track.category === 'jennie') badgeColor = "bg-secondary/20 text-secondary";
    if (track.category === 'jisoo') badgeColor = "bg-tertiary-fixed/20 text-tertiary-fixed";
    if (track.category === 'lisa') badgeColor = "bg-pink-500/20 text-pink-300";
    if (track.category === 'rose') badgeColor = "bg-tertiary/20 text-tertiary";

    return `
      <div class="spotify-track-row ${isThisTrack ? 'playing-row' : ''} grid grid-cols-12 gap-2 items-center px-4 py-2.5 rounded-DEFAULT cursor-pointer group" onclick="handleUniversalTrackClick(${track.id}, getFilteredVaultList())">
        <div class="col-span-1 text-center font-body-sm text-sm text-on-surface-variant flex items-center justify-center">
          <span class="${isPlayingCurrent ? 'text-primary font-bold hidden group-hover:hidden' : (isThisTrack ? 'text-primary font-bold' : '')} group-hover:hidden">${serialNumber}</span>
          <span class="material-symbols-outlined text-[20px] text-primary ${isPlayingCurrent ? 'block' : 'hidden group-hover:block'}">${isPlayingCurrent ? 'pause' : 'play_arrow'}</span>
        </div>
        <div class="col-span-6 md:col-span-5 flex items-center gap-3 min-w-0">
          <div class="min-w-0">
            <p class="font-title-md text-sm truncate ${isThisTrack ? 'text-primary font-bold' : 'text-on-surface'}">${track.title}</p>
            <span class="inline-block md:hidden px-2 py-0.2 rounded-full ${badgeColor} text-[10px] font-medium">${track.artist}</span>
          </div>
        </div>
        <div class="hidden md:block col-span-3 font-body-sm text-xs text-on-surface-variant truncate">${track.album}</div>
        <div class="hidden sm:block col-span-3 md:col-span-2 text-right"><span class="px-2.5 py-0.5 rounded-full ${badgeColor} text-[11px] font-medium">${track.artist}</span></div>
        <div class="col-span-5 sm:col-span-2 md:col-span-1 flex items-center justify-end gap-2 text-xs text-on-surface-variant">
          <span>${track.duration}</span>
          <button class="text-on-surface-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100" onclick="event.stopPropagation(); toggleFav(this)"><span class="material-symbols-outlined text-[16px]">favorite_border</span></button>
        </div>
      </div>
    `;
  }).join('');
}

function openSpotifyVault(filterCategory = 'all') {
  const modal = document.getElementById('spotify-vault-modal');
  if (modal) { modal.classList.remove('hidden'); modal.classList.add('flex'); document.body.style.overflow = 'hidden'; }
  document.querySelectorAll('.vault-pill-btn').forEach(btn => { btn.classList.remove('bg-primary', 'text-on-primary', 'active'); btn.classList.add('text-on-surface-variant'); });
  const activeBtn = Array.from(document.querySelectorAll('.vault-pill-btn')).find(b => b.getAttribute('onclick')?.includes(filterCategory));
  if (activeBtn) { activeBtn.classList.add('bg-primary', 'text-on-primary', 'active'); activeBtn.classList.remove('text-on-surface-variant'); }
  filterVaultByMember(filterCategory);
}

function closeSpotifyVault() {
  const modal = document.getElementById('spotify-vault-modal');
  if (modal) { modal.classList.add('hidden'); modal.classList.remove('flex'); document.body.style.overflow = 'auto'; }
}

function filterVaultByMember(category, btnElement = null) {
  currentVaultCategory = category;
  if (btnElement) {
    document.querySelectorAll('.vault-pill-btn').forEach(b => { b.classList.remove('bg-primary', 'text-on-primary', 'active'); b.classList.add('text-on-surface-variant'); });
    btnElement.classList.add('bg-primary', 'text-on-primary', 'active'); btnElement.classList.remove('text-on-surface-variant');
  }
  renderSpotifyVaultTracks(getFilteredVaultList());
}
function filterVaultTracks() { renderSpotifyVaultTracks(getFilteredVaultList()); }
function playVaultTrackByIndex(index) { activePlaylist = getFilteredVaultList(); if (activePlaylist[index]) playAudioTrack(activePlaylist[index].title, activePlaylist[index].artist, activePlaylist[index].album, activePlaylist[index].file, activePlaylist[index].id); }
function shuffleAndPlayAllBP() { activePlaylist = getFilteredVaultList(); const randomTrack = activePlaylist[Math.floor(Math.random() * activePlaylist.length)]; playAudioTrack(randomTrack.title, randomTrack.artist, randomTrack.album, randomTrack.file, randomTrack.id); }

// --- BTS VAULT ---
function getFilteredBtsVaultList() {
  const searchInput = document.getElementById('bts-vault-search-input');
  const term = searchInput ? searchInput.value.toLowerCase().trim() : '';
  let filtered = btsTracks;
  if (currentBtsCategory === 'v') filtered = filtered.filter(t => t.category === 'v');
  if (term) filtered = filtered.filter(t => t.title.toLowerCase().includes(term) || t.artist.toLowerCase().includes(term) || t.album.toLowerCase().includes(term));
  return filtered;
}

function renderBtsVaultTracks(tracksToRender) {
  const container = document.getElementById('bts-vault-tracks-container');
  if (!container) return;
  const counterEl = document.getElementById('bts-vault-track-counter');
  if (counterEl) counterEl.innerText = `${tracksToRender.length} songs`;

  container.innerHTML = tracksToRender.map((track, idx) => {
    const isThisTrack = track.id === activePlayingId;
    const isPlayingCurrent = isThisTrack && !audio.paused;
    const serialNumber = String(idx + 1).padStart(2, '0');
    let badgeColor = "bg-secondary-container/40 text-secondary font-medium";
    if (track.category === 'v') badgeColor = "bg-purple-500/25 text-purple-300 font-bold border border-purple-400/30";

    return `
      <div class="spotify-track-row ${isThisTrack ? 'playing-row-bts' : ''} grid grid-cols-12 gap-2 items-center px-4 py-2.5 rounded-DEFAULT cursor-pointer group" onclick="handleUniversalTrackClick(${track.id}, getFilteredBtsVaultList())">
        <div class="col-span-1 text-center font-body-sm text-sm text-on-surface-variant flex items-center justify-center">
          <span class="${isPlayingCurrent ? 'text-secondary font-bold hidden group-hover:hidden' : (isThisTrack ? 'text-secondary font-bold' : '')} group-hover:hidden">${serialNumber}</span>
          <span class="material-symbols-outlined text-[20px] text-secondary ${isPlayingCurrent ? 'block' : 'hidden group-hover:block'}">${isPlayingCurrent ? 'pause' : 'play_arrow'}</span>
        </div>
        <div class="col-span-6 md:col-span-5 flex items-center gap-3 min-w-0">
          <div class="min-w-0">
            <p class="font-title-md text-sm truncate ${isThisTrack ? 'text-secondary font-bold' : 'text-on-surface'}">${track.title}</p>
            <span class="inline-block md:hidden px-2 py-0.2 rounded-full ${badgeColor} text-[10px] font-medium">${track.artist}</span>
          </div>
        </div>
        <div class="hidden md:block col-span-3 font-body-sm text-xs text-on-surface-variant truncate">${track.album}</div>
        <div class="hidden sm:block col-span-3 md:col-span-2 text-right"><span class="px-2.5 py-0.5 rounded-full ${badgeColor} text-[11px]">${track.category === 'v' ? '💜 Vitamin V' : track.artist}</span></div>
        <div class="col-span-5 sm:col-span-2 md:col-span-1 flex items-center justify-end gap-2 text-xs text-on-surface-variant">
          <span>${track.duration}</span>
          <button class="text-on-surface-variant hover:text-secondary transition-colors opacity-0 group-hover:opacity-100" onclick="event.stopPropagation(); toggleFav(this)"><span class="material-symbols-outlined text-[16px]">favorite_border</span></button>
        </div>
      </div>
    `;
  }).join('');
}

function openBtsVault(filterCategory = 'all') {
  const modal = document.getElementById('bts-spotify-vault-modal');
  if (modal) { modal.classList.remove('hidden'); modal.classList.add('flex'); document.body.style.overflow = 'hidden'; }
  document.querySelectorAll('.bts-pill-btn').forEach(btn => { btn.classList.remove('bg-secondary', 'text-on-secondary', 'active'); btn.classList.add('text-on-surface-variant'); });
  const activeBtn = Array.from(document.querySelectorAll('.bts-pill-btn')).find(b => b.getAttribute('onclick')?.includes(filterCategory));
  if (activeBtn) { activeBtn.classList.add('bg-secondary', 'text-on-secondary', 'active'); activeBtn.classList.remove('text-on-surface-variant'); }
  filterBtsVaultByMember(filterCategory);
}
function closeBtsVault() { const modal = document.getElementById('bts-spotify-vault-modal'); if (modal) { modal.classList.add('hidden'); modal.classList.remove('flex'); document.body.style.overflow = 'auto'; } }
function filterBtsVaultByMember(category, btnElement = null) {
  currentBtsCategory = category;
  if (btnElement) {
    document.querySelectorAll('.bts-pill-btn').forEach(b => { b.classList.remove('bg-secondary', 'text-on-secondary', 'active'); b.classList.add('text-on-surface-variant'); });
    btnElement.classList.add('bg-secondary', 'text-on-secondary', 'active'); btnElement.classList.remove('text-on-surface-variant');
  }
  renderBtsVaultTracks(getFilteredBtsVaultList());
}
function filterBtsVaultTracks() { renderBtsVaultTracks(getFilteredBtsVaultList()); }
function playBtsVaultTrackByIndex(index) { activePlaylist = getFilteredBtsVaultList(); if (activePlaylist[index]) playAudioTrack(activePlaylist[index].title, activePlaylist[index].artist, activePlaylist[index].album, activePlaylist[index].file, activePlaylist[index].id); }
function shuffleAndPlayAllBTS() { activePlaylist = getFilteredBtsVaultList(); const randomTrack = activePlaylist[Math.floor(Math.random() * activePlaylist.length)]; playAudioTrack(randomTrack.title, randomTrack.artist, randomTrack.album, randomTrack.file, randomTrack.id); }

// --- JAPANESE VAULT ---
function getFilteredJapaneseVaultList() {
  const searchInput = document.getElementById('japanese-vault-search-input');
  const term = searchInput ? searchInput.value.toLowerCase().trim() : '';
  let filtered = japaneseTracks;
  if (term) filtered = filtered.filter(t => t.title.toLowerCase().includes(term) || t.artist.toLowerCase().includes(term) || t.album.toLowerCase().includes(term));
  return filtered;
}

function renderJapaneseVaultTracks(tracksToRender) {
  const container = document.getElementById('japanese-vault-tracks-container');
  if (!container) return;
  const counterEl = document.getElementById('japanese-vault-track-counter');
  if (counterEl) counterEl.innerText = `${tracksToRender.length} songs`;

  container.innerHTML = tracksToRender.map((track, idx) => {
    const isThisTrack = track.id === activePlayingId;
    const isPlayingCurrent = isThisTrack && !audio.paused;
    const serialNumber = String(idx + 1).padStart(2, '0');
    let badgeColor = "bg-rose-500/20 text-rose-300 font-medium border border-rose-500/30";

    return `
      <div class="spotify-track-row ${isThisTrack ? 'bg-rose-900/40 border-l-2 border-rose-400' : ''} grid grid-cols-12 gap-2 items-center px-4 py-2.5 rounded-DEFAULT cursor-pointer group" onclick="handleUniversalTrackClick(${track.id}, getFilteredJapaneseVaultList())">
        <div class="col-span-1 text-center font-body-sm text-sm text-on-surface-variant flex items-center justify-center">
          <span class="${isPlayingCurrent ? 'text-rose-400 font-bold hidden group-hover:hidden' : (isThisTrack ? 'text-rose-400 font-bold' : '')} group-hover:hidden">${serialNumber}</span>
          <span class="material-symbols-outlined text-[20px] text-rose-400 ${isPlayingCurrent ? 'block' : 'hidden group-hover:block'}">${isPlayingCurrent ? 'pause' : 'play_arrow'}</span>
        </div>
        <div class="col-span-6 md:col-span-5 flex items-center gap-3 min-w-0">
          <div class="min-w-0">
            <p class="font-title-md text-sm truncate ${isThisTrack ? 'text-rose-300 font-bold' : 'text-on-surface'}">${track.title}</p>
            <span class="inline-block md:hidden px-2 py-0.2 rounded-full ${badgeColor} text-[10px] font-medium">${track.artist}</span>
          </div>
        </div>
        <div class="hidden md:block col-span-3 font-body-sm text-xs text-on-surface-variant truncate">${track.album}</div>
        <div class="hidden sm:block col-span-3 md:col-span-2 text-right"><span class="px-2.5 py-0.5 rounded-full ${badgeColor} text-[11px]">${track.artist}</span></div>
        <div class="col-span-5 sm:col-span-2 md:col-span-1 flex items-center justify-end gap-2 text-xs text-on-surface-variant">
          <span>${track.duration}</span>
          <button class="text-on-surface-variant hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100" onclick="event.stopPropagation(); toggleFav(this)"><span class="material-symbols-outlined text-[16px]">favorite_border</span></button>
        </div>
      </div>
    `;
  }).join('');
}

function openJapaneseVault() {
  const modal = document.getElementById('japanese-spotify-vault-modal');
  if (modal) { modal.classList.remove('hidden'); modal.classList.add('flex'); document.body.style.overflow = 'hidden'; }
  renderJapaneseVaultTracks(getFilteredJapaneseVaultList());
}
function closeJapaneseVault() { const modal = document.getElementById('japanese-spotify-vault-modal'); if (modal) { modal.classList.add('hidden'); modal.classList.remove('flex'); document.body.style.overflow = 'auto'; } }
function filterJapaneseVaultTracks() { renderJapaneseVaultTracks(getFilteredJapaneseVaultList()); }
function playJapaneseVaultTrackByIndex(index) { activePlaylist = getFilteredJapaneseVaultList(); if (activePlaylist[index]) playAudioTrack(activePlaylist[index].title, activePlaylist[index].artist, activePlaylist[index].album, activePlaylist[index].file, activePlaylist[index].id); }
function shuffleAndPlayAllJapanese() { activePlaylist = getFilteredJapaneseVaultList(); const randomTrack = activePlaylist[Math.floor(Math.random() * activePlaylist.length)]; playAudioTrack(randomTrack.title, randomTrack.artist, randomTrack.album, randomTrack.file, randomTrack.id); }


// --- BENGALI SPECIAL VAULT ---
function renderBengaliSpecialTracks() {
  const container = document.getElementById('bengali-special-tracks-container');
  if (!container) return;
  container.innerHTML = bengaliSpecialTracks.map((track, idx) => {
    const isThisTrack = track.id === activePlayingId;
    const isPlayingCurrent = isThisTrack && !audio.paused;
    const serialNumber = String(idx + 1).padStart(2, '0');
    return `
      <div class="spotify-track-row ${isThisTrack ? 'playing-row' : ''} grid grid-cols-12 gap-2 items-center px-4 py-2.5 rounded-DEFAULT cursor-pointer group" onclick="handleUniversalTrackClick(${track.id}, bengaliSpecialTracks)">
        <div class="col-span-1 text-center font-body-sm text-sm text-on-surface-variant flex items-center justify-center">
          <span class="${isPlayingCurrent ? 'text-primary font-bold hidden group-hover:hidden' : (isThisTrack ? 'text-primary font-bold' : '')} group-hover:hidden">${serialNumber}</span>
          <span class="material-symbols-outlined text-[20px] text-primary ${isPlayingCurrent ? 'block' : 'hidden group-hover:block'}">${isPlayingCurrent ? 'pause' : 'play_arrow'}</span>
        </div>
        <div class="col-span-6 md:col-span-5 flex items-center gap-3 min-w-0">
          <div class="min-w-0">
            <p class="font-title-md text-sm truncate ${isThisTrack ? 'text-primary font-bold' : 'text-on-surface'}">${track.title}</p>
            <span class="inline-block md:hidden px-2 py-0.2 rounded-full bg-primary/20 text-primary text-[10px] font-medium">${track.artist}</span>
          </div>
        </div>
        <div class="hidden md:block col-span-3 font-body-sm text-xs text-on-surface-variant truncate">${track.album}</div>
        <div class="hidden sm:block col-span-3 md:col-span-2 text-right"><span class="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-[11px] font-medium">${track.artist}</span></div>
        <div class="col-span-5 sm:col-span-2 md:col-span-1 flex items-center justify-end gap-2 text-xs text-on-surface-variant">
          <span>${track.duration}</span>
          <button class="text-on-surface-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100" onclick="event.stopPropagation(); toggleFav(this)"><span class="material-symbols-outlined text-[16px]">favorite_border</span></button>
        </div>
      </div>
    `;
  }).join('');
}

function openBengaliSpecialVault() { const modal = document.getElementById('bengali-special-vault-modal'); if (modal) { modal.classList.remove('hidden'); modal.classList.add('flex'); document.body.style.overflow = 'hidden'; renderBengaliSpecialTracks(); } }
function closeBengaliSpecialVault() { const modal = document.getElementById('bengali-special-vault-modal'); if (modal) { modal.classList.add('hidden'); modal.classList.remove('flex'); document.body.style.overflow = 'auto'; } }
function playBengaliSpecialTrackByIndex(index) { activePlaylist = bengaliSpecialTracks; if (activePlaylist[index]) playAudioTrack(activePlaylist[index].title, activePlaylist[index].artist, activePlaylist[index].album, activePlaylist[index].file, activePlaylist[index].id); }
function shuffleAndPlayAllBengaliSpecial() { activePlaylist = bengaliSpecialTracks; const randomTrack = activePlaylist[Math.floor(Math.random() * activePlaylist.length)]; playAudioTrack(randomTrack.title, randomTrack.artist, randomTrack.album, randomTrack.file, randomTrack.id); }


// =========================================================================
// 7. FAVORITES, SECRET LETTER MODAL & UI HELPERS
// =========================================================================
function toggleFav(btn) {
  const icon = btn.querySelector('.material-symbols-outlined');
  if (icon) {
    if (icon.innerText === 'favorite_border') {
      icon.innerText = 'favorite';
      icon.style.fontVariationSettings = "'FILL' 1";
      btn.classList.add('text-primary');
    } else {
      icon.innerText = 'favorite_border';
      icon.style.fontVariationSettings = "'FILL' 0";
      btn.classList.remove('text-primary');
    }
  }
}

function openLetterModal() {
  const modal = document.getElementById('letter-modal');
  const content = document.getElementById('letter-modal-content');
  if (modal && content) {
    modal.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
    modal.classList.add('flex', 'opacity-100', 'pointer-events-auto');
    content.classList.remove('scale-95');
    content.classList.add('scale-100');
    document.body.style.overflow = 'hidden';
  }
}

function closeLetterModal() {
  const modal = document.getElementById('letter-modal');
  const content = document.getElementById('letter-modal-content');
  if (modal && content) {
    modal.classList.remove('opacity-100', 'pointer-events-auto');
    modal.classList.add('opacity-0', 'pointer-events-none');
    content.classList.remove('scale-100');
    content.classList.add('scale-95');
    setTimeout(() => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = 'auto';
    }, 300);
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeSpotifyVault();
    closeBtsVault();
    closeJapaneseVault();
    closeBengaliSpecialVault();
    closeLetterModal();
  }
});


// =========================================================================
// 8. GLOBAL SEARCH & INITIALIZATION
// =========================================================================
window.handleMainSearch = function(query) {
  const term = query.toLowerCase().trim();
  const trackCards = document.querySelectorAll('[onclick*="playAudioTrack"]');

  trackCards.forEach(card => {
    const text = card.textContent.toLowerCase();
    if (text.includes(term) || term === '') {
      card.style.opacity = '1';
      card.style.filter = 'none';
      card.style.display = 'flex'; 
    } else {
      card.style.opacity = '0';
      card.style.display = 'none'; 
    }
  });
};

function triggerSearch(term) {
  const searchInput = document.getElementById('sanctuary-search');
  if (searchInput) {
    searchInput.value = term;
    window.handleMainSearch(term);
    
    const blackpinkSection = document.getElementById('section-blackpink');
    if (blackpinkSection) {
      blackpinkSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderSpotifyVaultTracks(blackpinkTracks);
  renderBtsVaultTracks(btsTracks);
  renderJapaneseVaultTracks(japaneseTracks);
  renderBengaliSpecialTracks();

  const sanctuarySearch = document.getElementById('sanctuary-search');
  if (sanctuarySearch) {
    sanctuarySearch.addEventListener('input', (e) => window.handleMainSearch(e.target.value));
  }
  
  generateLoginParticles();
});

// =========================================================================
// 9. MAGICAL BACKGROUND ANIMATIONS (LOGIN & MAIN)
// =========================================================================

function generateLoginParticles() {
  const container = document.getElementById('particles-container');
  if (!container) return;
  container.innerHTML = '';
  const symbols = ['✦', '✧', '✨', '★', '⋆'];
  const totalParticles = 60; 
  
  for (let i = 0; i < totalParticles; i++) {
    const p = document.createElement('div');
    if (Math.random() > 0.3) {
      p.innerText = symbols[Math.floor(Math.random() * symbols.length)];
      p.className = 'absolute pointer-events-none login-particle';
      p.style.fontSize = `${Math.random() * 18 + 10}px`; 
    } else {
      p.className = 'absolute rounded-full pointer-events-none login-glow-orb';
      const size = Math.random() * 6 + 2; 
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.color = (Math.random() > 0.5) ? '#ffcbe2' : '#d9b9ff';
      p.style.backgroundColor = 'currentColor';
    }
    p.style.left = `${Math.random() * 100}%`;
    p.style.top = `${Math.random() * 100}%`;
    const duration = Math.random() * 4 + 3; 
    p.style.animationDuration = `${duration}s`;
    p.style.animationDelay = `${Math.random() * 5}s`;
    container.appendChild(p);
  }
}

function startSakuraAnimation() {
  const createPetal = () => {
    const mainView = document.getElementById('main-view');
    if (!mainView || mainView.classList.contains('hidden')) return;

    const petal = document.createElement('div');
    petal.classList.add('sakura-petal');
    const size = Math.random() * 10 + 8; 
    petal.style.width = `${size}px`;
    petal.style.height = `${size}px`;
    petal.style.left = `${Math.random() * 100}vw`;
    
    const fallDuration = Math.random() * 5 + 8; 
    const swayDuration = Math.random() * 2 + 2; 
    petal.style.animationDuration = `${fallDuration}s, ${swayDuration}s`;
    document.body.appendChild(petal);
    setTimeout(() => { petal.remove(); }, fallDuration * 1000);
  };
  setInterval(createPetal, 400);
}
