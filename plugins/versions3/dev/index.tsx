import { createDevApp } from '@backstage/dev-utils';
import { versions3Plugin, Versions3Page } from '../src/plugin';

createDevApp()
  .registerPlugin(versions3Plugin)
  .addPage({
    element: <Versions3Page />,
    title: 'Root Page',
    path: '/versions3',
  })
  .render();
