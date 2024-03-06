const AsyncHandler = require('express-async-handler');
const Notification = require('../model/Notification');


exports.getNotificationsUser= AsyncHandler(async (req, res) => {
    const updateOperation = {
        $set: {
            receivers: req.userAuth._id,
            isRead: true,
        }
    };
    const notifications = await Notification.find({
        receivers: req.userAuth._id,
    }).sort('-timestamp');

    await Notification.updateMany({}, updateOperation)
    return res.status(200).json({
        status: "success",
        message: "Les notifications ont été récupérées avec succès",
        data: notifications
    })


});




exports.getNotificationsUserUnread= AsyncHandler(async (req, res) => {

    const notifications = await Notification.find({
        receivers: req.userAuth._id,
        isRead: false,
    }).sort('-timestamp');

    return res.status(200).json({
        status: "success",
        message: "Les notifications nont lues ont été récupérées avec succès",
        data: notifications
    })


});



exports.postNotificationRead = AsyncHandler(async (req, res) => {

    const notification = await Notification.findById(req.params.id);
    await notification.markAsRead(req.userAuth._id);


    return res.status(200).json({
        status: "success",
        message: "La notification a été lue",
    })


});




