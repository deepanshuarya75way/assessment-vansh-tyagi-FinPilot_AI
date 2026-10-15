const mongoose=require('mongoose');
const aiReport=require('../models/AIReport');
const aiReportService = require('../services/aiReportService');
function formatReport(doc){
  return {
    id:doc_id,
    createdAt:doc.modelVersion,
    result: doc.result,
    error:doc.error,
    feedback: doc.feedback?.rating ?{
      rating: doc.feedback.rating ,submittedAt: doc.feedback.submittedAt,
    }: null,
  };
}

async function latest(req, res, next) {
  try {
    const doc = await aiReportService.getLatestReport(req.user._id);
    if (!doc) {
      return res.json({ report: null });
    }
    res.json({
      report: {
        id: doc._id,
        createdAt: doc.createdAt,
        modelVersion: doc.modelVersion,
        result: doc.result,
        error: doc.error,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const doc = await aiReportService.refreshReport(req.user._id);
    res.status(201).json({
      report: {
        id: doc._id,
        createdAt: doc.createdAt,
        modelVersion: doc.modelVersion,
        result: doc.result,
        error: doc.error,
      },
    });
  } catch (err) {
    if (err.statusCode === 502 && err.report) {
      return res.status(502).json({
        message: err.message,
        report: {
          id: err.report._id,
          createdAt: err.report.createdAt,
          modelVersion: err.report.modelVersion,
          result: err.report.result,
          error: err.report.error,
        },
      });
    }
    next(err);
  }
}

async function saveFeedback(req  ,res,next){
  try{
    const {id }=req.params;
    const {rating, reason=''}=req.body;

    if(!mongoose.isValidObjectId(id)){
      return res.status(400).json({message: 'Rating must be helpful or not_helpful',});
    }
    if(typeof reason!=='string'){
      return res.status(400).json({ message: 'Reason must be text'});

    }
    
  }
}

module.exports = { latest, refresh };
