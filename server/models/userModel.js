const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  isAvatarImageSet: {
    type: Boolean,
    default: false,
  },
  avatarImage: {
    type: String,
    default: "",
  },
  // onlineStatus: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Onlines"
  // },

  // posts:[{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Posts"
  // }]
});

userSchema.virtual('onlineStatus',
  {
    ref: "Onlines", //the collection name, (bad)before i had Phrase as the model
    localField: "_id",
    foreignField: "userId",
    justOne: true
  })

module.exports = mongoose.model("Users", userSchema);

// Users.aggregate([
//   {
//     $lookup: {
//       localField: "_id",
//       from: "Onlines", //the collection name, (bad)before i had Phrase as the model
//       foreignField: "userId",
//       as: "onlineStatus"
//     }
//   }
// ])

