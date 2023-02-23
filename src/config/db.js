import neo4j from "neo4j-driver"

import keys from './keys.js'

const Neo4j = async (req, res) => {
    try {
        const driver = neo4j.driver(keys.neo4j.dbURI, neo4j.auth.basic(keys.neo4j.username, keys.neo4j.password))
        return driver
    } catch (error) {
        throw new GraphQLError('Neo4j connection failed', {
            extensions: {
                code: 'NEO4J_CONNECTION_FAILED',
            },
        })
        process.exit(1)
    }
}

export default Neo4j