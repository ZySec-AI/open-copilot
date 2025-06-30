import {
  Dialog,
  DialogContent,
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/component/ui/form";
import { useAppDispatch } from "@/hook";
import { createPlaybook } from "@/redux/playbooks/playbookSlice";
import { Input } from "@/component/ui/input";
import { Button } from "@/component/ui/button";
import { Category } from "@/redux/folder/folderSlice";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/component/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
} from "@/component/ui/command";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import React from "react";

const schema = z.object({
  name: z
    .string({
      required_error: "Please add a name",
    })
    .min(1, {
      message: "Name must have 1 word.",
    }),
  category: z
    .string({
      required_error: "Please select a category",
    })
    .min(1, {
      message: "Category not selected",
    }),
  tags: z.string({
    required_error: "Please enter the tags",
  }),
});
type Schema = z.infer<typeof schema>;

const AddNewPlaybook = ({
  open,
  handleClose,
  categoryData,
  tags
}: {
  open: boolean;
  setOpen: () => void;
  categoryData?: Category;
  handleClose: () => void;
  tags: string[];
}) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [isAppOpen, setIsAppOpen] = React.useState(false);

  async function onSubmit(input: Schema) {
    const data = {
      ...input,
      content_type:
        location.pathname === "/Content-index" ? "playbooks" : "news",
      tags: selectedTags, 
    };
    setLoading(true);
    toast.promise(dispatch(createPlaybook(data)).unwrap(), {
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
          category: "",
          tags: "",
        });
        setLoading(false);
        setSelectedTags([]);
        handleClose();
      },
    });
  }

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
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
          category: "",
          tags: "",
        });
        handleClose();
        setSelectedTags([]);
      }}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add new Library</DialogTitle>
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
                      <Input {...field} placeholder="Enter library's name" />
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
                    <FormLabel>Category</FormLabel>
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
                <FormItem className="flex flex-col pt-2">
                  <FormLabel>Tags</FormLabel>
                  <Popover
                    modal={true}
                    open={isAppOpen}
                    onOpenChange={setIsAppOpen}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-[530px] justify-between"
                        >
                          {selectedTags.length > 0
                            ? selectedTags.join(", ")
                            : "Select Tags"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px]  overflow-auto max-h-[40vh]">
                      <Command aria-modal>
                        <CommandGroup>
                          {tags?.map((tag: any) => (
                            <CommandItem
                              value={tag}
                              key={tag}
                              onSelect={() => {
                                if (!selectedTags.includes(tag)) {
                                  setSelectedTags((prev) => [...prev, tag]);
                                } else {
                                  setSelectedTags((prev) =>
                                    prev.filter((t) => t !== tag)
                                  );
                                }
                                setIsAppOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedTags.includes(tag)
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {tag}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
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

export default AddNewPlaybook;
