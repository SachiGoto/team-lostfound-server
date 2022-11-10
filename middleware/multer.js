const multer = require("multer");
const path = require("path");

module.exports = multer({

  // storage: multer.diskStorage({}),
  // fileFilter: (req, file, cb) => {
  //   let ext = path.extname(file.originalname);
  //   if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
  //     cb(new Error("File type is not supported"), false);
  //     return;
  //   }
  //   cb(null, true);
  // },





 
  storage: multer.diskStorage({
    destination:function(req, file, cb){
      cb(null, './uploads')
    },
 filename: function (req, file, cb) {
   
    cb(null, file.originalname )
  // cb(null, Date.now() + '-' + file.originalname );
  // indicate what file name to give 

  },
  // fileFilter: (req, file, cb) => {
  //   let ext = path.extname(file.originalname);
  //   console.log(file)
  //   if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
  //     cb(new Error("File type is not supported"), false);
      
  //     return;
  //   }
  //   cb(null, true);
  // },
})


});

// const storage = multer.diskStorage({
//   // creating configuration here
//   // allocating destination and giving file name (original)
//   destination: function (req, file, cb) {
//     cb(null, './uploads')
//     // this is the name of the folder where you want the images to store 
//   },
//   filename: function (req, file, cb) {
   
//     cb(null, file.originalname )
//   // cb(null, Date.now() + '-' + file.originalname );
//   // indicate what file name to give 

//   }
// })


// const fileupload = multer({storage: storage})
// // initiate multer // 

