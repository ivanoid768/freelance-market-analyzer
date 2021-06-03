import 'reflect-metadata';

import express, { json, urlencoded } from 'express';
import {
    ApolloServer,
    gql,
    CorsOptions,
    mergeSchemas,
    makeExecutableSchema,
    SchemaDirectiveVisitor,
} from 'apollo-server-express';
import { createServer } from "http";
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import { buildSchemaSync, registerEnumType } from 'type-graphql';
import { UserResolver } from './user.api';
import { customAuthChecker } from './auth.api';
import { User } from '../entity/User';
import { getRepository } from 'typeorm';
import { Admin } from '../entity/Admin';
import { AdminResolver } from './admin.api';
import { CategoryResolver } from './category.api';
import { TagResolver } from './tag.resolver';
import { FilterResolver } from './filter.resolver';
import { TaskResolver } from './task.resolver';
import { publisher } from 'src/queue/task.queue';

// registerEnumType(ProductSources, {
// 	name: 'ProductSources', // this one is mandatory
// });

const typeSchema = buildSchemaSync({
    resolvers: [
        UserResolver,
        AdminResolver,
        CategoryResolver,
        TagResolver,
        FilterResolver,
        TaskResolver
    ],
    authChecker: customAuthChecker,
    dateScalarMode: 'timestamp',
    pubSub: publisher,
});

SchemaDirectiveVisitor.visitSchemaDirectives(typeSchema, {
    // authRequired: AuthRequiredDirective,
});

// const typeDefs = gql`
// 	directive @authRequired(role: Role) on FIELD_DEFINITION

// 	scalar Date
// 	scalar JSONObject

// 	type Query {
// 		_empty: String
// 	}

// 	type Mutation {
// 		_empty: String
// 	}
// `;

// const resolvers = {
// 	Date: new GraphQLScalarType({
// 		name: 'Date',
// 		description: 'Date custom scalar type',
// 		parseValue(value) {
// 			return new Date(value); // value from the client
// 		},
// 		serialize(value) {
// 			return value.getTime(); // value sent to the client
// 		},
// 		parseLiteral(ast) {
// 			if (ast.kind === Kind.INT) {
// 				return parseInt(ast.value, 10); // ast value is always in string format
// 			}
// 			return null;
// 		},
// 	}),
// };

export const createApolloGraphQLServer = (forTest = false) => {
    return new ApolloServer({
        schema: typeSchema,
        context: async ({ req, connection }) => {
            let token = req && req.headers.authorization;

            if (!token && connection) {
                token = connection.context.token;
            }

            if (token) {
                const users = await getRepository(User).find({ where: { token: token } });
                if (users[0]) {
                    return { user: users[0] };
                }

                const admins = await getRepository(Admin).find({ where: { token: token } });
                if (admins[0]) {
                    return { user: admins[0] };
                }
            }

            return {};
        },
        subscriptions: {
            path: '/subscriptions',
            onConnect: async (connectionParams: { Authorization: string }) => {
                // console.log(connectionParams.Authorization);
                return { token: connectionParams.Authorization }
            },
        },
        playground: forTest ? undefined : { tabs: [{ endpoint: '/graphql' }], subscriptionEndpoint: '/subscriptions' },
    });
};

export const startServer = () => {
    const app = express();
    // const corsOptions: CorsOptions = {origin: config.CORS_ORIGIN || '*'};
    const corsOptions: CorsOptions = { origin: '*' }

    app.use(urlencoded({ extended: true }));
    app.use(json());
    // app.use('/payments', paymentsRouter);

    const server = createApolloGraphQLServer();

    server.applyMiddleware({ app, path: '/', cors: corsOptions });

    const httpServer = createServer(app);
    server.installSubscriptionHandlers(httpServer)

    let PORT = 4000;

    httpServer.listen(PORT, () => {
        console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
        console.log(`Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`);
    });
};