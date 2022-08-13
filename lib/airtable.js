var Airtable = require("airtable");
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
});
var base = Airtable.base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_KEY);
const table = base("coffee-stores");

const getMinifiedRecord = (record) => {
  return { recordId: record.id, ...record.fields };
};

const getMinifiedRecords = (records) => {
  return records.map((record) => {
    return getMinifiedRecord(record);
  });
};

const findRecordByFilter = async (id) => {
  const findCoffeeStoreRecord = await table
    .select({
      filterByFormula: `id="${id}"`,
    })
    .firstPage();

  return getMinifiedRecords(findCoffeeStoreRecord);
};

export { table, getMinifiedRecords, findRecordByFilter };
