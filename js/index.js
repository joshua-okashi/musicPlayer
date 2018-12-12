function $(selector){
  return document.querySelector(selector)
}

// function getMusicList(callback){
//   var xhr = new XMLHttpRequest()
//   xhr.open("GET","./music.json",true)
//   xhr.onload = function(){
//     if((xhr.status >= 200 && xhr.status < 300) || xhr.status===300){
//       callback(JSON.parse(this.responseText))
//     }else {
//       console.log("获取失败")
//     }
//   }
//   xhr.send()
//   console.log(window.musicList)
// }

// getMusicList(function(list){
//   loadMusic(list[currentIndex])
// })

var musicList = [
  {
    src: "./music/Longing for you- Mwk.mp3",
    title: "Longing for you",
    auther: "Mwk"
  },
  {
    src: "./music/弔イト贐ノ唄 - 黒澤まどか.mp3",
    title: "弔イト贐ノ唄",
    auther: "黒澤まどか"
  }  
]

var musicNum = 0
var clock
var audio = new Audio()
audio.autoplay = true

loadMusic(musicList[musicNum])

function loadMusic(musicObj){
  console.log(musicObj)
  $(".musicbox .title").innerText = musicObj.title
  $(".musicbox .auther").innerText = musicObj.auther
  audio.src = musicObj.src
}


audio.ontimeupdate = function(){
  console.log(this.currentTime)
  $(".musicbox .progress-now").style.width = (this.currentTime/this.duration)*100 + "%"
}

audio.onplay = function(){
  clock = setInterval(function(){
    var min = Math.floor(audio.currentTime/60)
    var sec = Math.floor(audio.currentTime)%60 + ""
    sec = sec.length === 2? sec : "0" + sec 
    $(".musicbox .time").innerText = min + ":" + sec
  },1000)
}
audio.onpause = function(){
  clearInterval(clock)
}

$(".musicbox .play").onclick = function(){
  if(audio.paused){
    audio.play()
    this.querySelector(".iconfont").classList.remove("icon-jiantou")
    this.querySelector(".iconfont").classList.add("icon-zanting")
  }else {
    audio.pause()
    this.querySelector(".iconfont").classList.add("icon-jiantou")
    this.querySelector(".iconfont").classList.remove("icon-zanting")    
  }
}

$(".musicbox .forward").onclick = function(){
  musicNum++
  musicNum = musicNum%musicList.length
  loadMusic(musicList[musicNum])
}

$(".musicbox .back").onclick = function(){
  musicNum--
  currentIndex = (musicNum + musicNum.length)%musicList.length
  loadMusic(musicList[musicNum])
}

$(".musicbox .bar").onclick = function(e){
  console.log(e)
  var percent = e.offsetX / parseInt(getComputedStyle(this).width)
  console.log(percent)
  audio.currentTime = audio.duration * percent
}

audio.onended = function(){
  musicNum++
  musicNum = musicNum%musicList.length
  loadMusic(musicList[musicNum])
}