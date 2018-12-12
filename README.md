###关于简易音乐播放器的实现

function $(selector){
  return document.querySelector(selector)
}


 ```function getMusicList(callback){
   var xhr = new XMLHttpRequest()
   xhr.open("GET","./music.json",true)
   xhr.onload = function(){
     if((xhr.status = 200 && xhr.status < 300) || xhr.status===300){
       callback(JSON.parse(this.responseText))
     }else {
       console.log("获取失败")
     }
   }
   xhr.send()
   console.log(window.musicList)
 }

 getMusicList(function(list){
   loadMusic(list[currentIndex])
 })
```
发送xhr向服务器发送音乐的数据请求。浏览器的同源策略，需要与后台约定跨域接口。



```var musicList = [
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
```
服务端传入的数据。


```var musicNum = 0
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
```
musicNum音乐编号。loadMusic控制音乐的改变，和对应页面的标题和作者

```audio.ontimeupdate = function(){
  console.log(this.currentTime)
  $(".musicbox .progress-now").style.width = (this.currentTime/this.duration)*100 + "%"
}
```
控制进度条。currentTime正在播放歌曲的时间，duration该歌曲的总时间。两者相除后,加上字符串%，商的结果自动类型转换为字符串
将值传给width.

```audio.onplay = function(){
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
```
控制时间。currentTime得的值有小数，用Math对象取整。
sec用了3元的运算符，判断当currentTime的值为个位时，个位前加上0。

```$(".musicbox .play").onclick = function(){
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
```
播放按钮的改变。也可以用`toggle`方法调用。

```$(".musicbox .forward").onclick = function(){
  musicNum++
  musicNum = musicNum%musicList.length
  loadMusic(musicList[musicNum])
}
```
向前箭头添加的下首区功能。musicNum需要自增1。余数可以实现循环

```$(".musicbox .back").onclick = function(){
  musicNum--
  currentIndex = (musicNum + musicNum.length)%musicList.length
  loadMusic(musicList[musicNum])
}
```
后退箭头添加前一首的功能。musicNum自减1。余数防止实现音乐循环，且防止自减造成的负数。

```$(".musicbox .bar").onclick = function(e){
  console.log(e)
  var percent = e.offsetX / parseInt(getComputedStyle(this).width)
  console.log(percent)
  audio.currentTime = audio.duration * percent
}
```
可以拖动进度条。

```audio.onended = function(){
  musicNum = (++musicNum)%musicList.length
  loadMusic(musicList[musicNum])
}
```
歌曲结束后，自动下一首。