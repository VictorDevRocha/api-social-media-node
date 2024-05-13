const Users = require("../models/Users");
const bcryptjs = require("bcrypt");

class UserController {
  async getAllUsers(req, res) {
    const allUsers = await Users.findAll({
      order: [["id", "DESC"]],
      attributes: ["id", "name", "user_name", "bio", "email", "avatar", "gender"],
    });
    res.send(allUsers);
  }

  async create(req, res) {
    const verifyUserEmail = await Users.findOne({
      where: {
        email: req.body.email,
      },
    });

    const verifyUserUserName = await Users.findOne({
      where: {
        user_name: req.body.user_name,
      },
    });

    if (verifyUserEmail) {
      return res.status(400).json({ message: "E=mail ja registrado!" });
    }

    if (verifyUserUserName) {
      return res.status(400).json({ message: "Usuario ja registrado!" });
    }

    const user = await Users.create(req.body);
    if (!user) {
      return res.status(400).json({ message: "Falha ao registrar usuario!" });
    }

    return res.send({ message: "Usuario Registrado com sucesso!" });
  }

  async update(req, res) {
    const {
      name,
      avatar,
      bio,
      gender,
      old_password,
      new_password,
      confirm_new_password,
    } = req.body;

    const user = await Users.findOne({
      where: req.userId,
    });

    if (!user) {
      return res.status(400).json({ message: "Usuario não existe!" });
    }

    let encryptedPassword = "";

    if (old_password) {
      if (!(await user.checkPassword(old_password))) {
        return res
          .status(401)
          .json({ message: "Senha antiga informada não é igual a atual!" });
      }

      if (!new_password || !confirm_new_password) {
        return res.status(401).json({
          message: "O campo Nova senha e o Confirme nova senha são obrigatorios!",
        });
      }

      if (new_password != confirm_new_password) {
        return res
          .status(401)
          .json({ message: "A Nova senha não é igual a confirmação de senha!" });
      }

      encryptedPassword = await bcryptjs.hash(new_password, 8);
    }

    await Users.update(
      {
        name: name || user.name,
        avatar: avatar || user.avatar,
        bio: bio || user.bio,
        gender: gender || user.gender,
        password_hash: encryptedPassword || user.password_hash,
      },
      {
        where: { id: user.id },
      }
    );

    return await res
      .status(200)
      .json({ message: "Usuario atualizado com sucesso!", userId: user.id });
  }

  async delete(req, res) {
    const id = req.params.id;
    const userToDelete = await Users.findOne({
      where: {
        id: req.userId || id,
      },
    });

    if (!userToDelete) {
      return res.status(401).json({ message: "Usuario não encontrado!" });
    }

    await Users.destroy({
      where: {
        id: req.userId || id,
      },
    });

    return res
      .status(200)
      .json({ message: "Usuario excluido com sucesso!", userId: userToDelete.id });
  }

  async profileUser(req, res) {
    const profileUser = await Users.findOne({
      attributes: ["id", "name", "user_name", "bio", "email", "avatar", "gender"],
      where: {
        id: req.userId,
      },
    });

    if (!profileUser) {
      return res.status(400).json({ message: "Usuario não encontrado" });
    }

    return res.status(200).json(profileUser);
  }
}

module.exports = new UserController();
