const ListMusics = document.querySelector('.track-list');
const audioElement = document.getElementById('audio-element');
var Tracks;
var musicPlayed = false;
var musicIndex;

var bottomPlayPauseBtnImg = document.querySelector('.bottom-control-bar .control-music-playing .play-pause-btn img');
var bottomPlayPauseBtn = document.querySelector('.bottom-control-bar .control-music-playing .play-pause-btn');
var bottomMusicTitle = document.querySelector('.bottom-control-bar .music-playing .title');
var bottomMusicArtist = document.querySelector('.bottom-control-bar .music-playing .artist');
var bottomMusicImage = document.querySelector('.bottom-control-bar .music-playing .music-img');

function ResetTracks() {
    var TracksBtn = document.querySelectorAll('.track-list .track .control-music .play-btn img');
    for (const btn of TracksBtn) {
        btn.src = 'SVG/play.svg';
    }
    bottomPlayPauseBtnImg.src = 'SVG/play.svg';
}

function LoadMusic(Element) {
    let track = Element;
    bottomMusicImage.src = track.querySelector('.content-music .music-image').src;
    bottomMusicTitle.innerText = track.querySelector('.content-music .music-title').innerText;
    bottomMusicArtist.innerText = track.querySelector('.content-music .music-artist').innerText;
    audioElement.src = Element.querySelector('.music-src').innerText;
}
function getMusicByIndex(index) {
    let tracks = document.querySelectorAll('.center .track-list .track');
    for (const track of tracks) {
        if (track.getAttribute('index') == index) {
            return track;
        }
    }
}
function nextMusic() {
    ResetTracks();
    let Indexmusic = Number(musicIndex);
    musicPlayed = false;
    Indexmusic +=1;
    if (Indexmusic >= 3) {
        Indexmusic = 0;
    }
    musicIndex = Indexmusic.toString();
    let track = getMusicByIndex(musicIndex);
    LoadMusic(track);
}
function prevMusic() {
    ResetTracks();
    musicPlayed = false;
    let Indexmusic = Number(musicIndex);
    Indexmusic -=1;
    if (Indexmusic <= -1) {
        Indexmusic = 2;
    }
    musicIndex = Indexmusic.toString();
    let track = getMusicByIndex(musicIndex);
    LoadMusic(track);
}
function PlayPauseBottomBtn() {
    let track = getMusicByIndex(musicIndex);
    let playBtnImg = track.querySelector('.control-music .play-btn img');
    if (musicPlayed) {
        audioElement.pause();
        musicPlayed = false;
        playBtnImg.src = 'SVG/play.svg';
        bottomPlayPauseBtnImg.src = 'SVG/play.svg';
    } else {
        audioElement.play();
        musicPlayed = true;
        playBtnImg.src = 'SVG/pause.svg';
        bottomPlayPauseBtnImg.src = 'SVG/pause.svg';
    }
    console.log('playPausebottombtn');
}
function PlauPauseMusic(e) {
    let trackElement = this.parentNode.parentNode;
    console.log(trackElement);
    if (musicIndex != trackElement.getAttribute('index')) {
        musicIndex = trackElement.getAttribute('index');
        ResetTracks();
        LoadMusic(trackElement);
        audioElement.play();
        musicPlayed = true;
        this.children[0].src = 'SVG/pause.svg';
        bottomPlayPauseBtnImg.src = 'SVG/pause.svg';
    }
    else{
        if (musicPlayed) {
            audioElement.pause();
            musicPlayed = false;
            this.children[0].src = 'SVG/play.svg';
            bottomPlayPauseBtnImg.src = 'SVG/play.svg';
        } else {
            audioElement.play();
            musicPlayed = true;
            this.children[0].src = 'SVG/pause.svg';
            bottomPlayPauseBtnImg.src = 'SVG/pause.svg';
        }
    }
}

function CreateTrack(track,musicIndex) {
    //Create Li
    let Track=document.createElement('li')
    Track.className = "track";  
    Track.setAttribute('index',musicIndex);
    // {{ content-music
    let contentMusic = document.createElement('div');
    contentMusic.className = 'content-music'; 

    let leftSide = document.createElement('div');
    leftSide.className = 'left-side';

    let musicImage = document.createElement('img');
    musicImage.className = 'music-image';

    let imageSrc = track.getElementsByTagName('IMAGESRC')[0];
    musicImage.src = imageSrc.textContent;

    let rightSide = document.createElement('div');
    rightSide.className = 'right-side';

    let musicTitle = document.createElement('div');
    musicTitle.className='music-title';
    let TitleValue = track.getElementsByTagName('TITLE')[0];
    musicTitle.innerText = TitleValue.textContent;

    let musicArtist = document.createElement('div');
    musicArtist.className = 'music-artist';
    let artistValue = track.getElementsByTagName('ARTIST')[0];
    musicArtist.innerText = artistValue.textContent;

    let musicTime = document.createElement('div');
    musicTime.className = 'music-time';
    let timeValue = track.getElementsByTagName('TIME')[0];
    let finalTime = timeValue.getElementsByTagName('MINUT')[0].textContent 
    + ':' + timeValue.getElementsByTagName('SECOND')[0].textContent
    musicTime.innerText = finalTime;

    rightSide.appendChild(musicTitle);
    rightSide.appendChild(musicArtist);
    rightSide.appendChild(musicTime);

    leftSide.appendChild(musicImage);
    contentMusic.appendChild(leftSide);
    contentMusic.appendChild(rightSide);
    
//    }}

// { contentMusic
    let controlMusic = document.createElement('div');
    controlMusic.className = 'control-music';

    let playBtn = document.createElement('div');
    playBtn.className = 'play-btn';

    let musicSrc = document.createElement('div');
    musicSrc.className = 'music-src';
    musicSrc.innerText = track.getElementsByTagName('MUSICPATH')[0].textContent;

    let img = document.createElement('img');
    img.src = "SVG/play.svg";

    playBtn.append(img);
    controlMusic.appendChild(playBtn);
    controlMusic.appendChild(musicSrc);
    playBtn.addEventListener('click',PlauPauseMusic);
    

// }
    Track.appendChild(contentMusic);
    Track.appendChild(controlMusic);

    return Track;
}
function GetData() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET','xml-data.xml',true);

    xhr.onload = function (e) {
        if (this.status == 200) {
            Tracks = this.responseXML;
            Tracks = Tracks.getElementsByTagName("TRACK");
            let i=0;
            for (const track of Tracks) {
                var trackElement = CreateTrack(track,i);
                ListMusics.appendChild(trackElement);
                i++;
            }
            document.querySelector('.bottom-control-bar .control-music-playing .next-music-btn').addEventListener('click',nextMusic);
            document.querySelector('.bottom-control-bar .control-music-playing .prives-music-btn').addEventListener('click',prevMusic);
            musicIndex = '0';
            LoadMusic(getMusicByIndex(musicIndex));
            bottomPlayPauseBtn.addEventListener('click',PlayPauseBottomBtn);
        }
    }

    xhr.send();
}
GetData();

