import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceProvider',
      required: true
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service'
    },
    serviceTitle: {
      type: String,
      required: true
    },
    bookingDate: {
      type: String,
      required: [true, 'Please provide booking date']
    },
    bookingTime: {
      type: String,
      required: [true, 'Please provide booking time slot']
    },
    address: {
      type: String,
      required: [true, 'Please provide service address']
    },
    customer_phone: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    notes: {
      type: String,
      default: ''
    },
    estimatedCost: {
      type: Number,
      default: 0
    },
    finalCost: {
      type: Number,
      default: 0
    },
    total_price: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'confirmed', 'in-progress', 'completed', 'cancelled'],
      default: 'pending'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'cash_on_delivery'],
      default: 'pending'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Prevent double bookings for same provider at same date and time slot
bookingSchema.index({ providerId: 1, bookingDate: 1, bookingTime: 1, status: 1 });

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
export default Booking;
