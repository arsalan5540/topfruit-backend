const _ = require('lodash');
const bcrypt = require('bcrypt');
const UserModel = require("../../models/User")
const {
    validateCreateUser,
    validateLoginUser
} = require('../validator/UserValidator');

class UserController {
    async login(req, res) {
        const {error} = validateLoginUser(req.body);
        if (error) return res.status(400).send({message: error.message});

        let user = await UserModel.findOne({phone: req.body.phone});
        if (!user)
            return res
                .status(400)
                .send({message: 'کاربری با این ایمیل یا پسورد یافت نشد'});

        const result = await bcrypt.compare(req.body.password, user.password);
        if (!result)
            return res
                .status(400)
                .send({message: 'کاربری با این ایمیل یا پسورد یافت نشد'});

        const token = user.generateAuthToken();
        res.header("Access-Control-Expose-headers", "x-auth-token").header('x-auth-token', token).status(200).send({success: true});

    }

    async register(req, res) {
        const {error} = validateCreateUser(req.body);
        if (error) return res.status(400).send({message: error.message});

        let user = await UserModel.findOne({phone: req.body.phone});
        if (user)
            return res
                .status(400)
                .send({message: 'کاربری با این ایمیل وجود دارد'});
        user = new UserModel(_.pick(req.body, ["name", "phone", "password"]))

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        user = await user.save();

        const token = user.generateAuthToken();
        res.header("Access-Control-Expose-headers", "x-auth-token").header('x-auth-token', token).status(200).send(user);
    }


    // async updateBasket(req, res) {
    //     const basketBody = _.pick(req.body, ["restaurantId", "restaurantName", "foods"]);
    //     if (!basketBody.foods)
    //         return res
    //             .status(400)
    //             .send({message: "حداقل یه دونه غذا باید برگردونی"});
    //     if (!basketBody.restaurantId || !basketBody.restaurantName)
    //         return res
    //             .status(400)
    //             .send({message: "مشخصات رستوران رو هم باید بفرستی"});
    //     const user = await UserModel.findById(req.user._id);
    //     if (!user)
    //         return res
    //             .status(401)
    //             .send({message: "شما کاربر لاگین شده نیستید"});
    //     user.basket = basketBody;
    //     await user.save();
    //     res.send(200)
    // }

    // async getBasket(req, res) {
    //     const user = await UserModel.findById(req.user._id);
    //     res.send(user.basket)
    // }
}

module.exports = new UserController();
