import { ClassEvent } from "../util/ClassEvent"

export class MicrophoneController extends ClassEvent{
    constructor(){
        super();

        this._avaiable = false
        this._mimetype = 'audio/webm'

        navigator.mediaDevices.getUserMedia({
            audio: true
        }).then(stream => {
            this._stream = stream
            this._avaiable = true
            this.trigger('ready', this._stream)
        }).catch(er => {
            console.log(er)
        })
    }

    isAvaiable(){
        return this._avaiable
    }
    stop(){
        this._stream.getTracks().forEach(track=>{
            track.stop()
        })
    }
    startRecorder(){
        if( this.isAvaiable()){
            this._mediaRecorder =  new MediaRecorder(this._stream,{ 
                mimeType: this._mimetype
            })
            this._recordedChunks = []
            this._mediaRecorder.addEventListener('dataavailable', e =>{
                if( e.data.size > 0 ){
                    this._recordedChunks.push(e.data)
                }
            })
            this._mediaRecorder.addEventListener('stop', e =>{
                let blob = new Blob(this._recordedChunks, {
                    type: this._mimetype
                })
                let filename = `rec${Date.now()}.webm`
                let file = new File([blob], filename ,{
                    type: this._mimetype,
                    lastModified: Date.now()
                })
            })
            this._mediaRecorder.start()
            this.startTimer()
        }
    }
    stopRecorder(){
        if( this.isAvaiable()){
            this._mediaRecorder.stop()
            this.stop()
            this.stopTimer()
        }
    }
    startTimer(){
        let start = Date.now()
        this._recordMicrophoneInterval = setInterval(() => {
            this.trigger('recordtimer', (Date.now() - start))
        }, 100)
    }
    stopTimer(){
        clearInterval(this._recordMicrophoneInterval)
    }
}