const AsyncHandler = require('express-async-handler');
const  {Resend} =  require('resend');
const User = require('../model/User');
const {hashPassword, isPasswordMatched} = require("../utils/helpers");
let ejs = require('ejs');
const path = require("path");

exports.getUsers = AsyncHandler(async (req, res) => {
    const users = await User.find().populate('agence');
    res.status(200).json({
        status: "Success",
        message: "La liste des utilisateurs a été récupérée avec succès",
        data: users
    })

});


exports.getUser = AsyncHandler(async (req, res) => {
    res.status(200).json({
        status: "Success",
        message: "L'utilisateur' a été récupérée avec succès",
        data: req.userAuth
    })

});


exports.updateSign = AsyncHandler(async (req, res) => {
    const {signature} = req.body
    const binaryData = Buffer.from(signature, 'base64');
    const updateUser = await User.findByIdAndUpdate(req.userAuth._id, {
        signature: binaryData,
    }, {
        new: true,
    })

    res.status(200).json({
        status: "Success",
        message: "La signature a été modifiée avec succès",
        data: updateUser
    })

});

exports.updatePassword= AsyncHandler(async (req, res) => {

    const {password} = req.body
    const user = await  User.findById(req.params.id);

    const updateUser = await User.findByIdAndUpdate(req.params.id, {
        password: await hashPassword(password),
    }, {
        new: true,
    })

    const resend = new Resend('re_FhnxFeE6_BpiD5fYsMvY6vSvRfqkeSgQP');


    resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'ivoprestalertes@gmail.com',
        subject: 'Réinitialisation du mot de passe',
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8" />
            <title>Bienvenue dans l'application VTR21 2.0</title>
            <style>
                * {
                    font-family: sans-serif;
                }
            </style>
        </head>
        <body style="background-color: #f2f7f9;">
        <div style="background-color: white;max-width:500px;display:block;width: 500px;margin-left: auto;margin-right: auto;margin-top: 33px;">
            <table width="100%" align="center" border="0" cellspacing="0" cellpadding="0" style="background-color:white;padding-top: 15px;border-top: 4px solid <%= couleurSociete %>;padding-left: 30px;padding-right: 30px;">
                <tr style="background-color:white;">
                    <td align="center" style="background-color:white;">
                        <img class="center" src="https://ivoprest.com/vtr.png" alt="logo"/>
                    </td>
                </tr>
                <tr>
                    <td>
                        <br /><br />Bonjour ${user.lastname} ${user.firstname},<br /><br />
                    </td>
                </tr>
                <tr>
                    <td>
                        Votre mot de passe a été réinitialisé, vous pouvez désormais accéder à VTR21 2.0 avec le nouveau mot de passe.<br /><br />
                    </td>
                </tr>
                <tr>
                    <td>
                        Pour vous connecter, utilisez votre adresse mail professionnelle et votre mot de passe changé par votre administrateur.<br /><br />
                    </td>
                </tr>

                <tr>
                    <td align="center" style="cursor:pointer">
                        <div style="background: '#3D92F5'>;width:200px;height:20px;-webkit-border-radius: 20px; -moz-border-radius: 20px;border-radius: 20px;padding-left: 20px;padding-right: 20px;padding-top: 10px;padding-bottom: 10px;width:300px;text-align:center;">
                            <a href="https://vtr21.pac.bj" style="color: white;text-decoration:none;">
                                Se connecter
                            </a>
                        </div>
                    </td>
                </tr>
            </table>
            <br />
            <br />
        </div>
        <br />
        <table align="center" border="0" cellspacing="0" cellpadding="0" width="100%">
            <tr>
                <td align="center">
                    <div style="margin-left: auto;margin-right: auto;text-align: center;color: #A0ACC3;font-family: sans-serif;font-size: 12px;width: 500px;text-align:center;">
                        Ce message vous est adressé automatiquement.Nous vous remercions de ne pas répondre ni d'utiliser cette adresse email.
                        Nous ne vous demanderons jamais votre mot de passe et nous vous déconseillons vivement de le partager avec qui que ce soit.
                    </div>
                </td>
            </tr>
        </table>
        <br>
        </body>
        </html>
    `,
    });


    res.status(200).json({
        status: "Success",
        message: "Le mot de passe a été modifiée avec succès",
        data: updateUser
    })

});







