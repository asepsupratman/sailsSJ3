//policies
module.exports = function tokenAuth(req, res, next) {
  console.log('cek token')
  return next()
}