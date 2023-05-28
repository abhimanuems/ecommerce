const db = require("../config/connection");
const collection = require("../config/collections");
const { ObjectId } = require("mongodb")
module.exports = {
  addCategory: (category) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CATEGORYCOLLECTION)
        .insertOne(category)
        .then(() => {
          resolve(true);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  viewCategory: () => {
    return new Promise(async (resolve, reject) => {
      let product = await db
        .get()
        .collection(collection.CATEGORYCOLLECTION)
        .find()
        .toArray();
      resolve(product);
    });
  },
  viewSubCategory: () => {
    return new Promise(async (resolve, reject) => {
      let subCategory = await db
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
    return new Promise(async (resolve, reject) => {
      let categoryId = await db
        .get()
        .collection(collection.CATEGORYCOLLECTION)
        .find({ categoryName: category })
        .toArray();
      resolve(categoryId);
    }).catch((err) => {
      reject(err);
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
    return new Promise((resolve,reject)=>{
       db.get()
  .collection(collection.CATEGORYCOLLECTION)
  .updateOne(
    { _id: new ObjectId(categoryId) },
    { $pull: { subcategory: subCategoryId } })
         .then(() => {
           resolve(true);
         })
         .catch((err) => {
           console.log(err);
           reject(err);
         });

    })
    
  },
};
