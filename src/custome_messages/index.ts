import { invalid } from "joi";


const messages = (data:any)=>{
    var language = data;
    if(language = 'en'){
        var messages ={
        UserAlreadyExists:"Already Exists",
        WrongPassword:"WrongPassword",
        AccountDoesNotExist:"AccountDoesNotExist",
        InvalidToken:"Token is invalid",
        TokenNotAvalible:"Token not found",
        InvalidRole:"Invalide Role",
        CategoryAlreadyExists:"Category with name: {{catName}} already exist",
        AdminCreated:"Admin added",
        UserDoesNotExist:"User with this email Id does not exist",
        UserVerificationSuccessfull:"User verified successfully",
        WrongOldPassword:"Please enter correct password",
        PasswordChangedSuccessfully:"Password has been changed Successfully",
        AdminWithGivenPasswordNotExist:"Admin with entered password does not exist",
        PasswordDoesNotMatch:"Password does not match",
        ServerError:"Server Error",
        AdminDeletedSuccessfully:"Admin successfully deleted",
        NoAdminExistWithThisId:"Admin Does not exit",
        NoAccountMatch:"No Account with this email exist",
        PasswordUpdateSuccessFull:"Password Update Success Full",
        InvalidMongoId:"{{key}} must be a valid mongoId",
        CategoryWithThisIdDoesNotExist:"category with this id does not exist",
        SubCategoryAlreadyExists:"SubCategory {{SubCategory}} already exist",
        NoSubCategoryExistsWithThisId:"No SubCategory with name:{{SubCategory}} exists",
        NosubSubCategoryExistsWithThisId:"No SubSubCategory with name:{{SubSubCategory}} exists",
        SubSubCategoryAlreadyExist:"SubSubCategory {{SubSubCategory}} already exist",
        catSpecificationAlreadyExixt:"catSpecification {{catSpecification}} already exist",
        NocatSpecificationWithThisId:"CatSpecification With This Id does not exist",
        alreadyExist: "Already Exists",
        NotFound:"Not Found",
        SuccessFull:"Request Success full",
        InternalServerError:"InternalServer Error",
        ImageRequired:"Image is not present in the request",
        Unexpected_Feld_Name :"Unexpected field name in upload"
       
        }
        return messages;
    }else if(language = 'ar'){
        var messages = {
             UserAlreadyExists:"Already Exists",
             WrongPassword:"WrongPassword",
             AccountDoesNotExist:"AccountDoesNotExist",
             InvalidToken:"Token is invalid",
             TokenNotAvalible:"Token not found",
             InvalidRole:"Invalide Role",
             CategoryAlreadyExists:"Category with name: {{catName}} already exist",
             AdminCreated:"Admin added",
             UserDoesNotExist:"User with this email Id does not exist",
             UserVerificationSuccessfull:"User verified successfully",
             WrongOldPassword:"Please enter correct password",
             PasswordChangedSuccessfully:"Password has been changed Successfully",
             AdminWithGivenPasswordNotExist:"Admin with entered password does not exist",
             PasswordDoesNotMatch:"Password does not match",
             ServerError:"Server Error",
             AdminDeletedSuccessfully:"Admin successfully deleted",
             NoAdminExistWithThisId:"Admin Does not exit",
             NoAccountMatch:"No Account with this email exist",
             PasswordUpdateSuccessFull:"Password Update Success Full",
             InvalidMongoId:"{{key}} must be a valid mongoId",
             CategoryWithThisIdDoesNotExist:"category with this id does not exist",
             SubCategoryAlreadyExists:"SubCategory {{subCategory}} already exist",
             NoSubCategoryExistsWithThisId:"No SubCategory with name:{{SubCategory}} exists",
             NosubSubCategoryExistsWithThisId:"No SubSubCategory with name:{{SubSubCategory}} exists",
             SubSubCategoryAlreadyExist:"SubSubCategory {{SubSubCategory}} already exist",
             catSpecificationAlreadyExixt:"catSpecification {{catSpecification}} already exist",
             NocatSpecificationWithThisId:"CatSpecification With This Id does not exist",
             alreadyExist: "Already Exists",
             NotFound:"Not Found",
             SuccessFull:"Request Success full",
             InternalServerError:"InternalServer Error",
             ImageRequired:"Image is not present in the request",
             Unexpected_Feld_Name :"Unexpected field name in upload"
        }
        return messages;
    }else{
        var messages = {
            UserAlreadyExists:"Already Exists",
            WrongPassword:"WrongPassword",
            AccountDoesNotExist:"AccountDoesNotExist",
            InvalidToken:"Token is invalid",
            TokenNotAvalible:"Token not found",
            InvalidRole:"Invalide Role",
            CategoryAlreadyExists:"Category with name: {{catName}} already exist",
            AdminCreated:"Admin added",
            UserDoesNotExist:"User with this email Id does not exist",
            UserVerificationSuccessfull:"User verified successfully",
            WrongOldPassword:"Please enter correct password",
            PasswordChangedSuccessfully:"Password has been changed Successfully",
            AdminWithGivenPasswordNotExist:"Admin with entered password does not exist",
            PasswordDoesNotMatch:"Password does not match",
            ServerError:"Server Error",
            AdminDeletedSuccessfully:"Admin successfully deleted",
            NoAdminExistWithThisId:"Admin Does not exit",
            NoAccountMatch:"No Account with this email exist",
            PasswordUpdateSuccessFull:"Password Update Success Full",
            InvalidMongoId:"{{key}} must be a valid mongoId",
            CategoryWithThisIdDoesNotExist:"category with this id does not exist",
            SubCategoryAlreadyExists:"SubCategory with {{subCategory}} already exist",
            NoSubCategoryExistsWithThisId:"No SubCategory with name:{{SubCategory}} exists",
            NosubSubCategoryExistsWithThisId:"No SubSubCategory with name:{{SubSubCategory}} exists",
            SubSubCategoryAlreadyExist:"SubSubCategory {{SubSubCategory}} already exist",
            catSpecificationAlreadyExixt:"catSpecification {{catSpecification}} already exist",
            NocatSpecificationWithThisId:"CatSpecification With This Id does not exist",
            alreadyExist: "Already Exists" ,
            NotFound:"Not Found" ,
            SuccessFull:"Request Success full",
            InternalServerError:"InternalServer Error" ,
            ImageRequired:"Image is not present in the request",
            Unexpected_Feld_Name :"Unexpected field name in upload"
        }
        return messages;
    }
}

export default messages