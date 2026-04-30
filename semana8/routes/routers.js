import express from 'express'



import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken'

import db from '../lib/db.js'
import userMiddleware from '../middleware/users.js'

const router = express.Router()

router.post('/sign-up',userMiddleware.validateRegister,(req,res,next)=>{
    db.query(
        'SELECT id FROM users WHERE LOWER(username) = LOWER(?)',
        [req.body.username],
        (err,result)=>{
            if (result && result.length){
                return res.status(409).send({
                    message:'este usuario ya existe'

                })
            }else{
                bcrypt.hash(req.body.password,10,(err,hash)=>{
                    if (err){
                        return res.status(500).send({
                            message:err,
                        })
                    }
                    else{
                        db.query(
                            'INSERT INTO users(id,username,password,registered)VALUES(?,?,?,now());',
                            [uuidv4(), req.body.username, hash],
                            (err,result)=>{
                                if(err){
                                    return res.status(400).send({
                                        message:err,
                                    })
                                }
                                return res.status(201).send({
                                    message: 'registrado'
                                })
                            }
                        )
                    }
                })
            }
        }
    )
})

router.post('/login', (req, res, next) => {
  db.query(
    `SELECT * FROM users WHERE username = ?;`,
    [req.body.username], 
    (err, result) => {
      if (err) {
        return res.status(400).send({
          message: err,
        });
      }
      if (!result.length) {
        return res.status(400).send({
          message: 'Usuario o contraseña incorrecta!',
        });
      }
      bcrypt.compare(
        req.body.password,
        result[0]['password'],
        (bErr, bResult) => {
          if (bErr) {
            return res.status(400).send({
              message: 'Usuario o contraseña incorrecta!',
            });
          }
          if (bResult) {
    
            const token = jwt.sign(
              {
                username: result[0].username,
                userId: result[0].id,
              },
              'SECRETKEY',
              { expiresIn: '7d' }
            );
            db.query(`UPDATE users SET last_login = now() WHERE id = ?;`, [
              result[0].id,
            ]);
            return res.status(200).send({
              message: 'sesion iniciada',
              token,
              user: result[0],
            });
          }
          return res.status(400).send({
            message: 'Usuario o contraseña incorrecta!',
          });
        }
      );
    }
  );
});

router.get('/secret-route',userMiddleware.isLoggedIn,(req,res,next)=>{
    console.log(req.userData);
    res.send('este es un secreto')
})

export default router;