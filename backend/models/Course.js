import mongoose from "mongoose"

const courseSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  thumbnail: {
    type: String
  },

  pdf: {
    type: String
  },

  video: {
    type: String
  },

  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

}, {
  timestamps: true
})

const Course = mongoose.model(
  "Course",
  courseSchema
)

export default Course