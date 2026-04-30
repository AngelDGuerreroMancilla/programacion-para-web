import jwt from 'jsonwebtoken';

export default {
    validateRegister: (req, res, next) => {
        if (!req.body.username || req.body.username.length < 3) {
            return res.status(400).send({
                message: 'ingrese un nombre de usuario con minimo 3 caracteres',
            });
        }
        if (!req.body.password || req.body.password.length < 6) {
            return res.status(400).send({
                message: 'ingrese una contraseña con minimo 6 caracteres',
            });
        }
        if (!req.body.password_repeat || req.body.password != req.body.password_repeat) {
            return res.status(400).send({
                message: 'las contraseñas deben coincidir',
            });
        }
        next();
    },

    isLoggedIn: (req, res, next) => {
        if (!req.headers.authorization) {
            return res.status(401).send({
                message: 'Tu sesion no es valida',
            });
        }
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader.split(" ")[1];
           
            const decoded = jwt.verify(token, 'SECRETKEY');
            req.userData = decoded;
            next();
        } catch (err) {
            return res.status(400).send({
                message: 'Tu sesion no es valida'
            });
        }
    } 
};