import mongoose from 'mongoose';
import User from './models/User.js';
import Notification from './models/notification.js';

mongoose.connect("mongodb+srv://AiResumeBuilder_db_user:RtgWLL2enMQ8yoMP@airesume.reirunk.mongodb.net/?appName=AiResume")
    .then(async () => {
        try {
            const userId = '699ef846c58793342abb7059'; // from console
            const user = await User.findById(userId);
            if (!user) {
                console.log("user not found");
                process.exit(0);
            }

            user.adminRequestStatus = 'pending';
            await user.save();

            const adminUser = await User.findOne({ isAdmin: true });
            if (adminUser) {
                await Notification.create({
                    type: "ADMIN_REQUEST",
                    message: `${user.username || user.email} requested admin access`,
                    userId: adminUser._id,
                    actor: "user"
                });
            }
            console.log("Success");
        } catch (e) {
            console.log("Error:", e.message);
            console.log(e.stack);
        }
        process.exit(0);
    })
    .catch(e => {
        console.log("Mongo error:", e);
        process.exit(1);
    })
