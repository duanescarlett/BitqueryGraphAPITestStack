const express = require('express')
const { buildSchema } = require('graphql')
const { graphqlHTTP } = require('express-graphql')
const axios = require('axios')

const app = express()

/*
ID
String
Int
Float
Boolean
List - []
*/

let message = "This is a message"

const schema = buildSchema(`
    type Post {
        userId: Int
        id: Int
        title: String
        body: String
    }

    type User {
        name: String
        age: Int
        college: String    
    }

    type Query {
        hello: String!
        welcomeMessage(name: String, dayOfWeek: String!): String
        getUser: User
        getUsers: [User]
        getPostFromExternalAPI: Post
        message: String
    }

    input UserInput {
        name: String!
        age: Int!
        college: String!
    }

    type Mutation {
        setMessage(newMessage: String): String
        createUser(user: UserInput): User
    }
`)
// createUser(name: String!, age: Int!, college: String!): User
const root = {
    hello: () => {
        return 'Hello World!'
    },
    welcomeMessage: (args) => {
        return `Hey ${args.name}, hows life?, today is ${args.dayOfWeek}`
    },
    getUser: () => {
        const user = {
            name: 'Duane Scarlett',
            age: 39,
            college: 'University of Texas at Austin'
        }
        return user
    },
    getUsers: () => {
        const users = [
            {
                name: 'Duane Scarlett',
                age: 39,
                college: 'University of Texas at Austin'
            },
            {
                name: 'John Doe',
                age: 29,
                college: 'University of Texas at Austin'
            }
        ]
        return users
    },
    getPostFromExternalAPI: async () => {
        const result = await axios.get(`https://jsonplaceholder.typicode.com/posts`)
        .then(res => res.data[0])
        return result
    },
    setMessage: ({ newMessage }) => {
        message = newMessage
        return message
    },
    message: () => message,
    createUser: (args) => {
        console.log(args)
        return args.user
    }
}

app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: schema,
    rootValue: root,
}))

app.listen(4000, () => console.log('Server started on port 4000'))
