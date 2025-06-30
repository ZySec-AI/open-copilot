import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/component/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/component/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/component/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/component/ui/form";
import { toast } from "sonner";
import { Button } from "@/component/ui/button";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from "@/component/ui/input";
import { useGetCategoriesQuery } from "@/redux/folder/folderSlice";
import { Check, ChevronsUpDown } from "lucide-react";
import { FileUploader } from "@/component/ui/file-uploader";
import { Switch } from "@/component/ui/switch";
import {
  useCreateExpertMutation,
  useGetExpertsQuery,
} from "@/redux/expert/expertSlice";
import { Textarea } from "flowbite-react";
import { useAppSelector } from "@/hook";

interface CreateAssistanceModalProps {
  open: boolean;
  setOpen: (x: boolean) => void;
}

const schema = z.object({
  avatar: z.array(z.instanceof(File)).length(1, "Please select an avatar."),
  expert_type: z.enum(["app", "category"], "Please select an expert type."),
  apps: z
    .array(z.string({ required_error: "Please select up to 3 apps." }))
    .min(1, { message: "Please select at least one app." })
    .max(3, { message: "You can select up to 3 apps." }),
  name: z
    .string({ required_error: "Please add a name." })
    .min(1, { message: "Please add a name." }),
  description: z
    .string({ required_error: "Please add a description." })
    .min(1, { message: "Please add a description." }),
  categories: z
    .string({ required_error: "Please select a category." })
    .min(1, { message: "Please select a category." }),
  model: z
    .string({ required_error: "Please add a model." })
    .min(1, { message: "Please add a model." }),
  system_prompt: z
    .string({ required_error: "Please add a prompt." })
    .min(1, { message: "Please add a prompt." }),
  enable_internet: z.boolean({
    required_error: "Please select enable internet.",
  }),
});

type Schema = z.infer<typeof schema>;

const initialValues = {
  avatar: [],
  apps: [],
  description: "",
  name: "",
  categories: "",
  system_prompt: "",
  enable_internet: false,
};

