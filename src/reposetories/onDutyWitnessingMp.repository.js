import { OnDutyWitnessingMp } from "@/models/OnDutyWitnessingMp";
import trackFieldSuggestions from "@/lib/fieldSuggestionTracker";
import { ON_DUTY_WITNESSING_MP_SUGGESTION_CONFIG } from "@/lib/fieldSuggestionConfig/onDutyWitnessingMp";

export class OnDutyWitnessingMpRepository {
  async getAll() {
    return await OnDutyWitnessingMp.find().sort({ createdAt: -1 }).lean();
  }

  async getById(id) {
    return await OnDutyWitnessingMp.findById(id).lean();
  }

  async getByOffenceId(offenceId) {
    return await OnDutyWitnessingMp.find({ offenceId })
      .sort({ createdAt: -1 })
      .lean();
  }

  async create(data) {
    const witness = new OnDutyWitnessingMp(data);
    await witness.save();
    const saved = witness.toObject();

    // Fire and forget suggestion tracking
    trackFieldSuggestions(saved, ON_DUTY_WITNESSING_MP_SUGGESTION_CONFIG).catch(err => {
      console.error("Tracking Suggestions Error (OnDutyWitnessingMp):", err);
    });

    return saved;
  }

  async update(id, data) {
    return await OnDutyWitnessingMp.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
  }

  async delete(id) {
    return await OnDutyWitnessingMp.findByIdAndDelete(id).lean();
  }
}

export const onDutyWitnessingMpRepo = new OnDutyWitnessingMpRepository();