import express from 'express';
import { LoggerService } from '@backstage/backend-plugin-api';
import { S3Service } from './services/S3Service';

export type RouterOptions = {
  logger: LoggerService;
  defaults: { bucket: string; key: string; region?: string };
};

export async function createRouter({ logger, defaults }: RouterOptions) {
  const router = express.Router();
  router.use(express.json());
  const s3 = new S3Service(defaults.bucket, defaults.key, defaults.region);

  router.get('/services/:service', async (req, res) => {
    try {
      const service = req.params.service?.trim();
      if (!service) return res.status(400).json({ error: 'Missing :service' });

      const data = await s3.getStages(service);
      return res.json({ service, stages: data });
    } catch (e: any) {
      logger.error(e?.message || String(e));
      return res.status( e?.message?.includes('not found') ? 404 : 500 ).json({ error: e?.message || 'Error' });
    }
  });

  router.get('/health', (_req, res) => res.json({ status: 'ok' }));
  return router;
}