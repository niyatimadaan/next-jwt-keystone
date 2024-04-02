import {config} from '@keystone-6/core';
import { jwtSessionStrategy } from './src/keystone/auth';
import { lists } from './src/keystone/schema';

export default config({
    db: {
        provider: 'postgresql',
        url: process.env.DATABASE_URL ||'postgres://node:node@localhost:5432/onebiglove',
        idField: { kind: 'uuid' },
    },
    lists,
    session: jwtSessionStrategy,
    ui: {
        publicPages: [
          '/auth',
          '/api/register',
        ],
    
        // adding page middleware ensures that users are redirected to the signin page if they are not signed in.
        pageMiddleware: async ({ wasAccessAllowed }) => {
          if (wasAccessAllowed) return
          return {
            kind: 'redirect',
            to: '/auth',
          }
        },
      },
    // graphql: {
    //     generateNextGraphqlAPI: true,
    // },
    // experimental: {
    //     generateNodeAPI: true,
    // },
});