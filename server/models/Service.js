import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceProvider',
      required: true
    },
    serviceName: {
      type: String,
      required: [true, 'Please provide service name'],
      trim: true
    },
    title: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    categoryId: {
      type: Number,
      default: 1
    },
    description: {
      type: String,
      default: ''
    },
    averagePrice: {
      type: Number,
      required: true,
      default: 299
    },
    price: {
      type: Number,
      default: 299
    },
    priceType: {
      type: String,
      enum: ['fixed', 'hourly', 'quote'],
      default: 'fixed'
    },
    durationMins: {
      type: Number,
      default: 60
    },
    image: {
      type: String,
      default: ''
    },
    emergencyAvailable: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Keep title and serviceName in sync
serviceSchema.pre('save', function (next) {
  if (!this.title && this.serviceName) {
    this.title = this.serviceName;
  } else if (!this.serviceName && this.title) {
    this.serviceName = this.title;
  }
  if (!this.price && this.averagePrice) {
    this.price = this.averagePrice;
  } else if (!this.averagePrice && this.price) {
    this.averagePrice = this.price;
  }
  next();
});

const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);
export default Service;
