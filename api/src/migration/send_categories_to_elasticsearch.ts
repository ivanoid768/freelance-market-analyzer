// yarn run script src/migration/send_categories_to_elasticsearch.ts
import "reflect-metadata";

import { getRepository } from "typeorm";
import { Client, ApiResponse, RequestParams } from "@elastic/elasticsearch";

import { connectDB } from "../index.db";
import { config } from "src/config";
import { SourceCategory } from "shared/src/entity/SourceCategory";

async function main() {
	await connectDB()

	const client = new Client({ node: config.ELASTICSEARCH_DB_CONNECT_URI }); //'http://localhost:9200'

	let categories = await getRepository(SourceCategory).find({ select: ['id', 'searchText'] });

	let indexName = 'fma-categories';

	await client.indices.delete({
		index: indexName
	})

	let bulkBody = [];

	categories.forEach(category => {
		bulkBody.push({ index: { _index: indexName } });
		bulkBody.push({
			dbId: category.id,
			searchText: category.searchText,
		})
	})

	const { body: bulkResponse } = await client.bulk({
		refresh: true,
		body: bulkBody
	})

	if (bulkResponse.errors) {
		console.error(bulkResponse)
	}

	let reqParams: RequestParams.Search = {
		index: indexName,
		body: {
			query: {
				// match: { searchText: 'asp net java' },
				simple_query_string: {
					fields: ['searchText'],
					query: 'net -asp'
				}
			}
		},
		size: 20
	}

	const { body }: ApiResponse = await client.search(reqParams)
	console.log(body.hits.hits, body.hits.hits.length, body.hits.hits[0]._source.dbId)

	const { body: count } = await client.count({ index: indexName })
	console.log('count:', count)
}

main().catch(e => console.log(e.message))