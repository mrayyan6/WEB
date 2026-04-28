import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema({
  lead_id:         { type: String },
  date_created:    { type: Date },
  source:          { type: String },
  property_type:   { type: String },
  city:            { type: String },
  budget_min:      { type: Number },
  budget_max:      { type: Number },
  bedrooms:        { type: Number },
  lead_status:     { type: String },
  agent:           { type: String },
  conversion_flag: { type: Number },
  days_to_convert: { type: Number, default: null },
});

export default mongoose.models.Lead || mongoose.model("Lead", LeadSchema);
