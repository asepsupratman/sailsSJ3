actionUtil = require('../actionUtilMultiDb'),
module.exports = async (req,res,db,row) => {
    var Model = actionUtil.parseModelMultiDb(req, db);
    //console.log("Model.attributs",Model.attributes)
    var aliasFilter = req.param('populate');
    if (typeof aliasFilter === 'undefined') return row;
    if (typeof aliasFilter === 'string') {
        aliasFilter = aliasFilter.replace(/\[|\]/g, '');
        aliasFilter = (aliasFilter) ? aliasFilter.split(',') : [];
    }
    for(let p of aliasFilter){
        if(row[p] == null) continue;

        let a = Model.attributes[p];
        if(!_.has(a,'extendedDescription')) continue;

        let modelField = a.extendedDescription.split('|');
        let model = req._sails.models[modelField[0].trim().toLowerCase()];
        let field = modelField[1];
        let where = {};
        where[field] = row[p];
        where.uid_sekolah = req.token.user.uid_sekolah;
        let fetch = await model.find(where).usingConnection(db);
        row[p] = fetch[0];
    }
    return row;
}