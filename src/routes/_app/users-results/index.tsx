import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef, VisibilityState, RowSelectionState } from "@tanstack/react-table";
import {
  ArrowDown,
  ChevronsUpDown,
  Eye,
  Rows3,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "../../../components/ui/dropdown-menu";
import type { TForm } from "../../../types/form";
import { FORM_DATA } from "../../../data/form";
import AppActionsDropdown from "../../../components/app-actions-dropdown";
import AppTable from "../../../components/app-table";
import { Button } from "../../../components/ui/button";
import SearchBar from "../../../components/ui/search-bar";
import IconSort from "../../../components/svg-icon/icon-sort";
import IconExport from "../../../components/svg-icon/icon-export";
import { Checkbox } from "../../../components/ui/checkbox";
import { Badge } from "../../../components/ui/badge";
import { cn } from "../../../lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "../../../components/ui/alert-dialog";
import FormUser from "./-components/form-user";
import IconUpdate from "../../../components/svg-icon/icon-update";
import AppPagination from "../../../components/app-pagination";
import { useGetAllUsersResults } from "./-api/queries/use-get-all-users-results";
import { SearchSchema } from "../../../types/search";
import { z } from "zod";
import Loading from "../../../components/base/loading";
import type { TUsersResultsSchema } from "./-type/users-results";
import IconDelete from "../../../components/svg-icon/icon-delete";
import { useDeleteUserResult } from "./-api/mutations/use-delete-user-result";
import { useDebounce } from "../../../hooks/search-hooks";
import { toast } from "sonner";
import { useExport } from "../../../hooks/use-export";

export const Route = createFileRoute("/_app/users-results/")({
  component: RouteComponent,
  validateSearch: SearchSchema.extend({
    plan: z.string().optional(),
    order_by: z.string().optional(),
    order: z.string().optional(),
  }),
});

const statusVariantMap = {
  active: "active",
  suspended: "suspended",
  inactive: "unavailable",
} as const;

function RouteComponent() {
  const [form, setForm] = useState<TForm>(FORM_DATA);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const navigate = Route.useNavigate();
  const params = Route.useSearch();

  // Search state
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  // API queries
  const { data: usersResultsResponse, isLoading, refetch } = useGetAllUsersResults({
    params: {
      ...params,
      page: debouncedSearch ? -1 : params?.page,
      search: debouncedSearch, // Use debounced search here
      order_by: params.order_by || "id",
      order: params.order || "desc",
    },
    options: {
      enabled: true,
    },
  });

  const { data, meta } = usersResultsResponse ?? {};

  const { mutate: deleteUser, isPending: isPendingDelete } = useDeleteUserResult();
  const { exportData } = useExport();

  const handleExport = async () => {
    try {
      const selectedIds = Object.keys(rowSelection)
        .map((index) => data?.[Number(index)]?.id)
        .filter((id) => id !== undefined && id !== null);

      const exportParams = {
        ids: selectedIds.join(","),
        search: params.search,
        order_by: params.order_by,
        order: params.order,
        plan: params.plan,
      };

      await exportData(
        {
          endpoint: "/export-user-results",
          filename: "users-results.xlsx",
        },
        exportParams
      );
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export users results");
    }
  };

  const columns: ColumnDef<TUsersResultsSchema>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center gap-3">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
          <div className="flex items-center gap-1">
            <span className="font-medium">SL</span>
            <ArrowDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
          <span className="font-medium">
            {(params.page - 1) * params.per_page + (row.index + 1)}
          </span>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 80,
    },
    {
      accessorKey: "name",
      header: () => (
        <Button
          variant="ghost"
          onClick={() => {
            const isCurrent = params.order_by === "name";
            const newOrder = isCurrent && params.order === "asc" ? "desc" : "asc";
            navigate({
              search: { ...params, order_by: "name", order: newOrder },
            });
          }}
        >
          Name
          <ArrowDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
      size: 200,
    },
    {
      header: () => (
        <Button
          variant="ghost"
          onClick={() => {
            const isCurrent = params.order_by === "email";
            const newOrder = isCurrent && params.order === "asc" ? "desc" : "asc";
            navigate({
              search: { ...params, order_by: "email", order: newOrder },
            });
          }}
          className="flex items-center gap-1"
        >
          Email
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      ),
      accessorKey: "email",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("email")}</div>
      ),
      size: 250,
    },
    {
      header: () => (
        <Button
          variant="ghost"
          onClick={() => {
            const isCurrent = params.order_by === "last_device_used";
            const newOrder = isCurrent && params.order === "asc" ? "desc" : "asc";
            navigate({
              search: { ...params, order_by: "last_device_used", order: newOrder },
            });
          }}
          className="flex items-center gap-1"
        >
          Device Used
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      ),
      accessorKey: "last_device_used",
      cell: ({ row }) => (
        <div className="font-medium px-6">
          {row.getValue("last_device_used") || "N/A"}
        </div>
      ),
      size: 150,
    },
    {
      header: () => (
        <Button
          variant="ghost"
          onClick={() => {
            const isCurrent = params.order_by === "plan";
            const newOrder = isCurrent && params.order === "asc" ? "desc" : "asc";
            navigate({
              search: { ...params, order_by: "plan", order: newOrder },
            });
          }}
          className="flex items-center gap-1"
        >
          Plan
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      ),
      accessorKey: "plan",
      cell: ({ row }) => {
        const plan = row.getValue("plan") as string;
        const planColors = {
          pro: "bg-gradient text-[#585051]",
          premium: "bg-gradient text-[#585051]",
          free: "bg-gray-100 text-gray-600",
        };

        return (
          <Badge
            variant="outline"
            className={cn(planColors[plan?.toLowerCase() as keyof typeof planColors])}
          >
            {plan?.charAt(0).toUpperCase() + plan?.slice(1) || "N/A"}
          </Badge>
        );
      },
      size: 120,
    },
    {
      header: () => (
        <Button
          variant="ghost"
          onClick={() => {
            const isCurrent = params.order_by === "analysis_taken_count";
            const newOrder = isCurrent && params.order === "asc" ? "desc" : "asc";
            navigate({
              search: { ...params, order_by: "analysis_taken_count", order: newOrder },
            });
          }}
          className="flex items-center gap-1"
        >
          Tests Taken
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      ),
      accessorKey: "analysis_taken_count",
      cell: ({ row }) => (
        <div className="font-medium px-8">{row.getValue("analysis_taken_count")}</div>
      ),
      size: 120,
    },
    {
      header: () => (
        <Button
          variant="ghost"
          onClick={() => {
            const isCurrent = params.order_by === "last_analysis_date";
            const newOrder = isCurrent && params.order === "asc" ? "desc" : "asc";
            navigate({
              search: { ...params, order_by: "last_analysis_date", order: newOrder },
            });
          }}
          className="flex items-center gap-1"
        >
          Last Test Date
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      ),
      accessorKey: "last_analysis_date",
      cell: ({ row }) => {
        const date = row.getValue("last_analysis_date") as string | null;
        return (
          <div className="font-medium px-6">
            {date ? new Date(date).toLocaleDateString() : "01/12/2022"}
          </div>
        );
      },
      size: 150,
    },
    {
      header: () => (
        <Button
          variant="ghost"
          onClick={() => {
            const isCurrent = params.order_by === "status";
            const newOrder = isCurrent && params.order === "asc" ? "desc" : "asc";
            navigate({
              search: { ...params, order_by: "status", order: newOrder },
            });
          }}
          className="flex items-center gap-1"
        >
          Status
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      ),
      accessorKey: "status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const statusKey = status?.toLowerCase() as keyof typeof statusVariantMap;

        return (
          <Badge variant={statusVariantMap[statusKey] || "unavailable"}>
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                statusKey === "active" && "bg-[#34C759]",
                statusKey === "suspended" && "bg-[#FF9500]",
                (statusKey === "inactive" || !statusKey) && "bg-[#FF3B30]"
              )}
            />
            {status?.charAt(0).toUpperCase() + status?.slice(1) || "N/A"}
          </Badge>
        );
      },
      size: 120,
    },
    {
      header: "Actions",
      accessorKey: "action",
      cell: ({ row }) => {
        const data = row.original;
        return (
          <AppActionsDropdown
            actions={[
              {
                type: "read",
                name: "view",
                icon: Eye,
                props: {
                  className: "text-primary",
                  onClick: () =>
                    navigate({
                      to: "/users-results/$userId",
                      params: { userId: data.id.toString() },
                    }),
                },
              },
              {
                type: "update",
                name: "edit",
                icon: IconUpdate,

                props: {
                  className: "text-primary",
                  onClick: () =>
                    setForm({
                      type: "update",
                      title: "Update User Result",
                      description: "",
                      id: String(data.id),
                    }),
                },
              },
              {
                type: "delete",
                name: "delete",
                icon: IconDelete,
                props: {
                  variant: "delete",
                  onClick: () =>
                    setForm({
                      type: "delete",
                      title: "",
                      description: "",
                      id: String(data.id),
                    }),
                },
              },
            ]}
          />
        );
      },
      size: 100,
    },
  ];

  if (isLoading) return <Loading />;

  return (
    <div className="p-4">
      <div className="flex justify-between mb-6">
        <h1 className="text-primary text-custom-header-text text-4xl font-bold">
          Users & Results
        </h1>
        {/* <Button
          variant="customGradient"
          className="border-custom-footer-text-red text-custom-footer-text-red hover:bg-red-50 whitespace-nowrap"
          onClick={() =>
            setForm({
              type: "create",
              title: "Add New User",
              description: "",
            })
          }
        >
          <Plus /> Add New User
        </Button> */}
      </div>
      <div className="mb-4">
        <div className="flex items-center justify-between w-full gap-3">
          <div className="flex items-center gap-3 w-full">
            <SearchBar
              searchValue={search}
              onSearchChange={(value) => {
                setSearch(value);
                navigate({
                  search: { ...params, page: 1 },
                });
              }}
              variant="bordered"
            />
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="gray">
                  <Rows3 /> Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[150px]">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(columns as any[])
                  .filter((column) => typeof column.accessorKey === "string")
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.accessorKey}
                        className="capitalize"
                        checked={columnVisibility[column.accessorKey] !== false}
                        onCheckedChange={(value) =>
                          setColumnVisibility((prev) => ({
                            ...prev,
                            [column.accessorKey]: !!value,
                          }))
                        }
                      >
                        {column.accessorKey.replace(/_/g, " ")}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="gray">
                  <IconSort /> Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[150px]">
                <DropdownMenuLabel>Sort Order</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={params.order || "desc"}
                  onValueChange={(value) =>
                    navigate({
                      search: { ...params, order: value },
                    })
                  }
                >
                  <DropdownMenuRadioItem value="asc">
                    Ascending
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="desc">
                    Descending
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" onClick={handleExport}>
              <IconExport /> Export
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <AppTable
          data={data ?? []}
          columns={columns}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
        />
      </div>
      {meta && (
        <div className="px-4 py-4 rounded-b-lg bg-custom-background-white">
          <AppPagination
            meta={meta}
            currentPage={meta?.current_page}
            totalPages={meta?.last_page}
            onClickPage={(val) =>
              navigate({
                search: { ...params, page: val },
              })
            }
            onClickPrev={(val) =>
              navigate({
                search: { ...params, page: val },
              })
            }
            onClickNext={(val) =>
              navigate({
                search: { ...params, page: val },
              })
            }
            onPerPageChange={(perPage) =>
              navigate({
                search: { ...params, page: 1, per_page: perPage },
              })
            }
          />
        </div>
      )}
      {/* Create / Update Dialog */}
      <Dialog
        open={form.type === "create" || form.type === "update"}
        onOpenChange={() => setForm(FORM_DATA)}
      >
        <DialogContent className="w-full max-w-xl lg:max-w-xl max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-4 rounded-t-lg bg-custom-modal-header-bg">
            <DialogTitle>{form.title}</DialogTitle>
            <DialogDescription>{form.description}</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-4">
            <FormUser
              open={form.type === "create" || form.type === "update"}
              onClose={() => setForm(FORM_DATA)}
              formData={
                form.type === "update" && form.id
                  ? data?.find((user) => String(user.id) === form.id)
                  : undefined
              }
              onSuccess={() => {
                setForm(FORM_DATA);
                refetch();
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
      {/* Delete Dialog */}
      <AlertDialog
        open={form.type === "delete"}
        onOpenChange={() => setForm(FORM_DATA)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className="capitalize min-w-24">
              Cancel
            </AlertDialogCancel>

            <Button
              variant="destructive"
              className="capitalize min-w-24 flex items-center gap-2"
              loading={isPendingDelete}
              onClick={() => {
                if (form.id) {
                  deleteUser(
                    { id: form.id },
                    {
                      onSuccess: () => {
                        setForm(FORM_DATA);
                        refetch();
                      },
                    }
                  );
                }
              }}
            >
              <Trash2 /> Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}