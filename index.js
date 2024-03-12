const express = require("express");
const app = express();
const port = 8000;
const cors = require("cors");
const mongoose = require("mongoose");
const multer=require("multer");
const path=require("path");
const employeeModel = require("./models/employee");


app.use(express.json());
app.use(cors());
// app.use('/images', express.static('public/images'));
app.use(express.static('public'))




// Multer Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images"); // Images will be stored in the public/images folder
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// ... (existing code)

// Update the POST route to handle image upload
// app.post("/post", upload.single("employeeImage"), async (req, res) => {
//   try {
//     const { name, department, designation, salary } = req.body;
//     const imagePath = req.file ? req.file.filename : null; // Check if an image was uploaded
//     const employee = await employeeModel.create({
//       name,
//       department,
//       designation,
//       salary,
//       image: imagePath, // Save the image path in the database
//     });
//     res.json(employee);
//     console.log(employee);
//     console.log("Image Path:", imagePath);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

app.post("/post", upload.single("employeeImage"), async (req, res) => {
  try {
    const { name, department, designation, salary } = req.body;
    const imagePath = req.file ? req.file.filename : null;
    const employee = await employeeModel.create({
      name,
      department,
      designation,
      salary,
      image: imagePath,
    });
    res.json(employee);
    console.log(employee);
    console.log("Image Path:", imagePath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

mongoose
  .connect("mongodb://127.0.0.1:27017/employee")
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((err) => {
    console.error(err);
    console.log("Error connecting to MongoDB");
  });

app.get("/", (req, res) => {
  res.send("Welcome");
});

// app.post("/post", async (req, res) => {
//   try {
//     const { name, department, designation, salary } = req.body;
//     const employee = await employeeModel.create({
//       name,
//       department,
//       designation,
//       salary
//     });
//     res.json(employee);
//     console.log(employee);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

app.get("/getdata", async (req, res) => {
  try {
    const employees = await employeeModel.find();
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/delete/:id", (req,res) => {
    const {id} =req.params;
    employeeModel.findByIdAndDelete({_id:id})
    .then((deletedEmployee) => {
        console.log(deletedEmployee);
        res.json(deletedEmployee);
    })
    .catch((err) => {
        console.error(err);
    })
});

app.put("/updateuser/:id", async(req,res) => {
    const {id} =req.params;
    try {
        const updatedUser=await employeeModel.findByIdAndUpdate(id, req.body, {new: true});
        res.json(updatedUser);
    } catch(err) {
        console.error(err);
        res.status(500).json({error:"Internal server error"});
    }
});

app.get("/getuserbyid/:id", (req,res) => {
    const {id} =req.params;
    employeeModel.findById({_id:id})
    .then((employee) => {
        res.json(employee);
    }).catch((err) => {
        console.log(err);
    })
});

// ---------------------------------------------------------------

app.listen(port, () => {
  console.log(`Srver is running on port ${port}`);
});
