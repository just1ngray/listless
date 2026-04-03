import { useParams } from "@solidjs/router";


export default function List() {
  const params = useParams();
  const listId = params.listId as string;

  return (
    <div>
      View list {listId}
    </div>
  );
}
