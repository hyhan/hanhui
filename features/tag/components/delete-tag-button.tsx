import { Button } from "@/components/ui/button"
import { TrashIcon } from "lucide-react"



type DeleteTagButtonProps = {
  id: string;
  refreshAsync: () => Promise<unknown>;
};

export const DeleteTagButton = ({id, refreshAsync}: DeleteTagButtonProps) => {
  return (
    <Button
      variant="ghost"
      onClick={() => {
        // handleDelete(record.id)
      }}
    >
      <TrashIcon size={20} />
    </Button>
  )
}
