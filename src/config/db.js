import neo4j, { driver } from "neo4j-driver"


export async function initDriver(uri, username, password) {
    const driver = neo4j.driver(uri, neo4j.auth.basic(username, password))
    return driver
}

export function getDriver() {
    return driver
}

export function closeDriver() {
    if(driver) {
        driver.close()
    }
}