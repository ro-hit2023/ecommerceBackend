import Joi from "joi";

const uploadImage_Schema = Joi.object({
    type:Joi.string().required().valid('Vehicles_company', 'Renting_company', 'Users', 'Equipments', 'Vehicles', 'Chat', 'Category', 'Sub-category', 'Sub-sub-category', 'Delivery-size-type', 'Notifications', 'Query', 'Loading-type', 'Drivers')
})


export {

    uploadImage_Schema

}