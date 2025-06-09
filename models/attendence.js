let mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');
const Schema = mongoose.Schema;
const schema = new Schema(
  {
    user: {
      id: {
        type: Schema.Types.ObjectId,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      type: {
        type: String,
        default: 'rider'
      }
    },
    isActive: { type: Boolean, default: true },
    status: {
      type: String,
      required: true,
      enum: ['fullDay', 'halfDay', 'absent']
    },
    image: {
      type: String,
      default: ''
    },
    dutyTracking: [
      new Schema(
        {
          coords: {
            type: String,
            default: ''
          },
          date: {
            type: Date,
            default: Date.now()
          },
          dutyType: {
            type: String,
            enum: ['dutyOn', 'dutyOff', 'empty', ''],
            default: 'empty'
          }
        },
        { _id: false }
      )
    ],
    date: { type: Date, default: Date.now() },
    desc: { type: String, default: '' },
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
  }
);

schema.pre('save', async function (next) {
  this.isActive = true;
  next();
});

schema.pre('insertMany', async function (next, docs) {
  if (docs && docs.length) {
    for (let index = 0; index < docs.length; index++) {
      const element = docs[index];
      element.isActive = true;
    }
  }
  next();
});

schema.plugin(mongoosePaginate);
schema.plugin(mongooseAggregatePaginate);

const Attendence = mongoose.model('Attendence', schema);
module.exports = Attendence;
