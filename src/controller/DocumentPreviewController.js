const pdfjsLib = require('pdfjs-dist')
const path = require('path')
pdfjsLib.GlobalWorkerOptions.workerSrc = path.resolve(__dirname, '../../dist/pdf.worker.bundle.js')

export class DocumentPreviewController {
    constructor(file){
        this._file = file
    }

    getPreviewData(){
        return new Promise((resolve, reject) =>{
            if(!this._file){ 
                reject({ error: new Error('Unsuported')})
                return
            }
            let reader = new FileReader()
                switch(this._file.type){
                    case 'image/png':
                    case 'image/jpeg':
                    case 'image/jpg':
                    case 'image/gif':
                        reader.onload = e => {
                            resolve({
                                src: reader.result,
                                info: this._file.name
                            })
                        }
                        reader.onerror = error => {
                            reject( { error } )
                        }
                        reader.readAsDataURL(this._file)
                    break
                    case 'application/pdf':
                        
                        reader.onload = e =>{
                            console.log(reader);
                            pdfjsLib.getDocument(new Uint8Array(reader.result)).then( pdf => {
                                pdf.getPage(1).then(page => {
                                    let viewport = page.getViewport(1)
                                    let canvas = document.createElement('canvas')
                                    let canvasContext = canvas.getContext('2d')
                                    canvas.height = viewport.height
                                    canvas.width = viewport.width
                                    console.log('PAGER', page);
                                    page.render({
                                        canvasContext,
                                        viewport
                                    }).then(() =>{
                                        let _s = (pdf.numPages > 1) ? 's' : ''
                                        resolve({
                                            src: canvas.toDataURL('image/png'),
                                            info: `${pdf.numPages} página${_s}`
                                        })
                                    }).catch( error => {
                                        reject({ error })
                                    })
                                }).catch( error => {
                                    reject({ error })
                                })
                            }).catch(error =>{
                                reject({ error })
                            })
                        }
                        reader.readAsArrayBuffer(this._file)
                    break
                    default: 
                        reject({ error: new Error('Unsuported')})
                }
        })
    }
}