const {createUser, getUsers, getUserById, updateUser, deleteUser, login} = require('./user.controller');
const router = require('express').Router();

router.post("/",createUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/", updateUser),
router.delete("/", deleteUser);
router.post("/login", login);

module.exports = router;