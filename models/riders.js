let mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const Schema = mongoose.Schema;
const schema = new Schema(
  {
    name: { type: String },
    mobile: { type: String },
    emailId: { type: String },
    dateOfBirth: { type: String ,default:""},
    bloodGroup: { type: String ,default:""},
    address: { type: String ,default:""},
    pincode: { type: String ,default:""},
    panNumber: { type: String ,default:""},
    hubId: { type: mongoose.Types.ObjectId },
    vehicleType: { type: mongoose.Types.ObjectId },
    vehicleName: { type: String ,default:""},
    vehicleNumber: { type: String ,default:""},
    drivingLicenceNumber: { type: String ,default:""},
    rcBookNumber: { type: String ,default:""},
    upiId: { type: String ,default:""},
    bankName: { type: String ,default:""},
    bankAccountNumber: { type: String ,default:""},
    ifscCode: { type: String ,default:""},
    aadharCardFrontImage: { type: String ,default:""},
    aadharCardBackImage: { type: String ,default:""},
    dlFrontImage: { type: String ,default:""},
    dlBackImage: { type: String ,default:""},
    rcFrontImage: { type: String ,default:""},
    rcBackImage: { type: String ,default:""},
    profileImage: { type: String ,default:""},
    vehicleImage: { type: String ,default:""},
    panCardImage: { type: String ,default:""},
    insuranceImage: { type: String ,default:""},
    isDeleted: { type: Boolean },
    isDuty: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    isAttendance: { type: Boolean, default: false },
    isAttendanceByPass: { type: Boolean, default: false },
    salary: {
      type: {
        type: String,
        required: true
      },
      amount: { type: String, default: null }
    },

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
schema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("admins", schema);
