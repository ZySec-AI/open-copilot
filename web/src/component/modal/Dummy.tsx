import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/component/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/component/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/component/ui/form";
import { useAppDispatch } from "@/hook";
import { createPlaybook } from "@/redux/playbooks/playbookSlice";
import { Input } from "@/component/ui/input";
import { Button } from "@/component/ui/button";
import { Category, useCreateFolderMutation } from "@/redux/folder/folderSlice";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { number, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
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
  version: z
    .string({
      required_error: "Please enter version number",
    })
    .min(1, {
      message: "Version must have 1 word.",
    }),
  category: z
    .string({
      required_error: "Please select a category",
    })
    .min(1, {
      message: "Category not selected",
    }),
  // content_type: z
  //   .string({
  //     required_error: "Please select a category",
  //   })
  //   .min(1, {
  //     message: "Category not selected",
  //   }),
  tags: z
    .string({
      required_error: "Please enter the tags",
    })
    .min(1, {
      message: "Minimum 1 tag required",
    }),
});
type Schema = z.infer<typeof schema>;

const Dummy = ({
  open,
  handleClose,
  categoryData,
}: {
  open: boolean;
  setOpen: () => void;
  categoryData?: Category;
  handleClose:any;
}) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const [playBookdata, setplayBookdata] = useState({
    name: "",
    description: "",
    version: "",
    category: "",
    content_type: location.pathname === "/Content-index" ? "playbooks" : "news",
    tags: [],
  });

  async function onSubmit(input: Schema) {
    console.log(input);
    for (const key in input) {
      if (input.hasOwnProperty(key)) {
        const value = input[key as keyof typeof input];
        console.log(value);

        if (key === "tags") {
          const tagsArray = value.split(",").map((tag: string) => tag.trim());
          setplayBookdata((prevState:any) => ({
            ...prevState,
            [key]: tagsArray,
          }));
        } else {
          setplayBookdata((prevState) => ({
            ...prevState,
            [key]: value,
          }));
        }
      }
    }
    console.log(playBookdata);
    setLoading(true);
    toast.promise(
      // createFolder({ ...input, parent_folder: parentFolderId ?? "" }).unwrap(),
      dispatch(createPlaybook(playBookdata)).unwrap(),
      {
        loading: "Adding Playbook...",
        success: () => {
          return "Playbook Added Successfully";
        },
        error: () => {
          return "Error in adding playbook...";
        },
        finally: () => {
          form.reset({
            name: "",
            description: "",
            version: "",
            category: "",
            tags: "",
          });
          setLoading(false);
          handleClose();
        },
      }
    );
  }

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      version: "",
      category: "",
      tags: "",
    },
  });
  return (
    <Dialog
      open={open}
      onOpenChange={(x) => {
        form.reset({
          name: "",
          description: "",
          version: "",
          category: "",
          tags: "",
        });
        handleClose();
      }}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add new playbook</DialogTitle>
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
                      <Input {...field} placeholder="Enter playbook's name" />
                    </FormControl>
                    <FormMessage />
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
                      <Input {...field} placeholder="Enter description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="version"
              render={({ field }) => (
                <div className="space-y-6">
                  <FormItem className="w-full">
                    <FormLabel>Version</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter version number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <div className="space-y-6">
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select a category"
                            className=""
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoryData &&
                          categoryData.map((item:any, index:any) => (
                            <SelectItem key={index} value={item.name}>
                              {item.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <div className="space-y-6">
                  <FormItem className="w-full">
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='Enter tags seperated by a comma "," '
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            <Button
              className="bg-blue-700 rounded-lg border hover:border-blue-600 text-white hover:bg-white duration-300 ease-in-out hover:text-blue-600 px-1 w-full py-4"
              disabled={loading}
              type="submit"
            >
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default Dummy;
