import neo4j from "neo4j-driver"

let driver

export async function initDriver(uri, username, password) {
    driver = neo4j.driver(uri, neo4j.auth.basic(username, password))

    driver.verifyConnectivity().then(() => {
        console.log("Connected to Neo4j")
    }).catch(error => {
        console.log("Connection failed", error)
    })

    return driver
}

export function getDriver() {
    return driver
}

export function closeDriver() {
    if (driver) {
        driver.close()
    }
}