let mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;
const schema = new Schema(
  {
    name: { type: String },
    mobile: { type: String },
    emailId: { type: String },
    dateOfBirth: { type: String },
    address: { type: String },
    pincode: { type: String },
    panNumber: { type: String },
    vehicleType: { type: mongoose.Types.ObjectId },
    vehicleName: { type: String },
    vehicleNumber: { type: String },
    drivingLicenceNumber: { type: String },
    rcBookNumber: { type: String },
    upiId: { type: String },
    bankName: { type: String },
    bankAccountNumber: { type: String },
    ifscCode: { type: String },
    referralBy: { type: String },
    aadharCardFrontImage: { type: String },
    aadharCardBackImage: { type: String },
    dlFrontImage: { type: String },
    dlBackImage: { type: String },
    rcFrontImage: { type: String },
    rcBackImage: { type: String },
    profileImage: { type: String },
    vehicleImage: { type: String },
    panCardImage: { type: String },
    insuranceImage: { type: String },
    isDeleted: { type: Boolean },
    isDuty: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    udId:{type:String ,default:null},
    isVerified: { type: Boolean, default: false },
    isAttendance: { type: Boolean, default: false },
    isAttendanceByPass: { type: Boolean, default: false },
    extraDetails: { type: Schema.Types.Mixed ,default:{}},
    salary: {
      type: {
        type: String,
        required: true
      },
      amount: { type: String, default: null }
    },
    byPassPIN: {
      type: String,
      default: null
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: 'admin'
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'admin'
    }
  },
  {
    timestamps: true,
    strict: false
  }
);

schema.pre('save', async function (next) {
  this.isDeleted = false;
  this.isActive = true;
  this.isVerified = false;
  this.isDuty = false;
  next();
});

schema.pre('insertMany', async function (next, docs) {
  if (docs && docs.length) {
    for (let index = 0; index < docs.length; index++) {
      const element = docs[index];
      element.isDeleted = false;
      element.isActive = true;
      element.isVerified = false;
      element.isDuty = false;
    }
  }
  next();
});

schema.method('toJSON', function () {
  const { _id, ...object } = this.toObject({ virtuals: true });
  object.id = _id;
  return object;
});

schema.plugin(mongoosePaginate);
module.exports = mongoose.model("rider", schema);
