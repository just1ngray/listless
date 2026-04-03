export type LocalStorageList = {
    id: string,
    e2e: string | null,
    mut: string | null,
};

export function getLists(): LocalStorageList[] {
    const lists = JSON.parse(localStorage.getItem("lists") || "[]");
    return lists;
}

export function addList(list: LocalStorageList) {
    const lists = getLists();
    lists.push(list);
    localStorage.setItem("lists", JSON.stringify(lists));
}
