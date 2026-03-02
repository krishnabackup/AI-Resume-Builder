import ApiMetric from "../Models/ApiMetric.js";

const apiTracker = async (req, res, next) => {
    const start = Date.now();

    // Handle response finish
    res.on("finish", async () => {
        const duration = Date.now() - start;
        try {
            await ApiMetric.create({
                endpoint: req.originalUrl || req.url,
                method: req.method,
                statusCode: res.statusCode,
                responseTime: duration,
                userId: req.userId || null,
                ip: req.ip,
            });
        } catch (error) {
            console.error("Error saving API metric:", error);
        }
    });

    next();
};

export default apiTracker;
