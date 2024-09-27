import { Router } from "express";

import { upload ,getAllCards,createCard,deleteCard,getLimitedCards} from "../controller/card.controller.js";

const router = Router();

router.post('/',upload,createCard);
// router.get('/',getAllCards);
router.get('/',getLimitedCards)
router.delete('/:id',deleteCard)
export default router;