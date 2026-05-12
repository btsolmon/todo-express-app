import jwt from "jsonwebtoken";
import { UserModel } from "./models/user-model.js";

export const auth = async (req, res, next) => {
  const rawToken = req.headers.authorization;
  if (!rawToken?.startsWith("Bearer")) {
    return res.status(401).send({ message: "Invalid token" });
  }
  const token = rawToken.split(" ")[1];

  let payload = null;
  try {
    payload = jwt.verify(token, "MySecret");
  } catch (e) {
    return res.status(401).send({ message: "Invalid token" });
  }

  console.log({ payload });

  const existingUser = await UserModel.findOne({ _id: payload._id });
  if (!existingUser) {
    return res.status(401).send({ message: "User no longer exists" });
  }
  console.log({ existingUser });
  req.user = existingUser;
  next();
};
