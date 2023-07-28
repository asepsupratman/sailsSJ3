/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * (for additional recommended settings, see `config/env/production.js`)
 *
 * For more information on configuration, check out:
 * https://sailsjs.com/config/http
 */

module.exports.http = {

  /****************************************************************************
  *                                                                           *
  * Sails/Express middleware to run for every HTTP request.                   *
  * (Only applies to HTTP requests -- not virtual WebSocket requests.)        *
  *                                                                           *
  * https://sailsjs.com/documentation/concepts/middleware                     *
  *                                                                           *
  ****************************************************************************/

  middleware: {

    /***************************************************************************
    *                                                                          *
    * The order in which middleware should be run for HTTP requests.           *
    * (This Sails app's routes are handled by the "router" middleware below.)  *
    *                                                                          *
    ***************************************************************************/
    poweredBy: function (req, res, next) {
      res.header("X-powered-by", "amanahummah.co.id")
      next();
    },

    pengecekanMultiDB: function (req, res, next) {
      req.dbString = "DN1";
      next();
    },

    collectParamMapping: function (req, res, next) {
      //console.log('config/http.js - req.url: ', req.url);
      //console.log('config/http.js - collectParamMapping - loaded');
      if (req.query.populate) {
        return res.status(400).json({ status: "error", message: "Unknown params `populate`." })
      }

      if (req.query.collect) {

        //rubah dari req.query.collect (param aksimaya custom) ke req.query.populate (sails) terus delete    	
        req.query.populate = req.query.collect;
        delete req.query.collect;

        // manipulasi req.collectOptions (jika ada) biar ga masuk jd criteria param
        // {"price":{"where":{"type":"product"},"limit":"1"}}
        if (req.query.collectOptions) {

          var collectOptions = JSON.parse(req.query.collectOptions);
          if (collectOptions) {
            req.collectOptions = {};

            _.each(collectOptions, function (value, key) {
              req.collectOptions[key] = value;
            });

            delete req.query.collectOptions;
          }
        }

        return next();
      }

      return next();
    },
    /*
    bodyParser: function(req, res, next) {
    	
      var getBody = require('raw-body');
      if (!req.headers['content-type'] ||   req.headers['content-type'].match('text/plain')) {
        // flag as parsed
          req._body = true;
          //console.log('http middleware bodyParser if true');
          
          // parse
            getBody(req, {
              limit: 100000, // something reasonable here
              expected: req.headers['content-length']
            }, function (err, buf) {
              console.log("err bodyParser 1",err);
              if (err) return next(err);

              // Make string from buffer
              buf = buf.toString('utf8').trim();

              // Set body
              req.body = buf.length ? {content: buf} : {}

              // Continue
              return next();
            });
        //return next();
      }else if(req.headers['content-type'].match('application/json')){
        // parse
            getBody(req, {
              limit: 100000, // something reasonable here
              expected: req.headers['content-length']
            }, function (err, buf) {
              console.log("err bodyParser 1",err);
              console.log("err buf 1",buf);
              if (err) return next(err);

              // Make string from buffer
              buf = buf.toString('utf8').trim();

              // Set body
              req.body = buf.length ? buf : {};
              req.inputs = buf.length ? buf : {};

              // Continue
              return next();
            });
      	
      }else{
        console.log('http middleware bodyParser if false');
        return next();
      }
    	
      return function (req, res, next) {return next();};
  },
  //*/

    order: [
      'cookieParser',
      'session',
      'getBodyContent',
      'bodyParser',
      'compress',
      'poweredBy',
      'collectParamMapping',
      'router',
      'pengecekanMultiDB',
      'www',
      'favicon',
    ],

    getBodyContent: (function () {
      var getRawBody = require('raw-body');
      var contentType = require('content-type')
      return function (req, res, next) {
        try {
          if (req.is('text/*') || req.is('application/json')) {
            getRawBody(req, {
              length: req.headers['content-length'],
              limit: '2mb',
              encoding: contentType.parse(req).parameters.charset
            }, function (err, string) {
              if (err) return next(err)
              req.bodyContent = string.toString();
              //console.log("in http",req.bodyContent);
            })
          }
        } catch (e) {
          console.log("e163", e)
        }
        next();
      };
    })(),
    /***************************************************************************
    *                                                                          *
    * The body parser that will handle incoming multipart HTTP requests.       *
    *                                                                          *
    * https://sailsjs.com/config/http#?customizing-the-body-parser             *
    *                                                                          *
    ***************************************************************************/

    // bodyParser: (function _configureBodyParser(){
    //   var skipper = require('skipper');
    //   var middlewareFn = skipper({ strict: true });
    //   return middlewareFn;
    // })(),

  },

};
