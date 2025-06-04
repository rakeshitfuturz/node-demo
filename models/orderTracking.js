let mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const helper = require('../utilities/helper_util');

const Schema = mongoose.Schema;
const schema = new Schema(
  {
    _id: { type: mongoose.Types.ObjectId, required: true },
    status: {
      type: String,
      enum: [
        'verified',
        'create',
        'picked',
        'delivered',
        'cancelled',
        'expiry_return',
        'half_return',
        'reassigned',
        'return',
        'admin_return',
        'returned',
        'out_for_delivery',
        'reach_to_hub',
        'out_for_hub'
      ]
    },
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
