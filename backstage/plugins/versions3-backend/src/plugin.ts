// packages/backend/src/plugins/s3-json/plugin.ts
import { coreServices, createBackendPlugin } from '@backstage/backend-plugin-api';
import { createRouter } from './router';

export const versions3Plugin = createBackendPlugin({
  pluginId: 'versions3',
  register(env) {
    env.registerInit({
      deps: { logger: coreServices.logger, httpRouter: coreServices.httpRouter, config: coreServices.rootConfig },
      async init({ logger, httpRouter, config }) {
        const defaults = {
          bucket: config.getString('s3Json.bucket'),
          key: config.getString('s3Json.key'),
          region: config.getOptionalString('s3Json.region'),
        };

        const router = await createRouter({ logger, defaults })
        httpRouter.use(router);
        logger.info('s3-json plugin initialized');
      },
    });
  },
});

export default versions3Plugin;
