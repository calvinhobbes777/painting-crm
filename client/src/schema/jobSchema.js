import { customer } from "./types";

const fields = {};

const readRelations = {
  customer
};

const writeRelations = {
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
