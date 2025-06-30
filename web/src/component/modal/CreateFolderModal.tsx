import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/component/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/component/ui/form";
import { Input } from "@/component/ui/input";
import { Button } from "@/component/ui/button";
import { useCreateFolderMutation } from "@/redux/folder/folderSlice";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const schema = z.object({
  name: z
    .string({
      required_error: "Please add a name",
    })
    .min(1, {
      message: "Name must have 1 word.",
    }),
  description: z
    .string({
      required_error: "Please add a description",
    })
    .min(1, {
      message: "Description must have 1 word.",
    }),
});

type Schema = z.infer<typeof schema>;

const CreateFolderModal = ({
  open,
  setOpen,
  parentFolderId,
}: {
  open: boolean;
  setOpen: (x: boolean) => void;
  parentFolderId?: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [createFolder, _result] = useCreateFolderMutation();

  async function onSubmit(input: Schema) {
    setLoading(true);

    toast.promise(
      createFolder({ ...input, parent_folder: parentFolderId ?? "" }).unwrap(),
      {
        loading: "Creating Folder...",
        success: () => {
          return "Folder Created";
        },
        error: () => {
          return "Error in creating folder...";
        },
        finally: () => {
          form.reset({ name: "", description: "" });
          setLoading(false);
          setOpen(false);
        },
      }
    );
  }

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  return (
    <Dialog
      open={open}
      onOpenChange={(x) => {
        form.reset({ name: "", description: "" });
        setOpen(x);
      }}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create Folder</DialogTitle>
          <DialogDescription>Create new folder.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <div className="space-y-6">
                  <FormItem className="w-full">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>Write folder name.</FormDescription>
                  </FormItem>
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <div className="space-y-6">
                  <FormItem className="w-full">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Write folder description here.
                    </FormDescription>
                  </FormItem>
                </div>
              )}
            />

            <Button
              className="bg-blue-700 rounded-lg border hover:border-blue-600 text-white hover:bg-white duration-300 ease-in-out hover:text-blue-600 px-1 w-full py-4"
              disabled={loading}
              type="submit"
            >
              Save
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFolderModal;
