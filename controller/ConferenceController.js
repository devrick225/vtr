const AsyncHandler = require('express-async-handler');
const Conference = require('../model/Conference');
const User = require("../model/User");
const Notification = require("../model/Notification");
const nodemailer = require('nodemailer');
const axios = require("axios");

// Créer un transporteur en utilisant le service Gmail et les informations d'authentification
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ivoprestalertes@gmail.com',
        pass: 'xdqi oekr ohqn rlum'
    }
});

const generateEmailContent = (messages) => {
    let htmlContent = `
    <html>
    <head>
        <style>
            table {
                width: 100%;
                border-collapse: collapse;
            }
            table, th, td {
                border: 1px solid black;
            }
            th, td {
                padding: 10px;
                text-align: left;
            }
            th {
                background-color: #f2f2f2;
            }
        </style>
    </head>
    <body>
        <h2>Récapitulatif des messages</h2>
        <table>
            <tr>
                <th>ID</th>
                <th>Date de création</th>
                <th>Nom d'utilisateur</th>
                <th>Message</th>
                <th>Sender ID</th>
            </tr>`;

    messages.forEach(message => {
        htmlContent += `
            <tr>
                <td>${message.id}</td>
                <td>${new Date(message.created).toLocaleString()}</td>
                <td>${message.sender_username}</td>
                <td>${message.text}</td>
                <td>${JSON.parse(message.custom_json).sender_id}</td>
            </tr>`;
    });

    htmlContent += `
        </table>
    </body>
    </html>`;

    return htmlContent;
};

exports.startConference = AsyncHandler(async (req, res) => {
    const userAuth = req.userAuth;
    const conferenceCreated = await Conference.create({
        heure_debut: new Date().toLocaleTimeString(['FR'], {hour: '2-digit', minute: '2-digit', second: '2-digit'}),
        user_run: userAuth._id,
    })
    const users = await User.find({});
    const messageConference = `L'agent ${userAuth.lastname} ${userAuth.firstname} démarrer la conférence virtuelle du jour à ${new Date().toLocaleTimeString(['FR'], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })}.`
    for (const receiver of users) {
        const notification = new Notification({sender: userAuth._id, receivers: [receiver], messageConference});
        await notification.save();
    }
    res.status(201).json({
        status: "Success",
        message: "La conférence a été crée avec succès",
        data: conferenceCreated
    })
});

exports.todayConference = AsyncHandler(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const query = {createdAt: {$gte: today, $lt: tomorrow}};
    const conferences = await Conference.find(query)

    if (conferences.length > 0) {
        res.status(200).json({
            status: "Success",
            message: "La conférence a été démarrer avec succès",
            data: conferences
        })
    } else {
        res.status(200).json({
            status: "Success",
            message: "Pas de conférence active",
            data: conferences
        })
    }
})

exports.closeConference = AsyncHandler(async (req, res) => {
    const userAuth = req.userAuth;
    const conferenceUpdated = await Conference.findByIdAndUpdate(req.params.id, {
        heure_fin: new Date().toLocaleTimeString(['FR'], {hour: '2-digit', minute: '2-digit', second: '2-digit'}),
        user_off: userAuth._id,
        closed: true,
        close_at: new Date()
    }, {
        new: true,
    })

    const users = await User.find({});
    const messageConference = `L'agent ${userAuth.lastname} ${userAuth.firstname} a clôturé la conférence virtuelle du jour à ${new Date().toLocaleTimeString(['FR'], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })}.`
    for (const receiver of users) {
        const notification = new Notification({sender: userAuth._id, receivers: [receiver], messageConference});
        await notification.save();
    }

    res.status(200).json({
        status: "success",
        message: "La conférence a été clôturée avec succès",
        data: conferenceUpdated
    })
})


exports.dayConference = AsyncHandler(async (req, res) => {

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0); // Début de la journée

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999); // Fin de la journée

    const conferences = await Conference.find({
        startTime: {
            $gte: startDate,
            $lte: endDate
        }
    }).populate('host');

    res.status(200).json({
        status: "Success",
        message: "La conférence a été crée avec succès",
        data: conferences
    })


})

exports.demarrerConference = AsyncHandler(async (req, res) => {
    const hostId = req.userAuth;

    const date = new Date(); // La date d'aujourd'hui
    date.setHours(0, 0, 0, 0); // Réinitialiser l'heure pour ne garder que la date

    const existingConference = await Conference.findOne({host: hostId, date});

    if (existingConference) {
        return res.status(400).json({
            status: "Error",
            message: "Une conférence pour cet hôte existe déjà pour aujourd'hui.",
            data: conference
        });
    }

    const {title} = req.body;
    const host = await User.findById(hostId);
    if (!host) {
        throw new Error(`Host not found`);
    }

    const conference = new Conference({title, date, host: hostId});
    await conference.save();

    res.status(201).json({
        status: "Success",
        message: "La conférence a été crée avec succès",
        data: conference
    })

})


exports.rejoindreConference = AsyncHandler(async (req, res) => {
    const userId = req.userAuth;
    const conference = await Conference.findById(req.params.id);

    if (!conference) {
        return res.status(404).json({
            status: "error",
            message: "Conference not found",
        })
    }
    if (!conference.participants.includes(userId)) {

        conference.participants.push(userId);
        await conference.save();
        res.status(200).json({
            status: "Success",
            message: "Le participant a été ajouté avec succès",
            data: conference
        })

    }


})


