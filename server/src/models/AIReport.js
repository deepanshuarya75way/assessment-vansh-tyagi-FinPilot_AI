const mongoose = require('mongoose');
const feedbackSchema=new mongoose.Schema({
  value:{
    type: String ,
    enum:[ "helpful" , "not_helpful"],
    required: true,
  },
  submittedAt:{
    type:Date,
    default: Date.now,
  },


},
{_id: false},);

const aiReportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    modelVersion: { type: String, default: '' },
    result: { type: mongoose.Schema.Types.Mixed, required: true },
    error: { type: String, default: '' },
    feedback:{rating:{type: String,enum:{'helpful','not_helpful'},default: null, }, submittedAt:{type: Date,
       default: null}, },},

  { timestamps: true }
);


aiReportSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('AIReport', aiReportSchema);
