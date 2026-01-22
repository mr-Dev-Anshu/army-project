import mongoose from 'mongoose';

const { Schema } = mongoose;

const SignatureSchema = new Schema({
  type: {
    type: String,
    enum: ['text', 'digital'],
    default: 'text',
  },
  value: {
    type: String,
    trim: true,
  },
  by: {
    type: String,
    trim: true,
  },
}, { _id: false });

const authenticationSchema = new Schema({
  initialsMPCPNCO: { type: String },
  initialsQMSJCO: { type: String },
  initials2IC: { type: String },
}, { _id: false });

const DutyAndAssetMovementSchema = new Schema(
  {
    type: {
      type: String,
      enum: [
        'mobile_phone',
        'vehicle',
        'convoy',
        'key',
        'arms_amn',
        'recce',
        'duty_out',
        'duty_roster',
        'general_duty_diary',
        'army_help_line_complaints',
        'lost_and_found',
        'vehicle_demand',
        'contact_info_army',
        'contact_info_civil_police',
        'contact_info_mp_control_room',
      ],
      required: [true, 'Register type is required'],
      index: true,
    },

    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    outTime: {
      type: Date,
      required: false,
    },
    inTime: {
      type: Date,
      required: false,
    },
    duty: {
      dateOfDuty: Date,
      place: String,
      location: String,
      typeOfDuty: String,
      natureOfDuty: String,
      from: String,
      to: String,
      fromTime: Date,
      tillTime: Date,
    },

    details: {
      type: Schema.Types.Mixed,
      default: {},
    },

    outSignature: {
      type: SignatureSchema,
      default: null,
    },
    inSignature: {
      type: SignatureSchema,
      default: null,
    },

    authentication: {
      type: authenticationSchema,
      default: {},
    },

    offender: {
      type: Schema.Types.ObjectId,
      ref: 'Offender',
    },

    remark: {
      type: String,
      default: '',
      trim: true,
    },


    status: {
      type: String,
      enum: ['pending_out', 'out', 'returned', 'cancelled'],
      default: 'pending_out',
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default mongoose.models.Register ||
  mongoose.model('Register', DutyAndAssetMovementSchema);