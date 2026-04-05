const KEY_LISTS = "listless::lists";


export type LocalStorageList = {
    id: string,
    e2e: string | null,
    mut: string | null,
};

export function getLists(): LocalStorageList[] {
    const lists = JSON.parse(localStorage.getItem(KEY_LISTS) || "[]");
    return lists;
}

export function addList(list: LocalStorageList) {
    const lists = getLists();
    const idx = lists.findIndex(l => l.id == list.id);
    if (idx >= 0) {
        lists[idx] = {
            id: list.id,
            e2e: list.e2e || lists[idx].e2e,
            mut: list.mut || lists[idx].mut,
        };
    }
    else {
        lists.push(list);
    }
    localStorage.setItem(KEY_LISTS, JSON.stringify(lists));
}

export function removeList(id: string) {
    const lists = getLists()
        .filter(list => list.id !== id);
    localStorage.setItem(KEY_LISTS, JSON.stringify(lists));
}

export function getList(listId: string): LocalStorageList | null {
    const lists = getLists();
    for (const list of lists) {
        if (list.id === listId) {
            return list;
        }
    }
    return null;
}
