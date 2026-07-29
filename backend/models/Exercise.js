import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        default: ""
    },

    instructions: {
        type: String,
        default: ""
    },

    points: {
        type: Number,
        default: 20
    },

    dueDate: {
        type: Date
    },

    attachment: {
        type: String,
        default: ""
    },

    chapter: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "Chapter",

        required: true

    }

},
{
    timestamps: true
});

export default mongoose.model("Exercise", exerciseSchema);