import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import JobInfo from "./JobInfo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteJobAction } from "@/utils/actions";
import { toast } from "sonner";
import { Trash } from "lucide-react";

function DeleteJobButton({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => deleteJobAction(id),
    onSuccess: (data) => {
      if (!data) {
        toast.error("error deleting job");
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      queryClient.invalidateQueries({ queryKey: ["charts"] });
      toast.success("job deleted successfully");
    },
  });
  return (
    <Button
      size="sm"
      disabled={isPending}
      onClick={() => {
        mutate(id);
      }}
    >
      {<Trash />}
      {isPending ? "deleting..." : "delete"}
    </Button>
  );
}

export default DeleteJobButton;
