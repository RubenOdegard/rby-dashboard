import { db } from "@/db/db";
import { urls } from "@/drizzle/schema";

const DataTableTest = async () => {
  const result = await db.select().from(urls).all();
  return <span>{JSON.stringify(result)}</span>;
};

export default DataTableTest;
