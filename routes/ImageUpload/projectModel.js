import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  aboutProject: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

const Project = mongoose.model("Project", ProjectSchema);

export default Project;
