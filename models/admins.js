let mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const encryptorTool = require("../utils/encryptor");

const Schema = mongoose.Schema;
const schema = new Schema(
  {
    email: { type: String },
    name: { type: String },
    password: { type: String },
    userType: { type: String ,default:'admin'},
    isActive: { type: Boolean },
    isDeleted: { type: Boolean },
    extraDetails: { type: Schema.Types.Mixed ,default:{}},
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);
schema.pre("save", async function (next) {
  this.isDeleted = false;
  this.isActive = true;
  this.userType = 'admin';
  next();
});

schema.methods.isPasswordMatch = async function (password) {
  const user = this;
  let plain = encryptorTool.decrypt(user.password);
  return plain == password;
};

schema.method("toJSON", function () {
  const { _id, ...object } = this.toObject({ virtuals: true });
  object.id = _id;
  delete object.password;
  delete object.createdAt;
  delete object.updatedAt;
  delete object.__v;
  return object;
});

schema.plugin(mongoosePaginate);
module.exports = mongoose.model("admin", schema);
