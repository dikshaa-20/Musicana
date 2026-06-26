console.log("Lets write javascript")

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
let currfolder
let songs
let currentsong = new Audio();
async function getsongs(folder) {
    currfolder = folder
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text();


    let div = document.createElement("div")
    div.innerHTML = response;

    let as = div.getElementsByTagName("a")

    songs = []

    for (let index = 0; index < as.length; index++) {

        const element = as[index];
        console.log(element.href)

       if (element.href.endsWith(".mp3")) {

    songs.push(
        decodeURIComponent(element.href)
        .split("\\")
        .slice(-1)[0]
    )
}
    }









    let songul = document.querySelector(".songname").getElementsByTagName("ul")[0]
    songul.innerHTML = ""
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li data-song="${song}">
    <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div>
${song
                .replace(".mp3", "")
                .split("-")
                .slice(1, 3)
                .join(" ")}
</div>
                                <div>Diksha</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="play.svg" alt="">
                            </div> </li>`;

    }

    //  play the first sons
    // Source - https://stackoverflow.com/a/18628124
    // Posted by Uri, modified by community. See post 'Timeline' for change history
    // Retrieved 2026-05-26, License - CC BY-SA 4.0
    Array.from(document.querySelector(".songname")
        .getElementsByTagName("li"))
        .forEach(e => {

            e.addEventListener("click", () => {

                playMusic(e.dataset.song)

            })

        })
return songs


}






const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track)
    console.log(currfolder)
    console.log(track)

    currentsong.src = `/${currfolder}/${track}`

    console.log(currentsong.src)
  
    if (!pause) {
        currentsong.play()
        play.src = "pause.svg"
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}










async function displayalbums() {
    let a = await fetch(`http://127.0.0.1:3000/songs/`)
    let response = await a.text();

    let div = document.createElement("div")
    div.innerHTML = response;

    let anchors = div.getElementsByTagName("a")
    let cardcontainer = document.querySelector(".cardcontainer")
    let array = Array.from(anchors)

    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("songs")) {

           let folder =
        decodeURIComponent(e.href)
        .split("\\songs\\")[1]
        .split("\\")[0]

            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
            let response = await a.json();
            console.log(response)
            cardcontainer.innerHTML = cardcontainer.innerHTML + ` <div data-folder="${folder}" class="card">
                        <div  class="play">

                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
                                color="currentColor" fill="black" stroke="black" stroke-width="1.5"
                                stroke-linejoin="round">
                                <path
                                    d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z ">
                                </path>
                            </svg>



                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`


        }

    }

    Array.from(document.getElementsByClassName("card")).forEach(e => {

        e.addEventListener("click", async item => {

            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)

            playMusic(songs[0])

        })

    })

    console.log(anchors);
}














async function main() {


    await getsongs("songs/ncs")
    playMusic(songs[0], true)

    displayalbums()

    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "play.svg"
        }
    })

    currentsong.addEventListener("timeupdate", () => {
        console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })






    previous.addEventListener("click", () => {
        console.log("Previous Clicked")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        console.log(songs, index)
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })







    next.addEventListener("click", () => {
        currentsong.pause()
        console.log("Next Clicked")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        console.log(songs, index)
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }


    })







    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log(e, e.target, e.target.value)
        currentsong.volume = parseInt(e.target.value) / 100
        if (currentsong.volume>0){
             document.querySelector(".volume>img").src =  document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    })





    document.querySelector(".volume>img").addEventListener("click", e => {
        console.log(e.target)
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentsong.volume = 0.1
            document.querySelector(".range")
                .getElementsByTagName("input")[0].value = 10;
        }

    })

}
main()