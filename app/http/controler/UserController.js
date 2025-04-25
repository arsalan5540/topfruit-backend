const _ = require("lodash");
const bcrypt = require("bcrypt");
const UserModel = require("../../models/User");
const Payment = require("../../models/Payment");
const ZarinpalCheckout = require("zarinpal-checkout");
const zarinpal = ZarinpalCheckout.create(
  "00000000-0000-0000-0000-000000000000",
  true
);
const {
  validateCreateUser,
  validateLoginUser,
} = require("../validator/UserValidator");

class UserController {
  async login(req, res) {
    const { error } = validateLoginUser(req.body);
    if (error) return res.status(400).send({ message: error.message });

    let user = await UserModel.findOne({ phone: req.body.phone });
    if (!user)
      return res
        .status(400)
        .send({ message: "کاربری با این ایمیل یا پسورد یافت نشد" });

    const result = await bcrypt.compare(req.body.password, user.password);
    if (!result)
      return res
        .status(400)
        .send({ message: "کاربری با این ایمیل یا پسورد یافت نشد" });

    const token = user.generateAuthToken();
    res
      .header("Access-Control-Expose-headers", "x-auth-token")
      .header("x-auth-token", token)
      .status(200)
      .send({ success: true });
  }

  async register(req, res) {
    const { error } = validateCreateUser(req.body);
    if (error) return res.status(400).send({ message: error.message });

    let user = await UserModel.findOne({ phone: req.body.phone });
    if (user)
      return res.status(400).send({ message: "کاربری با این ایمیل وجود دارد" });
    user = new UserModel(_.pick(req.body, ["name", "phone", "password"]));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user = await user.save();

    const token = user.generateAuthToken();
    res
      .header("Access-Control-Expose-headers", "x-auth-token")
      .header("x-auth-token", token)
      .status(200)
      .send(user);
  }

  async updateBasket(req, res) {
    const basketBody = _.pick(req.body, ["products", "userData"]);
    const totalPrice = new UserModel(_.pick(req.body, ["totalPrice"]));
    if (!basketBody.products)
      return res
        .status(400)
        .send({ message: "حداقل یه دونه محصول باید برگردونی" });
    const user = await UserModel.findById(req.user._id);
    if (!user)
      return res.status(401).send({ message: "شما کاربر لاگین شده نیستید" });
    user.basket = basketBody;
    user.totalPrice = totalPrice.totalPrice;
    await user.save();
    res.send(200);
  }

  async getBasket(req, res) {
    const user = await UserModel.findById(req.user._id);
    res.send(user.basket);
  }

  async checkoutBasket(req, res) {
    const user = await UserModel.findById(req.user._id);
    const basket = user.basket;
    const amount = user.totalPrice;
    const payment = new Payment({
      user: {
        _id: user._id,
        phone: user.phone,
        name: user.name,
      },
      basket,
      amount,
    });
    const response = await zarinpal.PaymentRequest({
      Amount: amount, // In Tomans
      CallbackURL: "http://localhost:3000/api/user/verifyPayment",
      Description: "پرداخت به تاپ فروت",
      Mobile: user.phone,
    });
    payment.paymentCode = response.authority;
    await payment.save();
    user.basket = undefined;
    await user.save();
    res.send({ url: response.url });
  }
  async verifyPayment(req, res) {
    const paymentCode = req.query.Authority;
    const status = req.query.Status;
    const payment = await Payment.findOne({
      paymentCode,
    });
    if (status === "OK") {
      const response = await zarinpal.PaymentVerification({
        Amount: payment.amount, // In Tomans
        Authority: paymentCode,
      });
      if (response.status === -21) {
        res.send("پرداخت پیدا نشد!");
      } else {
        payment.refId = response.RefID;
        payment.success = true;
        await payment.save();
        res.send(`<div><h1 style="display: flex !important; justify-content : center; margin-top : 100px"
        >Verified! Ref ID: ${response.RefID}</h1>
        <a style="display: flex !important; justify-content : center; margin-top : 10px"
         href="http://localhost:3001/checkout?paymentCode=${paymentCode}">بازگشت به سایت</a></div>`);
      }
    } else
      return res.send(`<div><h1 style="display: flex !important; justify-content : center; margin-top : 100px"
      >پرداخت ناموفق</h1>
    <a style="display: flex !important; justify-content : center; margin-top : 10px"
     href="http://localhost:3001/">بازگشت به سایت</a></div>`);
  }

  async getPaymentDetail(req, res) {
    const paymentCode = req.params.paymentCode;
    const payment = await Payment.findOne({ paymentCode });
    if (payment) res.send(payment);
    else res.status(404).send("پیدا نشد");
  }
}

module.exports = new UserController();
