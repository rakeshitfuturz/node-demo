let mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;
const mobileSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['tel', 'phone', 'whatsapp'],
      default: 'phone'
    },
    value: { type: String }
  },
  { _id: false }
);

const PickedAddressSchema = new Schema(
  {
    name: { type: String, required: true },
    mobile: [mobileSchema],
    address: { type: String, required: true },
    coords: { type: String, default: '' },
    packageDetails: {type:Schema.Types.Mixed ,default:{}},
    isPicked:{type : Boolean ,default:false},
    extraDetails:{type : Schema.Types.Mixed ,default:{}}
  },
  { strict: true }
);

const DropAddressSchema = new Schema(
  {
    name: { type: String, required: true },
    mobile: [mobileSchema],
    address: { type: String, required: true },
    coords: { type: String, default: '' },
    packageDetails: {type:Schema.Types.Mixed ,default:{}},
    isDelivered:{type : Boolean ,default:false},
    extraDetails:{type : Schema.Types.Mixed ,default:{}}
  },
  { strict: true }
);

const userDetails = new Schema(
  {
    id: {
      type: Schema.Types.ObjectId,
      default: null
    },
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  { _id: false, strict: true }
);

const schema = new Schema(
  {
    orderNo: { type: String },
    status: { type: String, enum: ['created', 'partial picked','picked', 'running', 'return', 'delivered' ,'partial delivered', 'cancelled', 'assigned'] },
    pickAddress: [PickedAddressSchema],
    dropAddress: [DropAddressSchema],
    priority: { type: Boolean, default: false },
    user: [userDetails],
    rider: {
      id: {
        type: Schema.Types.ObjectId,
        default: null
      },
      name: {
        type: String,
        default: null
      }
    },
    trackingInfo: [
      {
        type: Schema.Types.ObjectId,
        default: null
      }
    ],
    paymentId:{type:Schema.Types.ObjectId ,defaul:null},
    orderChargesDetails:{type:Schema.Types.Mixed ,default:null},
    extraDetails: {
      type: Schema.Types.Mixed,
      default: null
    }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  },
  {
    strict: true
  }
);

schema.method('toJSON', function () {
  const { _id, ...object } = this.toObject({ virtuals: true });
  object.id = _id;
  delete object._id;
  return object;
});

schema.plugin(mongoosePaginate);
schema.plugin(aggregatePaginate);
module.exports = mongoose.model("order", schema);
