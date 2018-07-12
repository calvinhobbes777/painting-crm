const { GraphQLServer } = require("graphql-yoga");
const { Prisma } = require("prisma-binding");
const { S3 } = require("aws-sdk");
const { CronJob } = require("cron");

const resolvers = require("./resolvers");
const fileApi = require("./modules/file-api");

const s3client = new S3({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  params: {
    Bucket: process.env.S3_BUCKET
  }
});

const getPrismaInstance = () => {
  return new Prisma({
    typeDefs: __dirname + "/generated/prisma.graphql",
    endpoint: process.env.PRISMA_ENDPOINT,
    secret: process.env.PRISMA_SECRET,
    debug: false
  });
};

const db = getPrismaInstance();

const server = new GraphQLServer({
  typeDefs: "src/schema.graphql",
  resolvers,
  context: req => ({
    ...req,
    db: getPrismaInstance()
  })
});

server.express.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

server.express.post(
  "/upload",
  fileApi({
    s3: s3client,
    prisma: getPrismaInstance()
  })
);

server.start(() => console.log("Server is running on http://localhost:4000"));
