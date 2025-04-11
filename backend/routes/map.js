const express = require("express");
const router = express.Router();
const MapPoint = require("../models/MapPoint");
const jwt = require("jsonwebtoken");

// Auth middleware
const auth = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "No token" });

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error("Auth error:", err);
        return res.status(401).json({ error: "Invalid token" });
    }
};

// Helper to calculate distance (Haversine formula)
function isWithinRadius(lat1, lng1, lat2, lng2, radiusKm) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c <= radiusKm;
}

// GET /api/map
router.get("/", async (req, res) => {
    const { type, search, lat, lng, distance } = req.query;
    const query = {};

    if (type && ["help", "need"].includes(type)) {
        query.type = type;
    }

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
        ];
    }

    try {
        let data = await MapPoint.find(query).sort({ createdAt: -1 });

        if (lat && lng && distance) {
            const userLat = parseFloat(lat);
            const userLng = parseFloat(lng);
            const maxDist = parseFloat(distance);
            data = data.filter((point) =>
                isWithinRadius(userLat, userLng, point.lat, point.lng, maxDist)
            );
        }

        res.json(data);
    } catch (err) {
        console.error("Database error in GET /api/map:", err);
        res.status(500).json({ error: "Failed to load map points", details: err.message });
    }
});

// POST /api/map/add
router.post("/add", auth, async (req, res) => {
    const { name, description, lat, lng, type } = req.body;
    if (!name || !description || !lat || !lng || !type) {
        return res.status(400).json({ error: "Missing fields" });
    }

    try {
        const newPoint = new MapPoint({
            name, description, lat, lng, type, user: req.user.id,
        });
        await newPoint.save();
        res.json({ message: "Map point added successfully" });
    } catch (err) {
        console.error("Error in POST /api/map/add:", err);
        res.status(500).json({ error: "Failed to save map point", details: err.message });
    }
});

// DELETE /api/map/:id
router.delete("/:id", auth, async (req, res) => {
    try {
        const point = await MapPoint.findById(req.params.id);
        if (!point) return res.status(404).json({ error: "Point not found" });

        if (point.user.toString() !== req.user.id) {
            return res.status(403).json({ error: "Not authorized to delete this point" });
        }

        await point.deleteOne();
        res.json({ message: "Point deleted successfully" });
    } catch (err) {
        console.error("Error deleting point:", err);
        res.status(500).json({ error: "Error deleting point", details: err.message });
    }
});

module.exports = router;
