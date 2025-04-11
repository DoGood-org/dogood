// models/MapPoint.js

const mongoose = require('mongoose');

// Schema definition for MapPoint
const MapPointSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Map point must have a name'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  lat: {
    type: Number,
    required: [true, 'Latitude is required'],
    min: -90,
    max: 90
  },
  lng: {
    type: Number,
    required: [true, 'Longitude is required'],
    min: -180,
    max: 180
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: ['help', 'need'] // Only allow specific types
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index to optimize queries based on location and type
MapPointSchema.index({ lat: 1, lng: 1, type: 1 });

// Middleware to update the "updatedAt" field
MapPointSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Export the model
module.exports = mongoose.model('MapPoint', MapPointSchema);
