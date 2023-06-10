const db = require("../config/connection");
const collection = require("../config/collections");
const { ObjectId } = require("mongodb");
const async = require("hbs/lib/async");
module.exports = {
  addCategory: (category) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CATEGORYCOLLECTION)
        .insertOne(category)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  viewCategory: () => {
    return new Promise((resolve, reject) => {
      let product = db
        .get()
        .collection(collection.CATEGORYCOLLECTION)
        .find()
        .toArray();
      resolve(product);
    });
  },
  viewSubCategory: () => {
    return new Promise((resolve, reject) => {
      let subCategory = db
        .get()
        .collection(collection.CATEGORYCOLLECTION)
        .find()
        .toArray();
      resolve(subCategory);
    }).catch((err) => {
      reject(err);
    });
  },
  getCategoryId: (category) => {
    return new Promise((resolve, reject) => {
      let categoryId = db
        .get()
        .collection(collection.CATEGORYCOLLECTION)
        .find({ categoryName: category })
        .toArray();
      resolve(categoryId);
    }).catch((err) => {
      reject(err);
    });
  },
  updateCategory: (id, update) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CATEGORYCOLLECTION)
        .updateOne({ _id: new ObjectId(id) }, { $set: update })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  deleteCategory: (id) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CATEGORYCOLLECTION)
        .deleteOne({ _id: new ObjectId(id) })
        .then(() => {
          resolve(true);
        });
    }).catch((err) => {
      console.log(err);
    });
  },
  addSubCategory: (insertSubcategory) => {
    return new Promise((resolve, reject) => {
      const filter = { categoryName: insertSubcategory.category };
      const update = { $push: { subcategory: insertSubcategory.subcategory } };

      db.get()
        .collection(collection.CATEGORYCOLLECTION)
        .updateOne(filter, update)
        .then(() => {
          resolve(true);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  deleteSubcategory: (categoryId, subCategoryId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CATEGORYCOLLECTION)
        .updateOne(
          { _id: new ObjectId(categoryId) },
          { $pull: { subcategory: subCategoryId } }
        )
        .then(() => {
          resolve(true);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  },
  addVouchers: (data) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CATEGORYCOLLECTION)
        .insertOne({ voucher: data });
    }).then(() => {
      resolve(true);
    });
  },
  getExistingVouchers: () => {
    return new Promise(async (resolve, reject) => {
      const vouchers = await db
        .get()
        .collection(collection.CATEGORYCOLLECTION)
        .aggregate([{ $project: { categoryName: 0} },
          { $project: { voucher: 1} }])
        .toArray();
      console.log("vouchers are vouchers ", vouchers[0]);
      resolve(vouchers[0]);
    });
  },
  deleteVoucher: (id) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CATEGORYCOLLECTION)
        .deleteOne({ _id: new ObjectId(id) })
        .then(() => {
          resolve(true);
        });
    });
  },
  editVouchers:(id,data)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.CATEGORYCOLLECTION).updateOne({
        _id: new ObjectId(id)
      },
      {$set:{voucher : data}})
    })
  }
};
