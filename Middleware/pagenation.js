const db = require("../config/connection");
const collection = require("../config/collections");
const productHelper = require("../helpers/productHelpers");
const async = require("hbs/lib/async");

module.exports={
    pagenation:async(pageNo,pageSize=6,aggregationPipeline)=>{

        const dataPipeLine = [
          ...aggregationPipeline,
          { $skip: (pageNo - 1) * pageSize },
          { $limit: pageSize },
        ];

    const result = db.get().collection(collection.PRODUCTCOLLECTION).aggregate(dataPipeLine).toArray();
    const countResult = await db.collection(collection.PRODUCTCOLLECTION).aggregate(countPipeline).toArray();
    const totalCount = countResult[0] ? countResult[0].count : 0;

  return {
      data: result,
      totalCount: totalCount
    };
    }
}


