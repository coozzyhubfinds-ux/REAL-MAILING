import express from 'express';
import multer from 'multer';
import csv from 'csv-parser';
import { Readable } from 'stream';

import { listLeads, createLead, importLeads, updateLead, deleteLead } from '../controllers/leadsController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', listLeads);
router.post('/', createLead);

router.post('/import', upload.single('file'), async (req, res) => {
  try {
    const leadsPayload = [];

    if (req.file) {
      const bufferStream = new Readable();
      bufferStream.push(req.file.buffer);
      bufferStream.push(null);

      await new Promise((resolve, reject) => {
        bufferStream
          .pipe(csv())
          .on('data', (row) => leadsPayload.push(row))
          .on('end', resolve)
          .on('error', reject);
      });
    } else if (Array.isArray(req.body.leads)) {
      leadsPayload.push(...req.body.leads);
    } else {
      throw new Error('Provide a CSV file or JSON array of leads');
    }

    const result = await importLeads(leadsPayload);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: error.message } });
  }
});

router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

export default router;

