let mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const Schema = mongoose.Schema;
let schema = new Schema({
  user: {
    id: {
      type: Schema.Types.ObjectId,
      required: true
    },
    type: { type: String, default: 'customer' },
    name: { type: String, required: true }
  },
  description: { type: String, default: '' },
  calculateBy: {
    type: String,
    enum: ['orderWise', 'subscriptionWise'],
    required: true,
    default: 'orderWise'
  },
  limit: { type: Number, default: 0 },
  
  extraDetails: {
    type: Schema.Types.Mixed,
    default: null
  },
});

schema.plugin(mongoosePaginate);
schema.plugin(aggregatePaginate);

module.exports = mongoose.model("subscription", schema);
