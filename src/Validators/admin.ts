import Joi from "joi";
import messages from "../custome_messages";
import subCategory from "../controllers/admin/subCategory";

const adminValidator_Schema = Joi.object({
    userName:Joi.string()
    .required()
    .messages({
        'string.empty': 'Username is required',
        'string.min': 'Username must be at least 3 characters long',
        'string.max': 'Username cannot exceed 20 characters' 
    }),
    email:Joi.string()
    .email()
    .required()
    .messages({
        'string.empty':'Email is required',
        'string.emai':'Invalid email format'
    }),
    password:Joi.string()
    .required()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .messages({
        'string.empty':'Password is required',
        'string.min':'Password must be at least 8 characters long',
        'string.max':'Password cannot exceed 30 characters',
        'string.pattern.base':'Passwrod must contain at least one uppercase letter, 0ne lowercase letter, one number, and one special character'
    }),
    role:Joi.string()
    .valid('user','admin')
    .required()
    .messages({
        'any.only':'Role must be either "user" or "admin"',
        'any.required':'Role is required'
    })
})

const adminLoginSchema = Joi.object({
    email:Joi.string()
    .email()
    .required()
    .messages({
        'string.empty':'Email is required',
        'string.emai':'Invalid email format'
    }),
    password:Joi.string()
    .required()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .messages({
        'string.empty':'Password is required',
        'string.min':'Password must be at least 8 characters long',
        'string.max':'Password cannot exceed 30 characters',
        'string.pattern.base':'Passwrod must contain at least one uppercase letter, 0ne lowercase letter, one number, and one special character'
    }),
})

const changeAdminPassword = Joi.object({
    oldPass:Joi.string()
    .required()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .messages({
        'string.empty':'Password is required',
        'string.min':'Password must be at least 8 characters long',
        'string.max':'Password cannot exceed 30 characters',
        'string.pattern.base':'Passwrod must contain at least one uppercase letter, 0ne lowercase letter, one number, and one special character'
    }),
    newPass:Joi.string()
    .required()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .messages({
        'string.empty':'Password is required',
        'string.min':'Password must be at least 8 characters long',
        'string.max':'Password cannot exceed 30 characters',
        'string.pattern.base':'Passwrod must contain at least one uppercase letter, 0ne lowercase letter, one number, and one special character'
    }),
    confirm_newPass: Joi.string()
        .required()
        .valid(Joi.ref('newPass')) 
        .messages({
            'any.only': 'Confirm password must match the new password',
            'string.empty': 'Confirm password is required'
        })
})

const catValidator_Schema = Joi.object({
    name:Joi.string().required(),
    ar_name:Joi.string().required(),
    image:Joi.string().optional().valid(""),
    isActive:Joi.boolean().required(),
})

const changeStatus_Schema = Joi.object({
    id:Joi.string().min(24).required()
    .messages({
      'string.min': messages("en").InvalidMongoId.replace('{{key}}','id')
    }),
    status:Joi.boolean().required()
})

const editCat_Schema = Joi.object({
    id:Joi.string().min(24).required()
    .messages({
      'string.min': messages("en").InvalidMongoId.replace('{{key}}','id')
    }),
    name:Joi.string().required(),
    ar_name:Joi.string().required(),
    image:Joi.string().optional().valid(""),
    isActive:Joi.boolean().required()
})

const details_Schema = Joi.object({
    id:Joi.string().min(24).required()
    .messages({
      'string.min': messages("en").InvalidMongoId.replace('{{key}}','id')
    })
})

const sunCategory_Schema = Joi.object({
    categoryId:Joi.string().min(24).required()
    .messages({
      'string.min': messages("en").InvalidMongoId.replace('{{key}}','categoryId')
    }),
    name:Joi.string().required(),
    ar_name:Joi.string().required(),
    image:Joi.string().optional().valid(""),
    isActive:Joi.boolean().required(),
    
})

const subCategoryEdit_Schema = Joi.object({
    id:Joi.string().min(24).required().messages({
        'string.min':messages("en").InvalidMongoId.replace('{{key}}','id')
    }),
    categoryId:Joi.string().min(24).required()
    .messages({
      'string.min': messages("en").InvalidMongoId.replace('{{key}}','categoryId')
    }),
    name:Joi.string().required(),
    ar_name:Joi.string().required(),
    image:Joi.string().optional().valid(""),
    isActive:Joi.boolean().required(),
})

const addsubSubCategory_Schema= Joi.object({
    categoryId:Joi.string().min(24).required()
    .messages({
      'string.min': messages("en").InvalidMongoId.replace('{{key}}','categoryId')
    }),
    // id:Joi.string().min(24).required().messages({
    //     'string.min':messages("en").InvalidMongoId.replace('{{key}}','id')
    // }),
    image:Joi.string().optional().valid(""),
    subCategoryId:Joi.string().min(24).required()
    .messages({
      'string.min': messages("en").InvalidMongoId.replace('{{key}}','subCategoryId')
    }),
    name:Joi.string().required(),
    ar_name:Joi.string().required()
})

const editsubSubCategory_Schema= Joi.object({
    categoryId:Joi.string().min(24).required()
    .messages({
      'string.min': messages("en").InvalidMongoId.replace('{{key}}','categoryId')
    }),
    id:Joi.string().min(24).required().messages({
        'string.min':messages("en").InvalidMongoId.replace('{{key}}','id')
    }),
    image:Joi.string().optional().valid(""),
    subCategoryId:Joi.string().min(24).required()
    .messages({
      'string.min': messages("en").InvalidMongoId.replace('{{key}}','subCategoryId')
    }),
    name:Joi.string().required(),
    ar_name:Joi.string().required(),
    isActive:Joi.boolean().required()
})

const catSpecification_Schema = Joi.object({
    categoryId:Joi.string().min(24).required()
    .messages({
      'string.min': messages("en").InvalidMongoId.replace('{{key}}','categoryId')
    }),
    keyName:Joi.string().required(),
    ar_keyName:Joi.string().required(),
    type:Joi.string().required().valid("input","dropdown"),
})

const edit_catSpecification_Schema = Joi.object({
    id:Joi.string().min(24).required().messages({
        'string.min':messages("en").InvalidMongoId.replace('{{key}}','id')
    }),
    keyName:Joi.string().required(),
    keyValue:Joi.string().required(),
    isActive:Joi.boolean().required(),
    type:Joi.boolean().required(),
})


const list_sub_CategoryValidator = Joi.object({
    categoryId:Joi.string().min(24).required()
    .messages({
      'string.min': messages("en").InvalidMongoId.replace('{{key}}','categoryId')
    }),
    page: Joi.number(),
    perPage: Joi.number(),
    nameMatched: Joi.string().allow(""),
    isActive: Joi.string()
  });

const geoWithin_Validator = Joi.object({
    name:Joi.string().required(),
    coordinates: Joi.array().items(Joi.number()).length(2).required(),
    category:Joi.string().required()
})


export  {
    adminValidator_Schema,
    adminLoginSchema,
    changeAdminPassword,
    catValidator_Schema,
    changeStatus_Schema,
    editCat_Schema,
    details_Schema,
    sunCategory_Schema,
    subCategoryEdit_Schema,
    addsubSubCategory_Schema,
    editsubSubCategory_Schema,
    catSpecification_Schema,
    edit_catSpecification_Schema,
    list_sub_CategoryValidator,
    geoWithin_Validator
} 