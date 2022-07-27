var Airtable = require("airtable");
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
});
var base = Airtable.base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_KEY);
const table = base("coffee-stores");

const createCoffeeStore = async (req, res) => {
  if (req.method === "POST") {
    const { id, name, address, neighbourhood, voting, imgUrl } = req.body;

    try {
      if (id) {
        const findCoffeeStoreRecord = await table
          .select({
            filterByFormula: `id=${id}`,
          })
          .firstPage();

        if (findCoffeeStoreRecord.length !== 0) {
          const records = findCoffeeStoreRecord.map((record) => {
            return { ...record.fields };
          });
          res.json(records);
        } else {
          if (name) {
            const createRecord = await table.create([
              {
                fields: {
                  id,
                  name,
                  address,
                  neighbourhood,
                  voting,
                  imgUrl,
                },
              },
            ]);
            const records = createRecord.map((record) => {
              return { ...record.fields };
            });
            res.json(records);
          } else {
            res.status(400);
            res.json({ message: "Name is missing" });
          }
        }
      } else {
        res.status(400);
        res.json({ message: "Id is missing" });
      }
    } catch (error) {
      console.log("Error creating or finding a store", error);
      res.status(500);
      res.json({ message: "Error creating or finding a store", error });
    }
  }
};

export default createCoffeeStore;
