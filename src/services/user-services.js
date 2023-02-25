export default class UserServices {
    constructor(driver) {
        this.driver = driver
    }

    async register(userId) {
        const session = this.driver.session() 
        try {
            return session.executeWrite(
                tx => tx.run(
                    `MERGE (user:User {userId: $userId}) RETURN user`,
                    { userId }
                )
            )
        } catch (e) {
            if (e.code === 'Neo.ClientError.Schema.ConstraintValidationFailed') {
                console.log('User already exists')
            }
        } finally {
            // await session.close()
        }
    }
    
    async deleteUser(userId) {
        const session = this.driver.session() 
        try {
            await session.executeWrite(
                tx => tx.run(
                    `MATCH (user:User {userId: $userId}) DETACH DELETE user`,
                    { userId }
                )
            )
            return true
        }
        catch (e) {
            throw new Error(e)
        } finally {
            // await session.close()
        }
    }
    
    
    async followers(userId) {
        const session = this.driver.session() 
        try {
            return await session.executeWrite(
                tx => tx.run(
                    `MATCH (user:User {userId: $userId})<-[r:FOLLOW]-(followers: User) RETURN followers`, { userId }
                )
            )
        } catch (e) {
            throw new Error(e)
        } finally {
            // await session.close()
        }
    }
    
    async following(userId) {
        const session = this.driver.session() 
        try {
            return await session.executeWrite(
                tx => tx.run(
                    `MATCH (user:User {userId: 'ayushkumar'})-[r:FOLLOW]->(following: User) RETURN following`, { userId }
                )
            )
        } catch (e) {
            throw new Error(e)
        } finally {
            // await session.close()
        }
    }
    
    async follow(currentUser, userId) {
        const session = this.driver.session() 
        const timestamp = Date(Date.now())
        try {
            const result = await session.executeWrite(
                tx => tx.run(
                    `
                    MERGE (currentUser:User {userId: $currentUser})
                    MERGE (user:User {userId: $userId})
                    MERGE (currentUser)-[r:FOLLOW {timestamp: $timestamp}]->(user)
                    RETURN currentUser
                `, { currentUser, userId, timestamp}
                )
            )
            return true
        } catch (error) {
            throw new Error(error)
        } finally {
            // await session.close()
        }
    }
    
    async unFollow(currentUser, userId) {
        const session = this.driver.session() 
        try {
            const res = await session.executeWrite(
                tx => tx.run(
                    `
                    MATCH (currentUser:User {userId: $currentUser})-[r:FOLLOW]->(user:User {userId: $userId})
                    DELETE r
                    `, { currentUser, userId }
                )
            )
            return true
        } catch (error) {
            throw new Error(error)
        } finally {
            // await session.close()
        }
    }
}