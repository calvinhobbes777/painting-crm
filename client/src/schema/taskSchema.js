import { user, job, customer } from "./types";

const fields = {};

const readRelations = {
  user,
  job,
  customer
};

const writeRelations = {
  user,
  job,
  customer
};

export default {
  write: {
    fields: Object.values(fields),
    relations: Object.values(writeRelations)
  },
  read: {
    fields: Object.values(fields),
    relations: Object.values(readRelations)
  }
};
