"use client";

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
import { useTranslations } from "next-intl";
import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { User } from "@/lib/api";
import { getImageUrl } from "@/lib/image-utils";
import {
    ChevronDownIcon,
    MailIcon,
    MoreHorizontalIcon,
    SearchIcon,
    SlidersHorizontalIcon,
    UserIcon,
} from "lucide-react";

interface DataTableProps {
    columns: ColumnDef<User>[];
    data: User[];
    loading?: boolean;
}

export function DataTable({ columns, data, loading }: DataTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const t = useTranslations("users");
    const tTable = useTranslations("table");

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
            {/* Enhanced Table Toolbar */}
            <div className="space-y-4 py-4">
                {/* Mobile: Stack filters vertically */}
                <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                    <div className="flex flex-col space-y-2 md:flex-1 md:flex-row md:items-center md:space-y-0 md:space-x-2">
                        {/* Global Search */}
                        <div className="relative w-full md:max-w-sm">
                            <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                            <Input
                                placeholder={t("searchPlaceholder")}
                                value={
                                    (table
                                        .getColumn("name")
                                        ?.getFilterValue() as string) ?? ""
                                }
                                onChange={event =>
                                    table
                                        .getColumn("name")
                                        ?.setFilterValue(event.target.value)
                                }
                                className="pl-10"
                            />
                        </div>

                        {/* Filter Row - Mobile: Stack, Desktop: Inline */}
                        <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                            {/* Role Filter */}
                            <Select
                                value={
                                    (table
                                        .getColumn("role")
                                        ?.getFilterValue() as string) ?? ""
                                }
                                onValueChange={value =>
                                    table
                                        .getColumn("role")
                                        ?.setFilterValue(
                                            value === "all" ? "" : value
                                        )
                                }
                            >
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <SelectValue
                                        placeholder={t("filterByRole", {
                                            default: "Filter by role",
                                        })}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All roles
                                    </SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="user">User</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Status Filter */}
                            <Select
                                value={
                                    (table
                                        .getColumn("active")
                                        ?.getFilterValue() as string) ?? ""
                                }
                                onValueChange={value => {
                                    const filterValue =
                                        value === "all"
                                            ? undefined
                                            : value === "active"
                                              ? true
                                              : value === "inactive"
                                                ? false
                                                : undefined;
                                    table
                                        .getColumn("active")
                                        ?.setFilterValue(filterValue);
                                }}
                            >
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <SelectValue
                                        placeholder={t("filterByStatus", {
                                            default: "Filter by status",
                                        })}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All status
                                    </SelectItem>
                                    <SelectItem value="active">
                                        Active
                                    </SelectItem>
                                    <SelectItem value="inactive">
                                        Inactive
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Clear Filters */}
                            {table.getState().columnFilters.length > 0 && (
                                <Button
                                    variant="ghost"
                                    onClick={() => table.resetColumnFilters()}
                                    className="h-8 w-full px-2 md:w-auto lg:px-3"
                                >
                                    Reset
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Column Visibility Toggle */}
                    <div className="flex justify-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full md:w-auto"
                                >
                                    <SlidersHorizontalIcon className="mr-2 h-4 w-4" />
                                    {t("table.view", { default: "View" })}
                                    <ChevronDownIcon className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-[150px]"
                            >
                                <DropdownMenuLabel>
                                    {t("table.toggleColumns", {
                                        default: "Toggle columns",
                                    })}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {table
                                    .getAllColumns()
                                    .filter(
                                        column =>
                                            typeof column.accessorFn !==
                                                "undefined" &&
                                            column.getCanHide()
                                    )
                                    .map(column => {
                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                className="capitalize"
                                                checked={column.getIsVisible()}
                                                onCheckedChange={value =>
                                                    column.toggleVisibility(
                                                        !!value
                                                    )
                                                }
                                            >
                                                {column.id}
                                            </DropdownMenuCheckboxItem>
                                        );
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden rounded-md border md:block">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    <div className="flex items-center justify-center">
                                        <div className="border-primary h-6 w-6 animate-spin rounded-full border-b-2"></div>
                                        <span className="ml-2">
                                            {t("loading")}
                                        </span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map(cell => (
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
                                    {t("noUsers")}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card View */}
            <div className="space-y-4 md:hidden">
                {loading ? (
                    <div className="flex h-24 items-center justify-center">
                        <div className="border-primary h-6 w-6 animate-spin rounded-full border-b-2"></div>
                        <span className="ml-2">{t("loading")}</span>
                    </div>
                ) : table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map(row => {
                        const user = row.original;
                        return (
                            <div
                                key={row.id}
                                className="bg-card space-y-3 rounded-lg border p-4"
                            >
                                {/* User Header */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage
                                                src={getImageUrl(user.profile_photo)}
                                                alt={user.name}
                                            />
                                            <AvatarFallback className="bg-gradient-to-r from-amber-400 to-amber-500 text-sm font-semibold text-white">
                                                {user.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h4 className="font-semibold">
                                                {user.name}
                                            </h4>
                                            <div className="text-muted-foreground flex items-center space-x-2 text-sm">
                                                <MailIcon className="h-3 w-3" />
                                                <span>{user.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <MoreHorizontalIcon className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            {/* Actions from the original table actions */}
                                            {row
                                                .getVisibleCells()
                                                .find(
                                                    cell =>
                                                        cell.column.id ===
                                                        "actions"
                                                )?.column.columnDef.cell &&
                                                flexRender(
                                                    row
                                                        .getVisibleCells()
                                                        .find(
                                                            cell =>
                                                                cell.column
                                                                    .id ===
                                                                "actions"
                                                        )?.column.columnDef
                                                        .cell!,
                                                    row
                                                        .getVisibleCells()
                                                        .find(
                                                            cell =>
                                                                cell.column
                                                                    .id ===
                                                                "actions"
                                                        )
                                                        ?.getContext()!
                                                )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* User Details */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground text-sm">
                                            Role
                                        </span>
                                        <Badge
                                            variant={
                                                user.role === "admin"
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {user.role}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground text-sm">
                                            Status
                                        </span>
                                        <Badge
                                            variant={
                                                user.active
                                                    ? "default"
                                                    : "destructive"
                                            }
                                        >
                                            {user.active
                                                ? "Active"
                                                : "Inactive"}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground text-sm">
                                            Created
                                        </span>
                                        <span className="text-sm">
                                            {new Date(
                                                user.created_at
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="py-8 text-center">
                        <UserIcon className="text-muted-foreground mx-auto mb-2 h-12 w-12" />
                        <p className="text-muted-foreground">{t("noUsers")}</p>
                    </div>
                )}
            </div>
            {/* Enhanced Responsive Pagination */}
            <div className="flex flex-col space-y-4 py-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div className="flex items-center justify-center space-x-2 md:justify-start">
                    <p className="hidden text-sm font-medium md:block">
                        {tTable("rowsPerPage")}
                    </p>
                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={value => {
                            table.setPageSize(Number(value));
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue
                                placeholder={
                                    table.getState().pagination.pageSize
                                }
                            />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[5, 10, 20, 30, 40, 50].map(pageSize => (
                                <SelectItem
                                    key={pageSize}
                                    value={`${pageSize}`}
                                >
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center justify-center space-x-4 md:space-x-6 lg:space-x-8">
                    <div className="flex items-center justify-center text-sm font-medium">
                        <span className="hidden md:inline">
                            {tTable("page")}&nbsp;
                        </span>
                        <span>{table.getState().pagination.pageIndex + 1}</span>
                        <span className="hidden md:inline">
                            &nbsp;{tTable("of")}&nbsp;{table.getPageCount()}
                        </span>
                        <span className="md:hidden">
                            &nbsp;/&nbsp;{table.getPageCount()}
                        </span>
                    </div>
                    <div className="flex items-center space-x-1 md:space-x-2">
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            {"<<"}
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            {"<"}
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            {">"}
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() =>
                                table.setPageIndex(table.getPageCount() - 1)
                            }
                            disabled={!table.getCanNextPage()}
                        >
                            {">>"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
