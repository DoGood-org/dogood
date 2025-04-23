const express = require("express");
const router = express.Router();
const MapPoint = require("../models/MapPoint");
const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
const auth = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "No token provided" });

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error("JWT verification error:", err);
        return res.status(401).json({ error: "Invalid token" });
    }
};

// Haversine formula to calculate distance between two points in kilometers
function isWithinRadius(lat1, lng1, lat2, lng2, radiusKm) {
    const R = 6371; // Radius of the Earth in km
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

// GET /api/map — returns filtered map pins
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

        // Filter by proximity if lat/lng/distance are provided
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
        console.error("Failed to fetch map data:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// POST /api/map — creates a new map pin
router.post("/", auth, async (req, res) => {
    const { name, description, type, lat, lng } = req.body;

    if (!name || !description || !type || lat === undefined || lng === undefined) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const newPoint = new MapPoint({
            user: req.user.id,
            name,
            description,
            type,
            lat,
            lng,
        });

        await newPoint.save();
        res.status(201).json(newPoint);
    } catch (err) {
        console.error("Failed to create map point:", err);
        res.status(500).json({ error: "Failed to create map point" });
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
