import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const versions3Plugin = createPlugin({
  id: 'versions3',
  routes: {
    root: rootRouteRef,
  },
});

export const Versions3Page = versions3Plugin.provide(
  createRoutableExtension({
    name: 'Versions3Page',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
