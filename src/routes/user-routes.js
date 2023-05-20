import express from 'express'
const app = express()
const router = express.Router()

import UserServices from '../services/user-services.js'
import { getDriver } from '../config/db.js'


router.get('/', (req, res) => {
    res.send('Hello World!')
})

router.get('/create-user/:userId', async (req, res) => {
    const userServices = new UserServices(getDriver())

    userServices.register(req.params.userId)
    .then((result) => {
        res.send('User created!')
    }).catch((err) => {
        console.log(`err = ${err}`)
    })
})

router.get('/delete-user/:userId', (req, res) => {
    const userServices = new UserServices(getDriver())

    userServices.deleteUser(req.params.userId)
    .then((result) => {
        const message = result ? 'User deleted!' : 'Something went wrong!'
        res.send(message)
    }).catch((err) => {
        console.log(`err = ${err}`)
    })
})

router.get('/followers/:userId', (req, res) => {
    let follower = []
    const userServices = new UserServices(getDriver())

    userServices.followers(req.params.userId)
    .then((result) => {
        result.records.forEach(element => {
            follower.push(element._fields[0].properties)
        })
        res.send(result.records[0]._fields[0].properties)
    }).catch((err) => {
        console.log(`err = ${err}`)
    })
})

router.get('/following/:userId', (req, res) => {
    let following = []
    const userServices = new UserServices(getDriver())

    userServices.following(req.params.userId)
    .then((result) => {
        result.records.forEach(element => {
            following.push(element._fields[0].properties)
        })
        res.send(following)
    }).catch((err) => {
        console.log(`err = ${err}`)
    })
})

router.get('/follow/:currentUser/:userId', async (req, res) => {
    const userServices = new UserServices(getDriver())

    userServices.follow(req.params.currentUser, req.params.userId)
    .then((result) => {
        console.log(result.records)
        const message = result.records[0] ? 'done' : 'Something went wrong!'
        res.send(message)
    }).catch((err) => {
        console.log(`err = ${err}`)
    })
})

router.get('/unfollow/:currentUser/:userId', (req, res) => {
    const userServices = new UserServices(getDriver())

    userServices.unFollow(req.params.currentUser, req.params.userId)
    .then((result) => {
        const message = result ? 'done' : 'Something went wrong!'
        res.send(message)
    }).catch((err) => {
        console.log(`err = ${err}`)
    })
})

export default router