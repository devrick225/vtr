const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const authRouter = require('../routes/authRouter');
const userGroupRouter = require('../routes/admin/UserGroupRouter');
const privilegeRouter = require("../routes/admin/PrivilegeRouter");
const serviceAssistanceRouter = require("../routes/admin/ServiceAssistanceRouter");
const prestataireRouter = require("../routes/admin/PrestataireRouter");
const typeDocumentRouter = require("../routes/admin/TypeDocumentRouter");
const zoneRouter = require("../routes/admin/ZoneRouter");
const etatRouter = require("../routes/admin/EtatRouter");
const accessRouter = require("../routes/admin/AccessRouter");
const quaiRouter = require("../routes/admin/QuaiRouter");
const navireRouter = require("../routes/admin/NavireRouter");
const positionNavireRouter = require("../routes/admin/PositionNavireRouter");
const typeMouvementRouter = require("../routes/admin/TypeMouvementRouter");
const typeOperationRouter = require("../routes/admin/TypeOperationRouter");
const marchandiseRouter = require("../routes/admin/MarchandiseRouter");
const conditionnementRouter = require("../routes/admin/ConditionnementRouter");
const escaleRouter = require("../routes/escaleRouter");
const demandeRouter = require("../routes/demandeRouter");
const bollardRouter = require("../routes/admin/BollardRouter");
const historiqueActionRouter = require("../routes/historiqueActionRouter");
const documentRouter = require("../routes/documentRouter");
const mouvementRouter = require("../routes/mouvementRouter");

const acconierRouter = require("../routes/admin/AcconierRouter");
const agenceRouter = require("../routes/admin/AgenceRouter");
const prestationRouter = require("../routes/prestationsRouter");
const conferenceRouter = require("../routes/conferenceRouter");
const userRouter = require("../routes/UserRouter");
const notificationRouter = require("../routes/notificationRouter");
const operationRouter = require("../routes/operationRouter");

const {notFoundErr, globalErrHandler} = require("../middlewares/globalErrHandler");

const app = express();
const dirname = path.dirname(__dirname);
app.use('/uploads', express.static(path.join(dirname, '/uploads')))


//Middlewares
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`)
    next();
})


//Routes
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/acconiers", acconierRouter)
app.use("/api/v1/agences", agenceRouter)
app.use("/api/v1/conferences", conferenceRouter)
app.use("/api/v1/prestations", prestationRouter)
app.use("/api/v1/user-groups", userGroupRouter)
app.use("/api/v1/privileges", privilegeRouter)
app.use("/api/v1/prestataires", prestataireRouter)
app.use("/api/v1/service-assistances", serviceAssistanceRouter)
app.use("/api/v1/type-documents", typeDocumentRouter)
app.use("/api/v1/type-mouvements", typeMouvementRouter)
app.use("/api/v1/type-operations", typeOperationRouter)
app.use("/api/v1/marchandises", marchandiseRouter)
app.use("/api/v1/conditionnements", conditionnementRouter)
app.use("/api/v1/zones", zoneRouter)
app.use("/api/v1/etats", etatRouter)
app.use("/api/v1/access", accessRouter)
app.use("/api/v1/quais", quaiRouter)
app.use("/api/v1/navires", navireRouter)
app.use("/api/v1/position-navires", positionNavireRouter)
app.use("/api/v1/escales", escaleRouter)
app.use("/api/v1/demandes", demandeRouter)
app.use("/api/v1/bollards", bollardRouter)
app.use("/api/v1/notifications", notificationRouter)
app.use("/api/v1/historique-actions", historiqueActionRouter)
app.use("/api/v1/documents", documentRouter)
app.use("/api/v1/mouvements", mouvementRouter)
app.use("/api/v1/operations", operationRouter)

app.get('/.well-known/pki-validation/:filename', (req, res) => {
    const filePath = path.join(dirname+'/.well-known/pki-validation/', req.params.filename);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('File not found');
    }
});
//Error Middlewares
app.use(globalErrHandler);
app.use(notFoundErr);




module.exports = app;
