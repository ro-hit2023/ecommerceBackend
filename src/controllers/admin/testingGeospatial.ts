import { resolve } from "path";
import { CustomError } from "../../utils/error";
import messages from "../../custome_messages";
import { StatusCodes } from "http-status-codes";
// import locationModel from "../../models/testingGeospatial";
import { rejects } from "assert";
import { STATUS_CODES } from "http";
import { PlaceModel } from "../../models/testingGeospatial";
import { header } from "express-validator";


// function testingGeospatial(body:any, headers:any):Promise<any>{
//     return new Promise(async(resolve,reject)=>{
//          const language = headers.language ? headers.language: 'en'
//          const message = messages(language)
//         try {
//             const { type, coordinates } = body;
    
//             if (!type || !coordinates ) {
//                  reject(new CustomError(message.NotFound, StatusCodes.BAD_REQUEST))
//             }else{
//                 const locationData = {
//                     type: type,  // Your custom type field
//                     geometry: {  // GeoJSON format
//                       type: type,
//                       coordinates: coordinates
//                     }
//                   };
            
//                   const savedLocation = await locationModel.create(locationData);
//                   resolve(savedLocation)        
//             }  
//         } catch (error) {
//             reject(error)
//         }
//     })
// }


// // for testing $geoIntersect---
// function saveGeoTestData(body: any, headers: any): Promise<any> {
//     return new Promise(async (resolve, reject) => {
//         const language = headers.language ? headers.language : 'en';
//         const message = messages(language);
        
//         try {
//             const { type, coordinates, name } = body;
//             if (!type || !coordinates) {
//                 return reject(new CustomError('Type or coordinates not found', StatusCodes.BAD_REQUEST));
//             }
//             const count = await locationModel.countDocuments()

//             const find = await locationModel.findOne({
//                 isDelete:false,
//                 "geometry.coordinates":coordinates
//             })
//             if(find){
//                 reject(new CustomError(message.alreadyExist, StatusCodes.BAD_REQUEST))
//             }else{
//                 const testData = {
//                     name: name,
//                     type: type,
//                     geometry: {
//                         type: type,
//                         coordinates: coordinates
//                     },
//                     createdAt: new Date()
//                 };
//                 const savedLocation = await locationModel.create(testData);           
//                 resolve({savedLocation, count});
//             }
           
//         } catch (error) {
//             reject(error);
//         }
//     });
// }



// function findNearLocation(body:any, headers:any):Promise<any>{
//     return new Promise(async(resolve, reject)=>{
//         const language = headers.language ? headers.language:'en'
//         const message =  messages(language)
//         try{
//             const { geometry, distance } = body;
//             const intersectingLocations = await locationModel.find({
//                 location: {
//                   $geoIntersects: {
//                     $geometry: geometry
//                   }
//                 }
//               });
//             resolve(intersectingLocations)
//         }catch(error){
//             reject(error)
//         }
//     })
// }

// function findNearLocation(body:any, headers:any):Promise<any>{
//     return new Promise(async(resolve, reject)=>{
//         const language = headers.language ? headers.language:'en'
//         const message =  messages(language)
//         try{
//             const { coordinates, distance } = body;
//             const checkLocation = await locationModel.find({
//                 location: {
//                     $geoIntersects: {
//                       $geometry: {
//                         type: "Polygon",
//                         coordinates: coordinates
//                     }
//                 }
//               }
//         })
//             resolve(checkLocation)
//         }catch(error){
//             reject(error)
//         }
//     })
// }

//testing $geowithin---

function storeGeoWithinData(body:any, headers:any):Promise<any>{
    return new Promise(async(resolve, reject)=>{
        const language = headers.language ? headers.language:'en'
        const message = messages(language)
        try{
            const { name, category, coordinates } = body

            var obj = {
                name:name,
                category:category,
                loc:{
                    type:"Point",
                    coordinates:coordinates
                }
            }

            const check = await PlaceModel.findOne(obj)
            if(check){
                reject(new CustomError(message.alreadyExist, StatusCodes.BAD_REQUEST))
            }else{
                const saveData = await PlaceModel.create(obj)
                resolve(saveData)
            }
        }catch(error){
            reject(new CustomError(message.InternalServerError, StatusCodes.BAD_REQUEST))
        }

    })
}

function queryGeoWithinDat(body:any, headers:any):Promise<any>{
    return new Promise(async(resolve, reject)=>{
        const language = headers.language ? headers.language:'en'
        const message = messages(language)
        try{

            const { coordinates } = body
            var obj = {
                loc:{
                    $geoWithin:{
                        $geometry:{
                            type:"Polygon",
                            coordinates:coordinates
                        }
                    }
                }
            }

            const find = await PlaceModel.find(obj)
            if(find){
                resolve(find)
            }else{
                reject(new CustomError(message.NotFound, StatusCodes.NOT_FOUND))
            }
        }catch(error){
            reject(new CustomError(message.InternalServerError, StatusCodes.BAD_REQUEST))
        }
    })
}





export default {
    // testingGeospatial,
    // findNearLocation,
    // saveGeoTestData,
    storeGeoWithinData,
    queryGeoWithinDat
}


   


