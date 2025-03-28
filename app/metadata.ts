// ./app/metadata.ts
import { Metadata } from 'next';
import { SITE } from '~/config.js';

export const metadata: Metadata = {
  title: {
    template: `%s — ${SITE.name}`,
    default: SITE.title,
  },
  description: SITE.description,
};