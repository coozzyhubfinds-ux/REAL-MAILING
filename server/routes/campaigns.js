import express from 'express';
import {
  createCampaign,
  getCampaign,
  sendCampaign,
  previewCampaign
} from '../controllers/campaignsController.js';

const router = express.Router();

router.post('/', createCampaign);
router.get('/:id', getCampaign);
router.post('/:id/send', sendCampaign);
router.post('/:id/preview', previewCampaign);

export default router;

