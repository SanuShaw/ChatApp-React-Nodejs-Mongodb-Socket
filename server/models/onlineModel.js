const mongoose = require("mongoose");

const onlineSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
        unique: true
    }
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Onlines", onlineSchema);
