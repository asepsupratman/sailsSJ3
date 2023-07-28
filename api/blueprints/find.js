/**
 * Module dependencies
 */
const moment = require('moment');
var util = require('util'),
  actionUtil = require('./actionUtil'),
  formatUsageError = require('./formatUsageError');

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

module.exports = function findRecords(req, res) {
  //console.log('find.js - actionUtil.parseCriteria(req): ', actionUtil.parseCriteria(req))
  // Look up the model
  var Model = actionUtil.parseModel(req);
  console.log("xxxxxxxxxxxxxxx", req.dbString);

  // If an `id` param was specified, use the findOne blueprint action
  // to grab the particular instance with its primary key === the value
  // of the `id` param.   (mainly here for compatibility for 0.9, where
  // there was no separate `findOne` action)
  if (actionUtil.parsePk(req)) {
    return require('./findone')(req, res);
  }

  //console.log("line 43",actionUtil.parseCriteria(req));adfafa;

  // Lookup for records that match the specified criteria
  var query = Model.find()
    .where(_.merge(actionUtil.parseCriteria(req)))
    .limit(actionUtil.parseLimit(req))
    .skip(actionUtil.parseSkip(req))
    .sort(actionUtil.parseSort(req));
  // TODO: .populateEach(req.options);
  query = actionUtil.populateRequest(query, req);
  query.exec(function found(err, matchingRecords) {
    if (err) {
      // If this is a usage error coming back from Waterline,
      // (e.g. a bad criteria), then respond w/ a 400 status code.
      // Otherwise, it's something unexpected, so use 500.
      switch (err.name) {
        case 'UsageError': return res.badRequest(formatUsageError(err, req));
        default: return res.serverError(err);
      }
    }//-•

    ///format tanggal YYYY-MM-DD jika key menganduk kata tgl,tanggal
    try {
      for(let record of matchingRecords){
        for(const property in record){
          //console.log("line 67",property,record[property])
          if( property.indexOf('tgl') >= 0 || property.indexOf('tanggal') >= 0) 
            if(record[property]) 
              record[property] = moment(record[property]).format('YYYY-MM-DD');
        }
      }
    } catch (e) {
      console.log("line 73", e)
    }


    //tweak by aksimaya, tambahin numrows
    if (req._sails.config.aksimaya.includeNumrows) {
      Model.count(_.merge(actionUtil.parseCriteria(req), {}), function (errCount, dataCount) {
        if (errCount) return res.serverError('line 82 di blueprint/find.js database_error', errCount);

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
        res.ok(matchingRecords, { metadata: { skip: actionUtil.parseSkip(req), limit: actionUtil.parseLimit(req), numrows: dataCount } });
      });

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
