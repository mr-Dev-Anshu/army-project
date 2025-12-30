import { Offender } from "../models/Offenders";
import trackFieldSuggestions from "@/lib/fieldSuggestionTracker";
import { OFFENDER_SUGGESTION_CONFIG } from "@/lib/fieldSuggestionConfig/offender";

export class OffenderRepository {
  async getAll() {
    return await Offender.find().sort({ createdAt: -1 }).lean();
  }

  async getById(id) {
    return await Offender.findById(id).lean();
  }

  async getByOffenceId(offenceId) {
    return await Offender.find({ offenceId }).sort({ createdAt: -1 }).lean();
  }

  async create(data) {
    const offender = new Offender(data);
    await offender.save();
    const saved = offender.toObject();

    // Fire and forget suggestion tracking
    trackFieldSuggestions(saved, OFFENDER_SUGGESTION_CONFIG).catch(err => {
      console.error("Tracking Suggestions Error (Offender):", err);
    });

    return saved;
  }

  async update(id, data) {
    return await Offender.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
  }

  async delete(id) {
    return await Offender.findByIdAndDelete(id).lean();
  }
}

export const offenderRepo = new OffenderRepository();