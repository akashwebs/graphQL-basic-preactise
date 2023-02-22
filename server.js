const express = require("express");
const { buildSchema } = require("graphql");
const { graphqlHTTP } = require("express-graphql");
const { default: axios } = require("axios");

const app = express();

let message = "this is a mutation message";

const schema = buildSchema(`
type Post{
    userId:Int,
    id:Int,
    title:String,
    body:String
}

type User{
    name:String,
    age:Int,
    collage:String
}
type Query{
    hello:String,
    welcomeMessage(name:String,weekOfDay:String!):String,
    getUser:User,
    getUsers:[User]
    externalAPICall:[Post],
    message:String
}
input UserInputType{
    name:String!,
    age:Int!,
    collage:String!
}
type Mutation{
    setMessage(input:UserInputType):String,
    createUserVai(name:String!, age:Int!,collage:String!):User
}
`);

const root = {
  setMessage: (arg) => {
    return (message = arg.newMessage);
  },

  externalAPICall: async () => {
    const result = await axios.get(
      "https://jsonplaceholder.typicode.com/posts"
    );
    return result.data;
  },

  hello: () => {
    return "hello graphql";
  },
  welcomeMessage: (arg) => {
    return (
      "welcome our first params graphQL " +
      arg.name +
      " day of week " +
      arg.weekOfDay
    );
  },
  getUser: () => {
    const user = {
      name: "akash",
      age: 25,
      class: "seven",
    };
    return user;
  },
  getUsers: () => {
    const users = [
      { name: "Prity Biswas", class: "eight", age: 20 },
      { name: "Prity Biswas", class: "eight", age: 20 },
    ];
    return users;
  },
  message: () => {
    return message;
  },
  createUserVai: ({ name, age, collage }) => {
    return { name, age, collage };
  },
};

app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema: schema,
    rootValue: root,
  })
);

app.listen(4000, () => {
  return console.log("server on port 4000");
});
