import multer from "multer"
import sharp from "sharp"
import fs from "fs"
import ffmpeg from "fluent-ffmpeg"
import { Request, Response, NextFunction } from 'express';




const storage = multer.memoryStorage()
export const upload= multer({storage})

const compressedImage = async(fileBuffer:Buffer, fileName:string):Promise<Buffer>=>{
    const outPutImage = await sharp(fileBuffer)
                        .rotate()
                        .resize(200)
                        .jpeg({ mozjpeg: true })
                        .toBuffer()
    return outPutImage
}

const compressedVideo = async(fileBuffer:Buffer, fileName:string):Promise<Buffer>=>{
    const tempInPut = `temp/${fileName}`
    const tempOutPut = `temp/compressed-${fileName}`
    return new Promise((resolve, reject)=>{
        fs.writeFileSync(tempInPut, fileBuffer)
    ffmpeg(tempOutPut)
    .videoCodec('libx26')
    .audioCodec('aac')
    .outputOption('-crf 23')
    .outputOption('-preset fast')
    .on('end', ()=>{
        const compressedBuffer= fs.readFileSync(tempOutPut)
        fs.unlinkSync(tempOutPut)
        fs.unlinkSync(tempInPut)
        resolve(compressedBuffer)
    })
    .on('error',reject)
    .save(tempOutPut)
    })
}



export const fileSizeCheck = async(req:Request, res:Response, next:NextFunction):Promise<void>=>{
    if(!req.file){
        return next()
    }
    const imageSize = 10 * 1024 * 1024  // 10 mb
    const videoSize = 10 * 1024 * 1024
    const docSize = 10 * 1024 * 1024
    const audioSize = 10 * 1024 * 1024
    const allowedImageType = ['Image/jpeg', 'Image/png', 'Image/jpg']
    const allowedVideoType= ['video/mp4']
    const allowedAudioType = ['audio/mpeg']
    const allowedDocType = ['application/pdf', 'application/']
    //check req.file is an array or object
    const files = Array.isArray(req.file)? req.file: Object.values(req.file).flat()
    for(const file of files){
        if(file.mimetype.startsWith('/image')){
            if(!allowedImageType.includes(file.mimetype)){
                 res.status(400).json({error:'Only jpeg, png, jpg type image allowed', code:400})
                 return;
            }
            if(file.mimetype.startsWith('/image') && file.size > imageSize){
                 res. status(400).json({error:'Only Image size 10 MB allowed',code:400})
                 return;
            }
        }
        else if(file.mimetype.startsWith('/video')){
            if(!allowedVideoType.includes(file.mimetype)){
                 res.status(400).json({error:'Only mp4 video type allowed',code:400})
                 return;
            }
            if(file.mimetype.startsWith('/video') && file.size > videoSize){
                 res.status(400).json({error:'Only video size 10 MB allowed',code:400})
                 return;
            }
        }
        else if(file.mimetype.startsWith('/audio')){
            if(!allowedAudioType.includes(file.mimetype)){
                 res.status(400).json({error:'Only mpeg audio type is allowed',code:400})
                 return;
            }
            if(file.mimetype.startsWith('/audio') && file.size > audioSize){
                 res.status(400).json({error:'Only audio size 10 MB allowed',code:400})
                 return;
            }
        }
        else if(file.mimetype.startsWith('/application')){
           if(file.mimetype.startsWith('/application') && file.size > docSize){
             res.status(400).json({error:'Only audio size 10 MB allowed',code:400})
             return;
           }
        }else{
             res.status(400).json({error:'Invalid file type', code:400})
             return;
        }
    }
    next()
}