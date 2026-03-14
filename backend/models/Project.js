import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a project name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: false,
      maxlength: [500, 'Description cannot be more than 500 characters']
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false }
  }
);

// Cascade delete tasks when a project is deleted
projectSchema.pre('deleteOne', { document: false, query: true }, async function () {
  const docToUpdate = await this.model.findOne(this.getQuery());
  if (docToUpdate) {
    await mongoose.model('Task').deleteMany({ project_id: docToUpdate._id });
  }
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
