import { db } from "./lib/db";
import { products } from "./lib/db/schema";
const res = await db.select().from(products).limit(5);
console.log(res.map(p => ({id: p.id, subcategoryId: p.subcategoryId, subcategory: p.subcategory})));
