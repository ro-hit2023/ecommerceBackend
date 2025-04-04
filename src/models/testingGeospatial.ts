import { Schema, model } from "mongoose";
// import mongoose, { Schema, model } from "mongoose";

// interface LocationData {
//     name: string;
//     address: string;
//     location: {
//         type: string;
//         coordinates: [number, number]; // [longitude, latitude]
//     };
//     isActive: boolean;
//     createdAt?: Date;
//     updatedAt?: Date;
// }

// const locationSchema = new Schema<LocationData>(
//     {
//         name: { type: String, required: true },
//         address: { type: String, required: true },
//         location: {
//             type: {
//                 type: String,
//                 enum: ["Point"],
//                 required: true
//             },
//             coordinates: {
//                 type: [Number],
//                 required: true
//             }
//         },
//         isActive: { type: Boolean, default: true }
//     },
//     {
//         timestamps: true,
//         versionKey: false
//     }
// );

// Creating a 2dsphere index for geospatial queries
// locationSchema.index({ location:1 });

// const locationModel = model<LocationData>("Location", locationSchema);
// export default locationModel;




interface GeoTestData {
    name: string;
    type: string;
    geometry: {
        type: string;
        coordinates: any[];
    };
    createdAt: Date;
    isActive?: boolean;
    isDelete?: boolean;
}

const geoTestSchema = new Schema<GeoTestData>({
    name: {
        type: String,
        default: function() {
            return `Geo-${this.geometry.type}-${new Date().toISOString().slice(0, 10)}`;
        }
    },
    type: {
        type: String,
        enum: ['Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon'],
        required: true
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon'],
            required: true
        },
        coordinates: {
            type: Schema.Types.Mixed,
            required: true
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDelete: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true,
    versionKey: false
});


geoTestSchema.index({ geometry: '2dsphere' });

export const geoTestModel = model<GeoTestData>('GeoTest', geoTestSchema);



interface PlaceSchema {
    loc: {
        type: string;
        coordinates: [number, number];
    };
    name: string;
    category: string;
    isDelete?: boolean;
}

const placeSchema = new Schema<PlaceSchema>(
    {
        loc: {
            type: { type: String, enum: ["Point", "Polygon"], required: true },
            coordinates: { type: [Number], required: true },
        },
        name: { type: String, required: true },
        category: { type: String, required: true },
        isDelete: { type: Boolean, default: false }, 
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

placeSchema.index({ loc: "2dsphere" }); 

export const PlaceModel = model<PlaceSchema>("Place", placeSchema);







