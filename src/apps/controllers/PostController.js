const Posts = require("../models/Posts");
const Users = require("../models/Users");

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

    return res.status(200).json({ message: "Post Criado com sucesso!" });
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

  async update(req, res) {
    const { image, description, number_likes } = req.body;

    const { id } = req.params;

    const post = await Posts.findOne({
      where: {
        id: id,
      },
    });

    if (!post) {
      return res.status(400).json({ message: "Post não encontrado!" });
    }

    if (post.author_id != req.userId) {
      return res
        .status(401)
        .json({ message: "Você não tem permissão para atualizar este post!" });
    }

    const postUpdate = await Posts.update(
      {
        image: image || post.image,
        description: description || post.description,
        number_likes: number_likes || post.number_likes,
      },
      {
        where: { id: post.id },
      }
    );

    if (!postUpdate) {
      return res.status(400).json({ message: "Falha ao atualizar post!" });
    }

    return res.status(200).json({ message: "Post atualizado com sucesso!" });
  }

  async addLike(req, res) {
    const { id } = req.params;

    const post = await Posts.findOne({
      where: {
        id: id,
      },
    });

    if (!post) {
      return res.status(400).json({ message: "Post não encontrado!" });
    }

    const postUpdate = await Posts.update(
      {
        number_likes: post.number_likes + 1,
      },
      {
        where: { id: post.id },
      }
    );

    if (!postUpdate) {
      return res.status(400).json({ message: "Falha ao dar like no post!" });
    }

    const getPost = await Posts.findOne({
      where: {
        id: id,
      },
    });

    return res.status(200).json({
      message: "Adicionado o Like com sucesso!",
      number_likes: getPost.number_likes,
    });
  }

  async listMyPost(req, res) {
    const allPosts = await Posts.findAll({
      attributes: ["id", "image", "number_likes", "description"],
      where: {
        author_id: req.userId,
      },
    });

    if (!allPosts) {
      return res
        .status(400)
        .json({ message: "Falha em listas todos os posts do usuario!" });
    }

    return res.status(200).json(allPosts);
  }

  async listAllPost(req, res) {
    const allPosts = await Posts.findAll({
      attributes: ["id", "image", "number_likes", "description"],
      include: [
        {
          model: Users,
          as: "user",
          required: true,
          attributes: ["id", "user_name", "avatar"],
        },
      ],
    });

    if (!allPosts) {
      return res.status(400).json({ message: "Falha em listas todos os posts!" });
    }

    return res.status(200).json(allPosts);
  }
}

module.exports = new postController();
