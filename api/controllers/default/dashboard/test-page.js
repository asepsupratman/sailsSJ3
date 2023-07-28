module.exports = async function welcomeUser(req, res) {

  // Get the `userId` parameter from the request.
  // This could have been set on the querystring, in
  // the request body, or as part of the URL used to
  // make the request.
  var userId = 1;
  sails.log.info(req.me);


  // Look up the user whose ID was specified in the request.
  var user = await User.findOne({ id: userId });

  // If no user was found, redirect to signup.
  if (!user) {
    return res.errorRespon(new Error('Not found user'));
  }
  return res.ok(req.me);
};
