import {
  IFile,
  useGetFileQuery,
} from "@/redux/file/fileSlice";
import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronUp,
  FolderIcon,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/component/ui/button";
import { Checkbox } from "@/component/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/component/ui/dropdown-menu";
import { Input } from "@/component/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/component/ui/table";
import { formatBytes } from "@/lib/utils";
import {
  Folder,
  useGetCategoriesQuery,
} from "@/redux/folder/folderSlice";
import { TreeDropdownFile } from "./TreeDropdown";
import { useNavigate } from "react-router-dom";

export const columns: ColumnDef<TableData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const file = row.original;
      if (file.type === "file") {
        const isEmbedded =
          file.embedded_status &&
          file.embedded_status.some((status) => status.status);
        return (
          <div className="flex items-center">
            <span
              className={`inline-block h-2 w-2 mr-2 rounded-full ${isEmbedded ? "bg-green-500" : "bg-yellow-500"}`}
            ></span>
            <div className="capitalize">{row.getValue("name")}</div>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-2">
          <FolderIcon className="h-4 w-4 text-muted-foreground" />
          <div className="capitalize">{row.getValue("name")}</div>
        </div>
      );
    },
  },
  {
    accessorFn: (x) =>
      x.type === "file" ? x.uploaded_by.full_name : x.created_by.full_name,
    header: "Created By",
    cell: ({ row }) => {
      return <div className="capitalize">{row.getValue("Created By")}</div>;
    },
  },
  {
    accessorFn: (x) =>
      x.type === "file" ? x.uploaded_first_time : x.created_at,
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("Created At"));
      return <div className="capitalize">{date.toDateString()}</div>;
    },
    sortingFn: (rowA, rowB) => {
      return (
        +new Date(rowA.getValue("Created At")) -
        +new Date(rowB.getValue("Created At"))
      );
    },
  },
  {
    accessorKey: "file_size",
    header: "Size",
    cell: ({ row }) => {
      if (row.original.type === "file")
        return (
          <div className="capitalize">
            {formatBytes(row.getValue("file_size"))}
          </div>
        );
      return <div>-</div>;
    },
  },
  {
    accessorFn: (x) => (x.type === "file" ? x.categories[0] : "Folder"),
    header: "Category",
    cell: ({ row }) => {
      if (row.original.type === "file") {
        const category = row.getValue("Category") as {
          id: string;
          name: string;
          description: string;
        };
        return <div className="capitalize flex flex-1">{category.name}</div>;
      } else {
        return <div>{row.getValue("Category")}</div>;
      }
    },
    enableSorting: false,
    filterFn: "categoryFilter" as any,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const file = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <TreeDropdownFile id={file.id} />
        </DropdownMenu>
      );
    },
  },
];

type TableData = (IFile & { type: "file" }) | (Folder & { type: "folder" });

const DashboardFileList = ({
  folderId,
  folderData,
  tableData,
  setTableData
}: {
  folderId?: string;
  folderData: Folder[];
  tableData: Folder;
  setTableData: (data: Folder) => void;
}) => {
  const {
    data: fileData,
    isLoading,
    isError,
    error,
  } = useGetFileQuery(folderId);
  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    isError: isCategoriesLoadingError,
  } = useGetCategoriesQuery();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([
    { id: "Category", value: [] },
  ]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const navigate = useNavigate();

  React.useEffect(() => {
    if (categoriesData) {
      setColumnFilters([
        { id: "Category", value: categoriesData.map((x) => x.name) },
      ]);
    }
  }, [categoriesData]);

  const [data, setData] = React.useState<TableData[]>([]);

  React.useEffect(() => {
    const newData: TableData[] = [];

    if (fileData) {
      fileData.forEach(file => newData.push({ ...file, type: "file" }));
    }
    
    if (tableData.children) {
      tableData.children.forEach(child => newData.push({ ...child, type: "folder" }));
    }
    
    setData(newData);
  }, [tableData, fileData]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    filterFns: {
      categoryFilter: (row, columnId, filterValue) => {
        if (row.original.type === "file") {
          return filterValue.includes(row.original["categories"][0].name);
        }
        return true;
      },
    },
    enableMultiSort: true,
  });

  if (isLoading || isCategoriesLoading) {
    return <div>Loading...</div>;
  }

  if (isError || isCategoriesLoadingError) {
    return <div>{error!.toString()}</div>;
  }

  const setFolderId = (id?: string) => {
    navigate(id ? `/files/${id}` : `/files`);
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter names..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Filter <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {(categoriesData ?? []).map((category) => (
              <DropdownMenuCheckboxItem
                key={category.id}
                className="capitalize"
                checked={(columnFilters[0].value as string[]).includes(category.name)}
                onCheckedChange={(value) => {
                  const v = columnFilters[0].value as string[];
                  setColumnFilters([
                    {
                      id: "Category",
                      value: value ? [...v, category.name] : v.filter((x) => x !== category.name),
                    },
                  ]);
                }}
              >
                {category.name}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    onClick={() => header.column.getCanSort() && header.column.toggleSorting()}
                    title={
                      header.column.getCanSort()
                        ? header.column.getNextSortingOrder() === "asc"
                          ? "Sort ascending"
                          : header.column.getNextSortingOrder() === "desc"
                          ? "Sort descending"
                          : "Clear sort"
                        : undefined
                    }
                  >
                    <div className="flex flex-row items-center gap-2">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === "desc" && <ChevronUp />}
                      {header.column.getIsSorted() === "asc" && <ChevronDown />}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => {
                    if (row.original.type === "folder") {
                      setFolderId(row.original.id);
                      setTableData(row.original);
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
      </div>
    </div>
  );
};

export { DashboardFileList };
