let mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const Schema = mongoose.Schema;
const schema = new Schema(
  {
    customerId: { type: mongoose.Types.ObjectId, required: true },
    customerDetails: { type: Schema.Types.Mixed, required: true },
    invoiceDetails: { type: Schema.Types.Mixed, required: true },
    invoiceNo: { type: String, required: true },
    isSettled: { type: Boolean, default: false },
    total: { type: Schema.Types.Mixed, required: true },
    invoiceDate: { type: Date, required: true },
    isVisible: { type: Boolean, default: false },
    activity: { type: Schema.Types.Mixed, default: [] }
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
module.exports = mongoose.model("invoices", schema);


//invoiceDetails
// orders ,amount ,subscription ,