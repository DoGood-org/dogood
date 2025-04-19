import dbConnect from "@/lib/dbConnect";
import Deed from "@/models/Deed";
import HelpHour from "@/models/HelpHour";
import { formatISO, startOfDay } from "date-fns";
import mongoose from "mongoose";

export default async function handler(req, res) {
    const {
        query: { userId },
    } = req;

    console.log("📊 GET stats for:", userId);

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid userId format" });
    }

    try {
        await dbConnect();

        const objectId = new mongoose.Types.ObjectId(userId);

        const deeds = await Deed.find({ user: objectId });
        const hours = await HelpHour.find({ user: objectId });

        const totalDeeds = deeds.length;
        const totalHours = hours.reduce((sum, item) => sum + item.hours, 0);

        const activityByDate = {};

        [...deeds, ...hours].forEach((item) => {
            const created = item.createdAt || item.date;
            if (created) {
                const date = formatISO(startOfDay(created), { representation: "date" });
                activityByDate[date] = (activityByDate[date] || 0) + 1;
            }
        });

        res.json({ totalDeeds, totalHours, activityByDate });
    } catch (err) {
        console.error("📊 Stats API error:", err);
        res.status(500).json({ error: "Failed to fetch stats" });
    }
}
