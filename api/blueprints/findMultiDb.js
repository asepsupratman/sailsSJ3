/**
 * Module dependencies
 */

var util = require('util'),
  actionUtil = require('./actionUtilMultiDb'),
  formatUsageError = require('./formatUsageError'),
  populateMultiDb = require('./actions/populateMultiDb');

_ = require('lodash');

/**
 * Find Records
 *
 *  get   /:modelIdentity
 *   *    /:modelIdentity/find
 *
 * An API call to find and return model instances from the data adapter
 * using the specified criteria.  If an id was specified, just the instance
 * with that unique id will be returned.
 *
 * Optional:
 * @param {Object} where       - the find criteria (passed directly to the ORM)
 * @param {Integer} limit      - the maximum number of records to send back (useful for pagination)
 * @param {Integer} skip       - the number of records to skip (useful for pagination)
 * @param {String} sort        - the order of returned records, e.g. `name ASC` or `age DESC`
 * @param {String} callback - default jsonp callback param (i.e. the name of the js function returned)
 */

module.exports = async function findRecords(req, res, db) {
  //console.log("sails.config.paths.models",sails.config.paths.models);asdfasfdads;
  //console.log('find.js - actionUtil.parseCriteria(req): ', actionUtil.parseCriteria(req))
  // Look up the model
  var Model = actionUtil.parseModelMultiDb(req, db);
  console.log("xxxxxxxxxxxxxxx",Model._attributes);dsfadfasfda;

  // If an `id` param was specified, use the findOne blueprint action
  // to grab the particular instance with its primary key === the value
  // of the `id` param.   (mainly here for compatibility for 0.9, where
  // there was no separate `findOne` action)
  if (actionUtil.parsePk(req)) {
    return require('./findonemultidb')(req, res, db);
  }

  // Lookup for records that match the specified criteria
  var query = Model.find()
    .where(_.merge(actionUtil.parseCriteria(req), { deleted: 0, uid_sekolah: req.token.user.uid_sekolah }))
    //.where(_.merge(actionUtil.parseCriteria(req),{deleted:0}))
    .limit(actionUtil.parseLimit(req))
    .skip(actionUtil.parseSkip(req))
    .sort(actionUtil.parseSort(req))
    .usingConnection(db);
  // TODO: .populateEach(req.options);
  //console.log(query);t;
  query = actionUtil.populateRequest(query, req);
  query.exec(async function found(err, matchingRecords) {
    if (err) {
      // If this is a usage error coming back from Waterline,
      // (e.g. a bad criteria), then respond w/ a 400 status code.
      // Otherwise, it's something unexpected, so use 500.
      switch (err.name) {
        case 'UsageError': return res.badRequest(formatUsageError(err, req));
        default: return res.serverError(err);
      }
    }//-•


    //tweak by aksimaya, tambahin numrows
    //req._sails.config.aksimaya.includeNumrows = false;
    if (req._sails.config.aksimaya.includeNumrows) {

      Model
        .count(_.merge(actionUtil.parseCriteria(req), { deleted: 0, uid_sekolah: req.token.user.uid_sekolah }))
        .usingConnection(db)
        .exec(async function (errCount, dataCount) {
          if (errCount) {
            console.log("l70", errCount);
            return res.serverError('database_error', errCount);
          }
          // Only `.watch()` for new instances of the model if
          // `autoWatch` is enabled.
          if (req._sails.hooks.pubsub && req.isSocket) {
            Model.subscribe(req, _.pluck(matchingRecords, Model.primaryKey));
            // Only `._watch()` for new instances of the model if
            // `autoWatch` is enabled.
            if (req.options.autoWatch) { Model._watch(req); }
            // Also subscribe to instances of all associated models
            _.each(matchingRecords, function (record) {
              actionUtil.subscribeDeep(req, record);
            });
          }//>-
          //console.log('matchingRecords- بِسْمِ اللَّهِ',matchingRecords[0]);
          for(let r of matchingRecords){
            r = await populateMultiDb(req,res,db,r);
           }
          res.ok(matchingRecords, { metadata: { skip: actionUtil.parseSkip(req), limit: actionUtil.parseLimit(req), numrows: dataCount } });

        })
      //atau default aja dr sails
    } else {
      if (req._sails.hooks.pubsub && req.isSocket) {
        Model.subscribe(req, _.pluck(matchingRecords, Model.primaryKey));
        // Only `._watch()` for new instances of the model if
        // `autoWatch` is enabled.
        if (req.options.autoWatch) { Model._watch(req); }
        // Also subscribe to instances of all associated models
        _.each(matchingRecords, function (record) {
          actionUtil.subscribeDeep(req, record);
        });
      }//>-

      return res.ok(matchingRecords);
    }
  });
};
