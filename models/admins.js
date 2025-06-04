let mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

let schema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    emailId: { type: String, default: "" },
    password: { type: String, default: "" },
    profileImage: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

schema.plugin(mongoosePaginate);
schema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("admins", schema);
