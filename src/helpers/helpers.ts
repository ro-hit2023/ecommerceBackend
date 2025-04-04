import bcrypt from  "bcrypt"

export async function hash_password(password: string) {
  const hash = await bcrypt.hash(password, 10); 
  return hash;
}

export function identityGenerator(role:any, count:any){
     let padding;
     switch (role){
      case "renter_user":
        padding = "FHVR"
        break;
      case "delivery_user":
        padding = "FHVR"
        break;
      case "renter_equipment":
        padding = "FHVRE"
        break;
      case "equipment_media":
        padding = "FHRVA"
        break;
      case "vehicle_address":
        padding = "FHVRVA"
        break;
      case "equipment_address":
        padding = "FHVREA"
        break;
      case "delivery_vehicle":
        padding = "FHVDT"
        break;
      case "order":
        padding = "FHVOID"
        break;
      case "admin_category":
        padding = "FHVASC";
        break;
      case "admin_sub_category":
        padding = "FHVASC";
        break;
      case "admin_sub_sub_category":
        padding = "FHVASSC"
        break;
      default:
        padding = "FHVU"
     }
 const timestamp = Date.now().toString(36)
 const Id = padding + "" +timestamp.toUpperCase()+ "" +count;
 return Id
}

