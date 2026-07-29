import mongoose from "mongoose";

// ============================================================
// VIDEO SCHEMA
// ============================================================

const videoSchema = new mongoose.Schema(

{

    title:{

        type:String,
        required:true

    },

    description:{

        type:String,
        default:""

    },

    video:{

        type:String,
        required:true

    },

    duration:{

        type:String,
        default:""

    },

    order:{

        type:Number,
        default:1

    },

    chapter:{

        type:mongoose.Schema.Types.ObjectId,
        ref:"Chapter",
        required:true

    }

},

{

    timestamps:true

}

);

export default mongoose.model("Video",videoSchema);