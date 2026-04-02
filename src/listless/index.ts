import { ListService } from "./list_service";
import { getDb } from "./db";

export const db = getDb();
export const listService = new ListService(db);
