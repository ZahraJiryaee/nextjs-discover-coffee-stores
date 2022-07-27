var Airtable = require("airtable");
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
});
var base = Airtable.base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_KEY);
const table = base("coffee-stores");

const getMinifiedRecord = (record) => {
  return { ...record.fields };
};

const getMinifiedRecords = (records) => {
  return records.map((record) => {
    return getMinifiedRecord(record);
  });
};

export { table, getMinifiedRecords };
