const Posts = require("../models/Posts");

class postController {
  async create(req, res) {
    const { image, description } = req.body;

    const newPost = await Posts.create({
      image,
      description,
      author_id: req.userId,
    });

    if (!newPost) {
      return res.status(400).json({ message: "Falha ao cadastrar post!" });
    }

    return res.status(200).json({ data: { image, description } });
  }

  async delete(req, res) {
    const { id } = req.params;

    const verifyPost = await Posts.findOne({
      where: {
        id,
      },
    });

    if (!verifyPost) {
      return res.status(400).json({ message: "Post não existe!" });
    }

    if (verifyPost.author_id != req.userId) {
      return res
        .status(401)
        .json({ message: "Você não tem permissão para deletar este post!" });
    }

    const deletePost = Posts.destroy({
      where: {
        id,
      },
    });

    if (!deletePost) {
      return res.status(400).json({ message: "Falha ao deletar post!" });
    }

    return res
      .status(200)
      .json({ message: "post deletado com sucesso!", postId: verifyPost.id });
  }
}

module.exports = new postController();
