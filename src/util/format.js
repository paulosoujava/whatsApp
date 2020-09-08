class Format {
    static getCamelCase(text){
        let div = document.createElement('div')
        div.innerHTML = `<div data-${text}="id"></div>`
        return Object.keys(div.firstChild.dataset)[0]
    }
    static toTime(duration){
        let secounds = parseInt((duration / 1000) % 60)
        let minutes = parseInt((duration / (1000 * 60) ) % 60)
        let hours = parseInt((duration / (1000 * 60 * 60)) % 24)
        if( hours > 0){
            return  `${hours}:${minutes.toString().padStart(2,'0')}:${secounds.toString().padStart(2,'0')}`
        }else{
            return  `${minutes}:${secounds.toString().padStart(2,'0')}`
        }
    }
}