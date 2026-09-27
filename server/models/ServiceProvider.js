import mongoose from 'mongoose';

const serviceProviderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    businessName: {
      type: String,
      required: [true, 'Please provide business name'],
      trim: true
    },
    name: {
      type: String,
      trim: true
    },
    tagline: {
      type: String,
      default: ''
    },
    profileImage: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      default: ''
    },
    serviceCategories: [
      {
        type: String,
        trim: true
      }
    ],
    categoryId: {
      type: Number,
      default: 1
    },
    description: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      default: ''
    },
    experienceYears: {
      type: Number,
      default: 1
    },
    skills: [
      {
        type: String,
        trim: true
      }
    ],
    pricing: {
      hourlyRate: { type: Number, default: 350 },
      startingPrice: { type: Number, default: 299 }
    },
    hourlyRate: {
      type: Number,
      default: 350
    },
    availability: {
      isAvailable: { type: Boolean, default: true },
      workingHours: { type: String, default: '8:00 AM - 8:00 PM' }
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    isEmergency: {
      type: Boolean,
      default: false
    },
    address: {
      type: String,
      default: ''
    },
    area: {
      type: String,
      default: 'Malviya Nagar'
    },
    city: {
      type: String,
      default: 'Jaipur'
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [75.8052, 26.8529]
      }
    },
    verificationStatus: {
      type: String,
      enum: ['verified', 'pending', 'rejected'],
      default: 'verified'
    },
    verified: {
      type: Boolean,
      default: true
    },
    rating: {
      type: Number,
      default: 5.0
    },
    totalReviews: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

serviceProviderSchema.index({ location: '2dsphere' });
serviceProviderSchema.index({ city: 1, serviceCategories: 1 });

const ServiceProvider = mongoose.models.ServiceProvider || mongoose.model('ServiceProvider', serviceProviderSchema);
export default ServiceProvider;
