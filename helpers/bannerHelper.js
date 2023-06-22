const db = require("../config/connection");
const collection = require("../config/collections");
const { ObjectId } = require("mongodb");
const async = require("hbs/lib/async");
module.exports = {
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
  addBannerDetails: (banner, images) => {
    return new Promise((resolve, reject) => {
      banner.images = images;
      db.get()
        .collection(collection.BANNERCOLLECTION)
        .insertOne({ banner })
        .then((response) => {
          console.log("response from the add abnner detail are ", response);
        })
        .catch((err) => {
          console.log("reject err is add banner details are ", err);
          reject(err);
        });
    });
  },
  getBannerDetailsHome: (categorys) => {
    console.log("category us ", typeof categorys);
    return new Promise(async (resolve, reject) => {
      const banners = await db
        .get()
        .collection(collection.BANNERCOLLECTION)
        .find({ "banner.category": categorys })
        .toArray();

      console.log("banner at the home us ", banners);
      resolve(banners);
    }).catch((err) => {
      reject(err);
      console.log("error at get banner home is ");
    });
  },
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
  createReferalOffer:()=>{
    db.get().collection(collection.REFERALCOLLECTION).insertOne()
  }
}
