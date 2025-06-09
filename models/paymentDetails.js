let mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const Schema = mongoose.Schema;
const schema = new Schema(
  {
    
    extraDetails: { type: Schema.Types.Mixed ,default:{}},
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
schema.plugin(aggregatePaginate);
module.exports = mongoose.model("paymentDetails", schema);
