import { table, getMinifiedRecords } from "../../lib/airtable";

const getCoffeeStoreById = async (req, res) => {
  const { id } = req.query;

  try {
    if (id) {
      const findCoffeeStoreRecord = await table
        .select({
          filterByFormula: `id="${id}"`,
        })
        .firstPage();

      if (findCoffeeStoreRecord.length !== 0) {
        const records = getMinifiedRecords(findCoffeeStoreRecord);
        res.json(records);
      } else {
        res.json({ message: `id could not be found` });
      }
    } else {
      res.status(400);
      res.json({ message: "Id is missing" });
    }
  } catch (error) {
    res.status(500);
    res.json({ message: "Something Went Wrong", error });
  }
};

export default getCoffeeStoreById;
