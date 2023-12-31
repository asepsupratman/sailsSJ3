/**
 * Module dependencies
 */

var _ = require('@sailshq/lodash');
var actionUtil = require('./actionUtilMultiDb');
var formatUsageError = require('./formatUsageError');
var populateMultiDb = require('./actions/populateMultiDb');

/**
 * Find One Record
 *
 * http://sailsjs.com/docs/reference/blueprint-api/find-one.
 *
 * > Blueprint action to find and return the record with the specified id.
 *
 */

module.exports = async function findOneRecord(req, res, db) {

  var parseBlueprintOptions = req.options.parseBlueprintOptions || req._sails.config.blueprints.parseBlueprintOptions;

  // Set the blueprint action for parseBlueprintOptions.
  req.options.blueprintAction = 'findOne';

  var queryOptions = parseBlueprintOptions(req);
  //console.log("sdafafa",queryOptions);sdfadfas;
  var Model = req._sails.models[queryOptions.using];

  // Only use the `where`, `select` or `omit` from the criteria (nothing else is valid for findOne).
  queryOptions.criteria = _.pick(queryOptions.criteria, ['where', 'select', 'omit']);

  // Only use the primary key in the `where` clause.
  queryOptions.criteria.where = _.pick(queryOptions.criteria.where, Model.primaryKey);

  //console.log("queryOptions", queryOptions); fdadfasfas;

  //queryOptions.criteria.where.uid_sekolah = req.token.user.uid_sekolah;
  //console.log("model",Model);sdafhdkjahfsjd;
  var query = Model.find()
    .where(queryOptions.criteria.where)
    .limit(1)
    .usingConnection(db);
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
    for (let r of matchingRecords) {
      r = await populateMultiDb(req, res, db, r);
    }
    res.ok(matchingRecords[0]);
  });

  /*
  Model
  .findOne(queryOptions.criteria, queryOptions.populates).meta(queryOptions.meta)
  .usingConnection(db)
  .exec(async function found(err, matchingRecord) {
    if (err) {
      // If this is a usage error coming back from Waterline,
      // (e.g. a bad criteria), then respond w/ a 400 status code.
      // Otherwise, it's something unexpected, so use 500.
      switch (err.name) {
        case 'UsageError': return res.badRequest(formatUsageError(err, req));
        default: return res.serverError(err);
      }
    }//-•
    for(let r of matchingRecords){
      r = await populateMultiDb(req,res,db,r);
     }
    if(!matchingRecord) {
      req._sails.log.verbose('In `findOne` blueprint action: No record found with the specified id (`'+queryOptions.criteria.where[Model.primaryKey]+'`).');
      return res.notFound();
    }
 
    if (req._sails.hooks.pubsub && req.isSocket) {
      Model.subscribe(req, [matchingRecord[Model.primaryKey]]);
      actionUtil.subscribeDeep(req, matchingRecord);
    }
 
    return res.ok(matchingRecord);
  });
  */

};
