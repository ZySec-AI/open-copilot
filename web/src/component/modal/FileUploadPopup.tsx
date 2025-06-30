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
    FormMessage
} from "@/component/ui/form";
import { toast } from "sonner";
import { Button } from "@/component/ui/button";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUploadFileMutation } from "@/redux/file/fileSlice";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from "@/component/ui/input";
import { useGetCategoriesQuery } from "@/redux/folder/folderSlice";
import { Check, ChevronsUpDown } from "lucide-react";
import { FileUploader } from "@/component/ui/file-uploader";

const schema = z.object({
    file: z.array(z.instanceof(File)).length(1),
    description: z.string({
        required_error: "Please add a description"
    }).min(1, {
        message: "Please add a description."
    }),
    categories: z.string({
        required_error: "Please select a category",
    }).min(1, {
        message: "Please select a category",
    }),
});

type Schema = z.infer<typeof schema>;

function FileUploadPopup({ parentFolderId, open, setOpen }: { parentFolderId?: string, open: boolean, setOpen: (x: boolean) => void }) {
    const [loading, setLoading] = React.useState(false);
    const [uploadFile, _result] = useUploadFileMutation();
    const [isCategoryOpen, setIsCategoryOpen] = React.useState(false);
    const { currentData: categories, isLoading } = useGetCategoriesQuery();

    const form = useForm<Schema>({
        resolver: zodResolver(schema),
        defaultValues: {
            file: [],
            description: "",
            categories: "",
        }
    });

    async function onSubmit(input: Schema) {
        setLoading(true);

        const x = new FormData();

        x.set("description", input.description);
        x.set("file", input.file[0]);
        x.set("folder_id", parentFolderId ?? "");
        x.set("categories", input.categories);
        x.set("tags", "");

        toast.promise(uploadFile(x).unwrap(), {
            loading: "Uploading File...",
            success: () => {
                form.reset();
                return "File Uploaded";
            },
            error: () => {
                return "Error in uploading file...";
            },
            finally: () => {
                form.reset({ file: [], description: "", categories: "" });
                setLoading(false);
                setOpen(false);
            }
        });
    }

    if (isLoading || !categories) {
        return <div>Loading...</div>;
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(x) => { form.reset({ file: [], description: "", categories: "" }); setOpen(x); }}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Upload files</DialogTitle>
                    <DialogDescription>
                        Drag and drop your files here or click to browse.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex w-full flex-col gap-6"
                    >
                        <FormField
                            control={form.control}
                            name="file"
                            render={({ field }) => (
                                <div className="space-y-6">
                                    <FormItem className="w-full">
                                        <FormLabel>File</FormLabel>
                                        <FormControl>
                                            <FileUploader
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                maxFiles={1}
                                                maxSize={4 * 1024 * 1024}
                                                accept={[
                                                    'application/pdf',
                                                    'application/vnd.ms-powerpoint',
                                                    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                                                    'application/msword',
                                                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                                                    'text/plain',
                                                    'text/markdown'
                                                ]}
                                                disabled={loading}
                                            />
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
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        <FormDescription>
                                            Write a description about the file.
                                        </FormDescription>
                                    </FormItem>
                                </div>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="categories"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Category</FormLabel>
                                    <Popover modal={true} open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-[200px] justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? categories.find(
                                                            (category) => category.name === field.value
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
                                                            value={category.name}
                                                            key={category.id}
                                                            onSelect={() => {
                                                                form.setValue("categories", category.name);
                                                                setIsCategoryOpen(false);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    category.name === field.value
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

                        <Button className="bg-blue-700 rounded-lg border hover:border-blue-600 text-white hover:bg-white duration-300 ease-in-out hover:text-blue-600 px-1 w-full py-4" disabled={loading} type="submit">
                            Save
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default FileUploadPopup;