const CreateAssistanceModal: React.FC<CreateAssistanceModalProps> = ({
  open,
  setOpen,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [createExpert] = useCreateExpertMutation();
  const [isCategoryOpen, setIsCategoryOpen] = React.useState(false);
  const [isAppOpen, setIsAppOpen] = React.useState(false);
  const [isModelOpen, setIsModelOpen] = React.useState(false);
  const { appData } = useAppSelector((state: any) => state.system);
  const { currentData: categories, isLoading } = useGetCategoriesQuery();
  const { data: applications } = useGetExpertsQuery();

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  async function onSubmit(input: Schema) {
    setLoading(true);

    const x = new FormData();

    x.append("avatar", input.avatar[0]);
    x.append("expert_name", input.name);
    x.append("expert_type", input.expert_type);
    x.append("description", input.description);
    x.append("category", input.categories);
    x.append("system_prompt", input.system_prompt);
    x.append("internet_required", String(input.enable_internet));
    x.append("model", input.model); 
    input.apps.forEach((app, index) => {
      x.append(`allowed_apps`, app);
    });

    toast.promise(createExpert(x).unwrap(), {
      loading: "Creating assistance...",
      success: () => {
        form.reset(initialValues);
        return "Assistance created";
      },
      error: () => {
        return "Error in creating assistance...";
      },
      finally: () => {
        form.reset(initialValues);
        setLoading(false);
        setOpen(false);
      },
    });
  }

  if (isLoading || !categories) {
    return <div></div>;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(x) => {
        form.reset(initialValues);
        setOpen(x);
      }}
    >
      <DialogContent className="sm:max-w-screen-lg overflow-auto max-h-[70vh]">
        <DialogHeader>
          <DialogTitle>Create Assistant</DialogTitle>
          <DialogDescription>Create new Assistant</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-wrap"
          >
            <div className="w-1/2 pr-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Write name of the assistance.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Write description about the assistance.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expert_type"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Expert Type</FormLabel>
                    <FormControl>
                      <select {...field} className="w-full p-2 border rounded">
                        <option value="">Select Type</option>
                        <option value="app">App</option>
                        <option value="category">Category</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Select the type of expert.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="apps"
                render={({ field }) => (
                  <FormItem className="flex flex-col pt-2">
                    <FormLabel>App</FormLabel>
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
                            className="w-[480px] justify-between"
                          >
                            {Array.isArray(field.value) &&
                            field.value.length > 0
                              ? field.value.join(", ")
                              : "Select App"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] overflow-auto max-h-[40vh]">
                        <Command aria-modal>
                          <CommandInput placeholder="Search Apps..." />
                          <CommandEmpty>No App found.</CommandEmpty>
                          <CommandGroup>
                            {appData?.map((app: any) => (
                              <CommandItem
                                value={app?.name}
                                key={app.id}
                                onSelect={() => {
                                  const currentValue = Array.isArray(
                                    field.value
                                  )
                                    ? field.value
                                    : [];
                                  if (currentValue.includes(app.name)) {
                                    field.onChange(
                                      currentValue.filter(
                                        (item) => item !== app.name
                                      )
                                    );
                                  } else if (currentValue.length < 3) {
                                    field.onChange([...currentValue, app.name]);
                                  }
                                  setIsAppOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-1 w-1",
                                    Array.isArray(field.value) &&
                                      field.value.includes(app.name)
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {app.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      You can select an App here
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categories"
                render={({ field }) => (
                  <FormItem className="flex flex-col pt-2">
                    <FormLabel>Category</FormLabel>
                    <Popover
                      modal={true}
                      open={isCategoryOpen}
                      onOpenChange={setIsCategoryOpen}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-[480px] justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? categories.find(
                                  (category) => category.id === field.value
                                )?.name
                              : "Select Category"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command aria-modal>
                          <CommandInput placeholder="Search Categories..." />
                          <CommandEmpty>No Category found.</CommandEmpty>
                          <CommandGroup>
                            {categories.map((category) => (
                              <CommandItem
                                value={category.id}
                                key={category.id}
                                onSelect={() => {
                                  form.setValue("categories", category.id);
                                  setIsCategoryOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-1",
                                    category.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {category.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      This will be used to filter the files later.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
                    <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem className="flex flex-col pt-2">
                    <FormLabel>Model</FormLabel>
                    <Popover
                      modal={true}
                      open={isModelOpen}
                      onOpenChange={setIsModelOpen}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                            {field.value || "Select Model"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] overflow-auto max-h-[40vh]">
                        <Command aria-modal>
                          <CommandInput placeholder="Search Models..." />
                          <CommandEmpty>No Model found.</CommandEmpty>
                          <CommandGroup>
                            {appData?.map((app: any) => (
                              <CommandItem
                                value={app?.name}
                                key={app.id}
                                onSelect={() => {
                                  field.onChange(app.name);
                                  setIsModelOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-1 w-1",
                                    field.value === app.name
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {app.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Select the model for the assistance.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-1/2 pl-2">
              <FormField
                control={form.control}
                name="enable_internet"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg">
                    <div className="space-y-0.5">
                      <FormLabel>Enable Internet</FormLabel>
                      <FormDescription>
                        Allow expert to have internet access
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem className="w-full ">
                    <FormLabel>File</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value}
                        onValueChange={field.onChange}
                        maxFiles={1}
                        maxSize={4 * 1024 * 1024}
                        accept={{ "image/*": [] }}
                        className="h-[90px] "
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Add avatar of the assistant.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="system_prompt"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>System Prompt</FormLabel>
                    <FormControl>
                      <Textarea className="h-[40vh] p-3" {...field} />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Write system prompt for the expert.
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>

            <Button
              className="bg-blue-700 mt-4 rounded-lg border hover:border-blue-600 text-white hover:bg-white duration-300 ease-in-out hover:text-blue-600 px-1 w-full py-4"
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

export { CreateAssistanceModal };
