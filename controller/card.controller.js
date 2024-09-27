import multer from "multer";
import path from "path";
import Card from "../models/Card.js";
import { timeStamp } from "console";

const getAllCards = async (req, res) => {
  try {
    const cards = await Card.findAll();
    if (cards.length === 0) {
      return res.status(404).json({ msg: "No Cards Found" });
    }

    res.status(200).json(cards);
  } catch (error) {
    console.log("error in getAllCards:", error);
    res.sendStatus(500);
  }
};

const getLimitedCards = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const page = parseInt(req.query.page) || 1;

    const offset = (page - 1) * limit;

    if (isNaN(limit) || isNaN(page)) {
      return res
        .status(400)
        .json({ msg: "limit or skip query is missing or invalid" });
    }

    const cards = await Card.findAll({
      limit: limit,
      offset: offset,
      order: [['createdAt', 'ASC']],
    });

    if (cards.length === 0) {
      return res.status(404).json({ msg: "No Cards Found" });
    }
    // console.log(cards);

    res.status(200).json(cards);
  } catch (error) {
    console.log("error in getLimitedCards:", error);
    res.sendStatus(500);
  }
};

const createCard = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ msg: "content or title is missing" });
    }
    const image = req.file ? `/Images/${req.file.filename}` : null;

    const newCard = await Card.create({
      title,
      content,
      image,
    });
    res.status(201).json(newCard);
  } catch (error) {
    console.log("error in createCard:", error);
    res.sendStatus(500);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  // fileFilter: (req,file,cb)=> {
  //     const fileTypes = /jpeg|jpg|png|gif/
  //     const mimeType = fileTypes.test(file.mimetype)
  //     const extname = fileTypes.test(path.extname(file.originalname))
  //     if(mimeType && extname) {
  //         return cb(null,true)
  //     } else {
  //         cb('give proper files formate to upload')
  //     }
  // }
}).single("image");

const deleteCard = async (req, res) => {
  try {
    const data = await Card.findByPk(req.params.id);
    if (!data) {
      return res.status(404).json({ msg: "failed to found the card" });
    }

    await data.destroy();
    res.sendStatus(200);
  } catch (error) {
    console.log("error in deleteCard:", error);
    res.sendStatus(500);
  }
};

export { upload, getAllCards, createCard, deleteCard, getLimitedCards };
