/*
    path: api/login

*/
const { Router } = require('express');
const { check } = require('express-validator');

const { signin, signup, logout } = require('../controller/login');
const { validarCampos } = require('../middlewares/validar_campos');

const router = Router();


router.post('/registro', [
    check('username','El nombre es obligatorio').not().isEmpty(),
    check('username', 'Debe contener maximo 20 caracteres').isLength({ min: 5, max:20 }),
    check('password','La contraseña es obligatoria').not().isEmpty(),
    check('password', 'Debe contener maximo 20 caracteres').isLength({ min: 5, max:20 }),
    check('email','El correo es obligatorio').isEmail(),
    validarCampos
], signup );

router.post('/acceso', [
    check('password','La contraseña es obligatoria').not().isEmpty(),
    check('password', 'Debe contener maximo 20 caracteres').isLength({ min: 5, max:20 }),
    check('username', 'Debe contener maximo 20 caracteres').isLength({ min: 5, max:20 }),
    check('username','El correo es obligatorio').not().isEmpty(),
], signin );

router.post('/salir', [
    check('id','Debe ingresar un ID').not().isEmpty(),
], logout );


module.exports = router;