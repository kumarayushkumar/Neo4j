import { initDriver, getDriver, closeDriver } from './config/db.js'
import conn from '../config/db.js'

const driver = getDriver()

const register = async (userId) => {
    const session = driver.session()
    try {
        const res = await session.executeWrite(
            tx => tx.run(
                `
            CREATE (user
                :User {
              userId: $userId,
            })
            RETURN user
          `,
                { userId }
            )
        )
        const [first] = res.records
        const node = first.get('u')

        await session.close()

        return {
            ...node.properties
        }
    }
    catch (e) {
        if (e.code === 'Neo.ClientError.Schema.ConstraintValidationFailed') {
            console.log('User already exists')
        }
    }
    finally {
        await session.close()
    }
}

const deleteUser = async (userId) => {
    const session = driver.session()
    try {
        const res = await session.executeWrite(
            tx => tx.run(
                `
            MATCH (user:User {userId: $userId})
            DETACH DELETE user
            `,
                { userId }
            )
        )
        await session.close()
        return true
    }
    catch (e) {
    }
    finally {
        await session.close()
    }
}


const followers = async (userId) => {
    try {
        const session = driver.session()
        await session.executeWrite(
            tx => tx.run(
                `
                MATCH (user:User {userId: $userId})<-[r:FOLLOW]-()
                RETURN r
                `, { userId }
            )
        ).then((result) => {
            return result
        }).catch((err) => {
        })
    } catch (error) {
    }
}

const following = async (userId) => {
    try {
        const session = driver.session()
        const res = await session.executeWrite(
            tx => tx.run(
                `
                MATCH (user:User {userId: $userId})-[r:FOLLOW]->()
                RETURN r
                `, { userId }
            )
        ).then
    } catch (error) {
        res.status(500).send(error)
    }
}

const follow = async (currentUser, userId) => {
    try {
        const session = driver.session()
        const res = await session.executeWrite(
            tx => tx.run(
                `
                MERGE (currentUser:User {userId: $currentUser})
                MERGE (user:User {userId: $userId})
                MERGE (currentUser)-[:FOLLOW]->(user)
                RETURN currentUser
            `, { currentUser, userId }
            )
        )
    } catch (error) {
    }
}

const unFollow = async (currentUser, userId) => {
    try {
        const session = driver.session()
        const res = await session.executeWrite(
            tx => tx.run(
                `
                MATCH (currentUser:User {userId: $currentUser})-[r:FOLLOW]->(user:User {userId: $userId})
                DELETE r
                `, { currentUser, userId}
            )
        )
    } catch (error) {
    }
}

export default { register, deleteUser, followers, following, follow, unFollow }
