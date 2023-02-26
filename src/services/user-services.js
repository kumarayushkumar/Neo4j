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
        }
    }
    
    async follow(currentUser, userId) {
        const session = this.driver.session() 
        const timestamp = Date(Date.now())
        try {
            return await session.executeWrite(
                tx => tx.run(
                    `
                    MATCH (currentUser:User {userId: $currentUser})
                    MATCH (user:User {userId: $userId})
                    MERGE (currentUser)-[r:FOLLOW]->(user)
                    ON MATCH 
                        SET r.timestamp = $timestamp
                    RETURN r
                    `, { currentUser, userId, timestamp }
                )
            )
        } catch (error) {
            throw new Error(error)
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
        }
    }
}