exports.terminerConference = AsyncHandler(async (req, res) => {

// Envoi de l'email

    try {
        const conference = await Conference.findById(req.params.id);
        if (!conference) {
            return res.status(404).send('Conference not found');
        }

        const headers = {
            'Project-ID': '6f08a0dc-20ad-4819-bb2c-ac40d9cf8854',
            'User-Name': 'pac',
            'User-Secret': 'pac2024',
        };
        const responseMessage = await axios.get(
            `https://api.chatengine.io/chats/256648/messages/`,
            {headers}
        )
        const filterTodayMessages = (messages) => {
            const today = new Date().toISOString().split('T')[0];
            console.log('today', today)

            return messages.filter(message => {
                console.log('message', message.created.split(' ')[0])
                const messageDate = message.created.split(' ')[0];
                return messageDate === today;
            });
        };

        const todayMessages = filterTodayMessages(responseMessage.data);
        conference.isActive = false;
        conference.endTime = new Date();


        const emails = "erickoffi29@gmail.com,cfayomi@pac.bj,ano@gmail.com,daouda@gmail.com,jacques@gmail.com,hamed@gmail.com,aquamarine@gmail.com,deltamarine@gmail.com,oliviergaba@gmail.com,irene@gmail.com,abdallah@gmail.com,cto.tnoutche@cma-cgm.com,fsefoucodjo@pac.bj,atral@gmail.com,pil@gmail.com,rlogic@gmail.com,romeoagri@gmail.com,lokossou@gmail.com,cyrille@gmail.com,aze@gmail.com,rekiath@gmail.com,soufianou@pac.bj,jdohou@pac.bj,kcornilly@pac.bj,kcornilly1@pac.bj,kcornilly2@pac.bj,tdesmed@pac.bj,tdesmed1@pac.bj,tdesmed2@pac.bj,tmichielsen@pac.bj,tmichielsen1@pac.bj,tmichielsen2@pac.bj,kalo@gmail.com,messi@gmail.com,ekoffi@gmail.com,agentvtr21@gmail.com,testcmacgm@gmail.com,danilocombs@gmail.com,afrigo@gmail.com,aldoline@gmail.cm,aquamarine@gmail.cm,maerskline@gmail.com,k.jabou@westatlantic-group.com,ogaba@pac.bj,amamatoure@pac.bj,ihounnounkpe@pac.bj,contact@dmscotonou.com,jdjangbo@pac.bj,cbadet@pac.bj,dahouandokoun@pac.bj,ndossouyovo@pac.bj,lhinwatonou@pac.bj,Jaguessyvognon@pac.bj,sglelekakai@pac.bj,gwene@pac.bj,CTO.LSAIDROBLEH@cma-cgm.com,cto.hhongbete@cma-cgm.com,almero.nonfon@grimaldi-benin.com,cto.tnoutche@msc.com,narouna@pac.bj,v.gnimassou@atralbenin.com,m.houngnon@atralbenin.com,rkoumagnon@pac.bj,jseriki@pac.bj,brim.zannou@bjc.pilship.com,orden.sawanou@bjc.pilship.com,cto.wdansou@cma-cgm.com,h.adissotoun@rlogistic.onmicrosoft.com,ayoussoufou@pac.bj,desire.hessou@navitrans.com,bj.ops@ecowasgroupe.com,ezechielotchere@gmail.com,claude.houtchai@aglgroupe.com,alfred.adda@aglgroupe.com,didier.gaga@aglgroupe.com,oronce.noutche@msc.com,prince.adossou@msc.com,aadjinda@supermaritime.com,nuvevlavo@gmail.Com,bsonon@supermaritime.com,maimouna.wazir@omagroup.com,arnaud.adjou-moumouni@omagroup.com,ragri@pac.bj,ayouba.karimou@sobemap.com,dehoueharold@gmail.com,fredilfoodsshipping@gmail.com,ignace.hangnon@aquamarine-bj.com,info@rmlogisticsbenin.com,trinitefatondji@gmail.com,gkedji@citc-inter.com,shipping.cbct@cbctgroup.com,clglele@pac.bj,credo@sharafbenin.com,benoit@sharafbenin.com,ksambianou@pac.bj,otchereezechiel@gmail.com,direction@westport-benin.com,lucoguidan@gmail.com,crew@sharafbein.com,gaudensdicode@gmail.com,gdansi@pac.bj,davahounzo@pac.bj,rbossa@pac.bj,emerick.degan@msc.com,charles.dahzoundji@grimaldi-benin.com,sandrine.gainsi@sobemap.com,claude.houtchai@aglgroup.com,famankpassa@pac.bj,operations.bj@navtrans.com,n.essou@r-logistic.com,waps_benin@westatlantic-group.com,mohammed.tchenegnon@maersk.com,caleb@sharafbenin.com,operationsteam@sharafbenin.com,balogoun@sharafbenin.com,ernest.migan@navitrans.com,CTO.RKOUEVIDJIN@cma-cgm.com,cto.cagnikpe@cma-cgm.com,m.toudonou@atralbenin.com,orden.sowanou@bjc.pilship.com,germain.foutouna@bjc.pilship.com,clement.hounhouenou@aglgroup.com,support.ivoprest-benin@ivoprest.com"
        // Configuration de l'email à envoyer
        let mailOptions = {
            from: 'ivoprestalertes@gmail.com', // adresse de l'expéditeur
            //to: 'erickoffi29@gmail.com, kemersonsteveelavagnon@gmail.com, rboukari@pac.bj, jdohou@pac.bj', // adresse du destinataire
            to: emails, // adresse du destinataire
            subject: 'Conférence virtuel du jour : ' + conference.date, // sujet de l'email
            html: generateEmailContent(todayMessages) // contenu de l'email en HTML (optionnel)
        };

        await conference.save();

        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Email sent: ' + info.response);
        });
        res.status(200).send(conference);
    } catch (error) {
        res.status(500).send(error.message);
    }
})
