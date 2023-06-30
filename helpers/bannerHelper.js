const db = require("../config/connection");
const collection = require("../config/collections");
const { ObjectId } = require("mongodb");
module.exports = {
  //for getting all banner details
  getBannerDetails: () => {
    return new Promise((resolve, reject) => {
      const banners = db
        .get()
        .collection(collection.BANNERCOLLECTION)
        .find()
        .toArray();
      resolve(banners);
    });
  },
  //adding new banner
  addBannerDetails: (banner, images) => {
    return new Promise((resolve, reject) => {
      banner.images = images;
      db.get()
        .collection(collection.BANNERCOLLECTION)
        .insertOne({ banner })
        .then((response) => {
      resolve(response);
        })
        .catch((err) => {
          console.log("reject err is add banner details are ", err);
          reject(err);
        });
    });
  },
  // banner details home
  getBannerDetailsHome: (categorys) => {
    console.log("category is ",categorys)
    return new Promise(async (resolve, reject) => {
      const banners = await db
        .get()
        .collection(collection.BANNERCOLLECTION)
        .find({ "banner.category": categorys })
        .toArray();
      resolve(banners);
    }).catch((err) => {
      reject(err);
      console.log("error at get banner home is ");
    });
  },
  //banner details based on the category
  getBannerDetailsCategory: (category) => {
    return new Promise(async (resolve, reject) => {
      const banner = await db
        .get()
        .collection(collection.BANNERCOLLECTION)
        .find({ "banner.category": category })
        .toArray();
      resolve(banner);
    }).catch((err) => {
      reject(err);
    });
  },
  //edit banner details
  editBannerDetails:(banner,images,id)=>{
    banner.images=images;
   return new Promise((resolve,reject)=>{
    db.get()
      .collection(collection.BANNERCOLLECTION)
      .updateOne({ _id: new ObjectId(id) }, { $set: { banner: banner } }).then((response)=>{
        resolve(response);
      }).catch((err)=>{
        reject(err);
      })
   })

  },
}
