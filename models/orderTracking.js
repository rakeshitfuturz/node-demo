let mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;
const schema = new Schema(
  {
    _id: { type: mongoose.Types.ObjectId, required: true },
    addressId:{type:Schema.Types.ObjectId ,default:null},
    addressType:{type:String ,enum:['pick','drop'],default:null},
    user: {
      id: { type: Schema.Types.ObjectId, required: true },
      name: { type: String, required: true },
      type: { type: String, required: true }
    },
    images: { type: Array, default: [] },
    notes: { type: String, default: '' },
    extraDetails: {
      type:Schema.Types.Mixed,
      default:{}
    }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    },
    strict: false
  }
);
schema.plugin(mongoosePaginate);
module.exports = mongoose.model("orderTracking", schema);
