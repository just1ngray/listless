import { defineNitroPlugin } from "nitropack/runtime/plugin";
import { db, listService } from "../listless";

export default defineNitroPlugin(() => {
    // reference the imports so they aren't tree-shaken
    void db;
    void listService;
});
