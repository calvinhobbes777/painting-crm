const faker = require("faker");
const fields = require("./fields");
const { roles, permissions } = require("./roles");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const moment = require("moment");

const { Prisma } = require("prisma-binding");

const getPrismaInstance = () => {
  return new Prisma({
    typeDefs: __dirname + "/../generated/prisma.graphql",
    endpoint: process.env.PRISMA_ENDPOINT,
    secret: process.env.PRISMA_SECRET,
    debug: false
  });
};

const db = getPrismaInstance();

const seed = async db => {
  console.log("Seed User Roles - Initiated");
  const deleteUsers = await db.mutation.deleteManyUsers({ where: {} });
  const deleteRoles = await db.mutation.deleteManyRoles({ where: {} });

  const roleRequests = roles.map(async (role, index) => {
    const result = await db.mutation.upsertRole({
      where: {
        type: role.type
      },
      create: role,
      update: role
    });
    return result;
  });

  //  await role creation
  await Promise.all(roleRequests);
  console.log("Seed User Roles - Complete");

  // Create or update fields
  console.log("Seed Entity Fields - Initiated");
  const fieldRequests = Object.values(fields).map(entity => {
    return entity.map(async (data, index) => {
      const { read, write, values, ...field } = data;

      const [exists] = await db.query.fields({
        where: {
          name: field.name,
          entity: field.entity
        }
      });

      let query = {};

      if (exists) {
        query.id = exists.id;
      } else {
        query.id = "";
      }

      // console.log(`Upserting field: ${field.name} on entity: ${field.entity}`);

      return db.mutation.upsertField(
        {
          where: query,
          create: {
            ...field,
            order: index + 1,
            values: { set: values }
          },
          update: {
            ...field,
            order: index + 1,
            values: { set: values }
          }
        },
        `
        {
          id
          name
          type
          entity
          size
          order
          values
          static
        }
      `
      );
    });
  });

  // await fields being generated
  const fieldsUpserted = await Promise.all(
    fieldRequests.reduce((requests, all) => all.concat(requests), [])
  );
  console.log("Seed Entity Fields - Complete");

  console.log("Seed Field Permissions - Initiated");
  const fieldPermissions = fieldsUpserted.map(field => {
    // console.log(`Resetting permissions for field: ${field.name} on entiy ${field.entity}`);
    return db.mutation.updateField({
      where: {
        id: field.id
      },
      data: {
        write: {
          connect: roles.map(role => ({ type: role.type }))
        },
        read: {
          connect: roles.map(role => ({ type: role.type }))
        }
      }
    });
  });

  // await permissions reset
  await Promise.all(fieldPermissions);
  console.log("Seed Fields Permissions - Complete");

  const userFields = fieldsUpserted.filter(f => f.entity === "USER");

  console.log("Seed Users - Initiated");
  const usersUpserted = roles.map(async role => {
    const username = role.name.toLowerCase();
    const password = await bcrypt.hash("123", 10);

    const user = await db.mutation.upsertUser({
      where: {
        username
      },
      create: {
        username,
        password,
        fields: {
          create: userFields.map(f => ({
            field: {
              connect: {
                id: f.id
              }
            },
            value: {
              create: {
                [f.type]: generate(f)
              }
            }
          }))
        },
        role: {
          connect: {
            type: role.type
          }
        }
      },
      update: {
        username,
        password,
        fields: {
          create: userFields.map(f => ({
            field: {
              connect: {
                id: f.id
              }
            },
            value: {
              create: {
                [f.type]: generate(f)
              }
            }
          }))
        },
        role: {
          connect: {
            type: role.type
          }
        }
      }
    });

    await db.mutation.updateUser({
      where: {
        username
      },
      data: {
        role: {
          connect: {
            type: role.type
          }
        },
        fields: {
          create: userFields.map(f => ({
            field: {
              connect: {
                id: f.id
              }
            },
            value: {
              create: {
                [f.type]: generate(f)
              }
            }
          }))
        }
      }
    });

    return user;
  });

  const users = await Promise.all(usersUpserted);
  console.log("Seed Users - Complete");

  console.log("Seed Entity Data - Initiated");
  const entityFields = _.groupBy(
    fieldsUpserted.filter(f => f.entity !== "USER"),
    "entity"
  );
  const operations = Object.keys(entityFields).map(val => {
    const single = val.toLowerCase();
    const plural = single + "s";
    const capitalizedSingle =
      single.slice(0, 1).toUpperCase() + single.slice(1);
    const capitalizedPlural = capitalizedSingle + "s";

    return {
      key: val,
      create: `create${capitalizedSingle}`,
      deleteMany: `deleteMany${capitalizedPlural}`
    };
  });

  const dataOps = operations.map(async (op, opIndex) => {
    console.log("Initiating", op.key, " data seed.");
    const deleted = await db.mutation[op.deleteMany]({ where: {} });
    let opsPerformed = [];

    let limit = 10;

    for (let i = 0; i < limit; i += 1) {
      const createFields = entityFields[op.key].map(eField => ({
        field: {
          connect: {
            id: eField.id
          }
        },
        value: {
          create: {
            [eField.type]: generate(eField)
          }
        }
      }));

      const currOp = new Promise(resolve => {
        const curr = i * (opIndex + 1);

        setTimeout(async () => {
          const res = await db.mutation[op.create]({
            data: {
              fields: {
                create: createFields
              }
            }
          });

          resolve(res);
        }, i * 2000 * (opIndex + 1));
      });

      opsPerformed.push(currOp);
    }

    const complete = await Promise.all(opsPerformed);

    console.log(op.key, "data seed complete.");

    return complete;
  });

  const dataOpsResults = await Promise.all(dataOps);

  console.log("Seed Entity Data - Complete");

  process.exit(0);
};

const generate = ({ type, values = [] }) => {
  if (type === "TEXT") {
    return faker.fake("{{lorem.word}}");
  } else if (type === "LONGTEXT") {
    return faker.fake("{{lorem.paragraph}}");
  } else if (type === "NUMBER") {
    return faker.fake("{{random.number}}");
  } else if (type === "CURRENCY") {
    return faker.fake("{{finance.amount}}");
  } else if (type === "DATE") {
    const formatted = moment(new Date(faker.fake("{{date.past}}"))).format(
      "YYYY-MM-DD"
    );
    return new Date(formatted).toISOString();
  } else if (type === "SELECT") {
    return values[Math.floor(Math.random() * values.length)];
  } else if (type === "YESNO") {
    return Math.random() > 0.5;
  } else if (type === "UPLOAD") {
    return {
      create: {
        url: faker.fake("{{image.imageUrl}}"),
        name: faker.fake("{{system.fileName}}"),
        type: faker.fake("{{system.mimeType}}"),
        secret: faker.fake("{{random.uuid}}"),
        size: faker.fake("{{random.number}}")
      }
    };
  } else if (type === "UPLOADS") {
    return {
      create: {
        url: faker.fake("{{image.imageUrl}}"),
        name: faker.fake("{{system.fileName}}"),
        type: faker.fake("{{system.mimeType}}"),
        secret: faker.fake("{{random.uuid}}"),
        size: faker.fake("{{random.number}}")
      }
    };
  }
};

seed(db);
