const User = require('../models/User');
const cloudinary = require("../middleware/cloudinary");


module.exports = {
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const dates = user.date.toString().split(' ');
      const dateJoined = {
        month: dates[1],
        day: dates[2],
        year: dates[3],
      }
      res.render('profile.ejs', {
        profileUser: user,
        user: req.user,
        dateJoined: dateJoined
      })
    } catch(err) {
      console.log(err);
    }
    
  },
  uploadPicture: async (req, res) => {
    try {
      // First delete current picture
      let user = await User.findById(req.params.id); 
      if (user.cloudinaryId) {
        await cloudinary.uploader.destroy(user.cloudinaryId);
      }
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      await User.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            profileImage: result.secure_url,
            cloudinaryId: result.public_id
          }
        }
      )
      console.log("Profile pic has been added!");
      res.redirect(`/profile/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },

}