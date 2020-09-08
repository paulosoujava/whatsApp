class CameraController{
    constructor(videoEl){
        this._videoEl = videoEl
        navigator.mediaDevices.getUserMedia({
            video: true
        }).them( stream =>{
            this._videoEl.src = URL.createObjectURL(stream)
            this._videoEl.play()
        }).cathc(er =>{
            console.log(er)
        })
    }
}