const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const OnlineUsers = require("../models/onlineModel");

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    delete user.password;

    await OnlineUsers.find({ userId: user._id }).deleteOne();
    const data = await OnlineUsers.create({
      userId: user._id
    });

    if (!data) return res.json({ msg: "Error!!", status: false });
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    // let users = await User.find({ _id: { $ne: req.params.id } }).select([   
    //   "email",
    //   "username",
    //   // "avatarImage",
    //   "_id",
    //   // "onlineStatus"
    // ]);

    const users = await User.find({ _id: { $ne: req.params.id } }).populate({ path: "onlineStatus", options: { select: { userId: 1, _id: 1 } } }).exec();
    // {
    //   path: 'onlineStatus',
    //   select: '_id',
    // }     //.populate("The feild-name needs to be populated")
    // console.log(users)
    // console.log(users[0].onlineStatus)
    const usersUpdated = await users.map((user) => {
      return { ...user._doc, "onlineStatus": user.onlineStatus != null }
    })

    return res.json(usersUpdated);
  } catch (ex) {
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.logOut = async (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    // console.log(req.params.id);
    await OnlineUsers.find({ userId: req.params.id }).deleteOne();
    //for Socket
    await global.onlineUsers.delete(req.params.id);
    console.log("Here>>", global.onlineUsers);

    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};
