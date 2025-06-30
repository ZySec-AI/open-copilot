import { useState } from "react";
import { User } from "../../data/Mockdata";
import CreateUser from "../../modal/CreateUser";
import { BsPlus } from "react-icons/bs";
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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/component/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
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
import { Button } from "@/component/ui/button";
import { useDispatch } from "react-redux";
import {
    RETRIEVE_DELETE_USER,
    USER_LIST_REQUEST,
} from "@/redux/auth/authAction";
import { useAuthMaster } from "@/redux/auth/authReducer";
import EditUserModal from "@/component/modal/EditUserModal";

const Usermanagement = () => {
    const [user, setUser] = useState(false);
    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch({ type: USER_LIST_REQUEST });
    }, [dispatch]);
    const { retrieveUsers } = useAuthMaster();
    return (
        <div className="flex justify-center">

            <div className="flex flex-col p-10 w-full h-full  max-w-[1200px]">
                <div className="font-bold text-3xl capitalize pb-8">user management</div>
                <div className="flex gap-10 justify-between pb-2">
                    <div>
                        <div className="text-2xl font-bold  ">Management</div>
                        <div className="text-sm text-gray-500 mt-1">
                            User Mangement enables users to access  and control.
                        </div>
                    </div>
                    <Button onClick={() => setUser(true)} variant="outline">
                        <BsPlus style={{ fontSize: "2rem" }} /> Create User
                    </Button>
                </div>
                <div className="self-center w-full max-w-[1800px]">
                    <UserTable data={retrieveUsers} />
                </div>
            </div>
            <CreateUser open={user} handleClose={() => setUser(false)} />
        </div>
    );
};

export const columns: ColumnDef<User>[] = [
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
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => <div className="capitalize">{row.index + 1}</div>,
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
        accessorKey: "full_name",
        header: "Name",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("full_name")}</div>
        ),
    },
    {
        accessorKey: "roles",
        header: "Role",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("roles")}</div>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const user = row.original;
            const [edituser, setEdituser] = useState(false);
            const [edituserdata, setEdituserdata] = useState({
                email: "",
                full_name: "",
            });
            const [dropdownOpen, setDropdownOpen] = useState(false);
            const dispatch = useDispatch();
            const handleDeleteUser = async () => {
                try {
                    dispatch({ type: RETRIEVE_DELETE_USER, payload: user.id });
                } catch (error) {
                    throw error;
                }
            };
            return (
                <>
                    <DropdownMenu
                        open={dropdownOpen}
                        onOpenChange={(x) => setDropdownOpen(x)}
                    >
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(user.email)}
                            >
                                Copy Email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Reset Password</DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    setDropdownOpen(false);
                                    setEdituser(true);
                                    setEdituserdata({
                                        email: user.email,
                                        full_name: user.full_name,
                                    });
                                }}
                            >
                                Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDeleteUser}>
                                Disable User
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <EditUserModal
                        open={edituser}
                        handleClose={() => setEdituser(false)}
                        userid={user.id}
                        edituserdata={edituserdata}
                        setEdituserdata={setEdituserdata}
                    />
                </>
            );
        },
    },
];

export function UserTable({ data }: { data: User[] }) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    );
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

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
    });

    return (
        <div className="w-full">
            <div className="flex space-x-[38vw] items-center py-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
                <Input
                    placeholder="Filter emails..."
                    value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("email")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
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
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Usermanagement;
