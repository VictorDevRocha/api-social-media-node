const { decryptedToken } = require("../../utils/token");
const { decrypt } = require("../../utils/crypt");

const verifyJwt = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não enviado!" });
  }

  try {
    const { userId } = await decryptedToken(authHeader);

    req.userId = parseInt(decrypt(userId));
    return next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Não Autorizado!" });
  }
};

module.exports = verifyJwt;
