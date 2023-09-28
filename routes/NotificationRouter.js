const express = require('express')

const {getNotificationsUser, getNotificationsUserUnread, postNotificationRead
} = require("../controller/NotificationController")
const isAuthenticated = require("../middlewares/isAuthenticated");


const notificationRouter = express.Router();

notificationRouter.get('/', isAuthenticated, getNotificationsUser);
notificationRouter.get('/unread', isAuthenticated, getNotificationsUserUnread);
notificationRouter.post('/:id/read', isAuthenticated, postNotificationRead);

module.exports = notificationRouter
