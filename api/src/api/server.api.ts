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
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import { buildSchemaSync, registerEnumType } from 'type-graphql';
import { UserResolver } from './user.api';

// registerEnumType(ProductSources, {
// 	name: 'ProductSources', // this one is mandatory
// });

const typeSchema = buildSchemaSync({
    resolvers: [
        UserResolver
    ],
    dateScalarMode: 'timestamp',
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
    // const fullSchema = mergeSchemas({schemas: [typeSchema, schema]});

    return new ApolloServer({
        schema: typeSchema,
        // context: async ({req}) => {
        // 	const token = req.headers.authorization;

        // 	if (token) {
        // 		const session = await Session.findWithUser(token);

        // 		if (session?.user) {
        // 			return {user: session.user};
        // 		}
        // 	}

        // 	return {};
        // },
        playground: forTest ? undefined : { tabs: [{ endpoint: '/graphql' }] },
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

    app.listen(4000, () => {
        console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
    });
};
