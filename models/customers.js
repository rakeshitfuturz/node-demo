let mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const Schema = mongoose.Schema;
const schema = new Schema(
  {
    name: { type: String, default: '' },
    mobile: { type: String, default: '' },
    emailId: { type: String, required: true },
    password: { type: String, default: '' },
    address: { type: Schema.Types.Mixed },
    gst: {
      gstNumber: { type: String, default: '' },
      gstBusinessName: { type: String, default: '' },
      isUpdated: { type: Boolean, default: false }
    },
    customerType:{type:String , enum:['B2B','B2C','BOTH'],default:'B2C'},
    bankName: { type: String, default: '' },
    accountNo: { type: String, default: '' },
    accountNo: { type: String, default: '' },
    ifscCode: { type: String, default: '' },
    upiId: { type: String, default: '' },
    userType: { type: String, default: 'customer' },
    businessType: { type: String, enum: ['B2B', 'B2C', 'BOTH'], default: 'B2C' },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    creditLimit: { type: String, default: '' },
    extraDetails: { type: Schema.Types.Mixed ,default:{}},
},
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    },
    strict: false
    // strictPopulate: false
  }
);

schema.pre('save', async function (next) {
  this.isDeleted = false;
  this.isActive = true;

  next();
});

schema.pre('insertMany', async function (next, docs) {
  if (docs && docs.length) {
    for (let index = 0; index < docs.length; index++) {
      const element = docs[index];
      element.isDeleted = false;
      element.isActive = true;
    }
  }
  next();
});

schema.method('toJSON', function () {
  const { _id, ...object } = this.toObject({ virtuals: true });
  object.id = _id;
  delete object.updatedAt;
  delete object.createdAt;
  delete object.__v;
  return object;
});

schema.plugin(mongoosePaginate);
schema.plugin(aggregatePaginate);
module.exports = mongoose.model("customer", schema);
