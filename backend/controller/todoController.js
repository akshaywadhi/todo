const cloudinary = require("../config/cloudinary");
const todoModel = require("../models/todoModel");

/* ============================
   CREATE TODO
============================ */
exports.createTodo = async (req, res) => {
  console.log(req.file);
  console.log(req.headers["content-type"]);

  try {
    let imageData = null;

    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "todos",
      });

      imageData = {
        url: upload.secure_url,
        p_id: upload.public_id,
      };
    }

    const todo = await todoModel.create({
      title: req.body.title,
      desc: req.body.desc,
      image: imageData,
      user: req.user._id, // ✅ NEW (ownership)
    });

    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ============================
   GET TODOS (USER-SCOPED)
============================ */
exports.getTodo = async (req, res) => {
  try {
    const todos = await todoModel
      .find({ user: req.user._id }) // ✅ ONLY user's todos
      .sort({ createdAt: -1 });

    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ============================
   UPDATE TODO (OWNERSHIP CHECK)
============================ */
exports.updateTodo = async (req, res) => {
  try {
    const todo = await todoModel.findOne({
      _id: req.params.id,
      user: req.user._id, // ✅ ownership enforced
    });

    if (!todo) {
      return res.status(404).json({
        message: "todo not found",
      });
    }

    todo.title = req.body.title;
    todo.desc = req.body.desc;

    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "todos",
      });

      if (todo.image?.p_id) {
        await cloudinary.uploader.destroy(todo.image.p_id);
      }

      todo.image = {
        url: upload.secure_url,
        p_id: upload.public_id,
      };
    }

    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ============================
   DELETE TODO (OWNERSHIP CHECK)
============================ */
exports.deleteTodo = async (req, res) => {
  try {
    const todo = await todoModel.findOne({
      _id: req.params.id,
      user: req.user._id, // ✅ ownership enforced
    });

    if (!todo) {
      return res.status(404).json({
        message: "todo not found",
      });
    }

    if (todo.image?.p_id) {
      await cloudinary.uploader.destroy(todo.image.p_id);
    }

    await todo.deleteOne();

    res.json({
      message: "todo deleted",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
