import { Client } from "faunadb";

export const fauna = new Client({
  secret: `${process.env.FAUNADB_KEY}`,
  queryTimeout: 4000,
  keepAlive: false,
});
