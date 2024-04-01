import {config} from '@keystone-6/core';
import { session } from './src/keystone/auth';
import { lists } from './src/keystone/schema';

export default config({
    db: {
        provider: 'postgresql',
        url: process.env.DATABASE_URL ||'postgres://node:node@localhost:5432/onebiglove',
        idField: { kind: 'uuid' },
    },
    lists,
    // session,
    // graphql: {
    //     generateNextGraphqlAPI: true,
    // },
    // experimental: {
    //     generateNodeAPI: true,
    // },
});