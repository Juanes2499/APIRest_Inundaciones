const {
    crearUsuario, 
    consultarUsuarios,
    /*getUserById, 
    updateUser, 
    çdeleteUser, */
    login
} = require('./user.controller');
const router = require('express').Router();

router.post("/",crearUsuario);
router.get("/", consultarUsuarios);
/*router.get("/:id", getUserById);
router.put("/", updateUser),
router.delete("/", deleteUser);*/
router.post("/login", login);
    
module.exports = router;