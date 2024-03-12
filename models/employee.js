const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema({
  name: {
    type: String,
  },
  department: {
    type: String,
  },
  designation: {
    type: String,
  },
  salary: {
    type: Number,
  },
  image: {
    type: String, 
  },
});

const employeeModel = mongoose.model("Employee", employeeSchema);
module.exports = employeeModel;
