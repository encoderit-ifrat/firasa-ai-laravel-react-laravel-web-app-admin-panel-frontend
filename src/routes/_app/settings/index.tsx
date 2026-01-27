import { createFileRoute } from '@tanstack/react-router'
import type { ColumnDef } from "@tanstack/react-table";
import {
  Eye,
  Trash2,
  Plus,
  Rows3,
  SlidersHorizontal,
  ChevronsUpDown,
  ArrowDown,
} from "lucide-react";
import { useState } from "react";
import type { TForm } from "../../../types/form";
import { FORM_DATA } from "../../../data/form";
import AppActionsDropdown from "../../../components/app-actions-dropdown";
import AppTable from "../../../components/app-table";
import AppPagination from '../../../components/app-pagination';
import { Button } from "../../../components/ui/button";
import SearchBar from "../../../components/ui/search-bar";
import IconSort from "../../../components/svg-icon/icon-sort";
import IconExport from "../../../components/svg-icon/icon-export";
import { Checkbox } from "../../../components/ui/checkbox";
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
import { cn } from "../../../lib/utils";
import FormAdmin from './-components/form-admin';
import IconUpdate from '../../../components/svg-icon/icon-update';
import CardAdmin from './-components/card-admin';
import { useGetAllUsers } from './-api/queries/use-get-all-users';
import type { TAdminSchema } from './-type/admin';
import { useDeleteUser } from './-api/mutations/use-delete-user';
import { SearchSchema } from '../../../types/search';
import { useDebounce } from '../../../hooks/search-hooks';

export const Route = createFileRoute('/_app/settings/')({
  component: RouteComponent,
  validateSearch: SearchSchema,
})

type ContentSection = 'admin-management' | 'api-keys-management' | 'language-management';

function RouteComponent() {
  const [form, setForm] = useState<TForm>(FORM_DATA);
  const [activeSection, setActiveSection] = useState<ContentSection>('admin-management');
  const params = Route.useSearch();
  const navigate = Route.useNavigate();

  // Search state with debouncing
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500); // 500ms delay

  const contentSections = [
    { id: 'admin-management' as ContentSection, label: 'Admin Management' },
    { id: 'api-keys-management' as ContentSection, label: 'API Keys Management' },
    { id: 'language-management' as ContentSection, label: 'Language Management' },
  ];

  // Pass debouncedSearch along with params from URL
  const { data: users, isLoading: isLoading, refetch } = useGetAllUsers({
    params: {
      ...params, // This includes page and per_page from URL
      page: debouncedSearch ? -1 : params?.page,
      search: debouncedSearch, // Use debounced search here
      order: "desc",
      order_by: "id",
    },
    options: {
      enabled: activeSection === "admin-management",
    },
  });

  console.log("🚀 ~ RouteComponent ~ users:", users);

  const { data, meta } = users ?? {};

  const { mutate: deleteUser, isPending: isPendingDelete } = useDeleteUser();

  const columns: ColumnDef<TAdminSchema>[] = [
    // {
    //   id: "select",
    //   accessorKey: "id",
    //   header: ({ table }) => (
    //     <div className="flex items-center gap-3">
    //       <Checkbox
    //         checked={
    //           table.getIsAllPageRowsSelected() ||
    //           (table.getIsSomePageRowsSelected() && "indeterminate")
    //         }
    //         onCheckedChange={(value) =>
    //           table.toggleAllPageRowsSelected(!!value)
    //         }
    //         aria-label="Select all"
    //       />
    //       <div className="flex items-center gap-1">
    //         <span className="font-medium">ID</span>
    //         <ArrowDown className="h-4 w-4 text-muted-foreground" />
    //       </div>
    //     </div>
    //   ),
    //   cell: ({ row }) => (
    //     <div className="flex items-center gap-3">
    //       <Checkbox
    //         checked={row.getIsSelected()}
    //         onCheckedChange={(value) => row.toggleSelected(!!value)}
    //         aria-label="Select row"
    //       />
    //       <span>{row.original.id}</span>
    //     </div>
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },
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
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("name")}</div>
      ),
    },
    {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1"
        >
          Email
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      ),
      accessorKey: "email",
    },
    {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1"
        >
          Created At
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      ),
      accessorKey: "created_at",
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        return <div>{date.toLocaleDateString()}</div>;
      },
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
                  variant: "update",
                  onClick: () =>
                    setForm({
                      type: "read",
                      title: "View User Result",
                      description: "",
                      id: data.id,
                    }),
                },
              },
              {
                type: "update",
                name: "edit",
                icon: IconUpdate,
                props: {
                  variant: "update",
                  onClick: () =>
                    setForm({
                      type: "update",
                      title: "Update User Result",
                      description: "",
                      id: data.id,
                    }),
                },
              },
              {
                type: "delete",
                name: "delete",
                icon: Trash2,
                props: {
                  variant: "delete",
                  onClick: () =>
                    setForm({
                      type: "delete",
                      title: "",
                      description: "",
                      id: data.id,
                    }),
                },
              },
            ]}
          />
        );
      },
    },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'admin-management':
        return isLoading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : (
          <AppTable data={data ?? []} columns={columns} />
        );
      case 'api-keys-management':
        return <div className="p-8 text-center text-gray-500">API Keys Management content goes here</div>;
      case 'language-management':
        return <div className="p-8 text-center text-gray-500">Language Management content goes here</div>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="px-4">
        <div className="flex justify-between mb-6 mt-6">
          <h1 className="text-primary text-3xl font-bold leading-12">Settings</h1>
          <Button
            size="icon-lg"
            variant="customGradient"
            onClick={() =>
              setForm({
                type: "create",
                title: "Add New Admin",
                description: "",
              })
            }
          >
            <Plus /> Add New Admin
          </Button>
        </div>

        {/* Navigation Buttons */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-1">
            {contentSections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  // Reset to page 1 when changing sections
                  navigate({
                    search: (prev) => ({ ...prev, page: 1 }),
                  });
                }}
                className={cn(
                  "px-4 py-2.5 text-sm font-medium transition-colors relative",
                  "hover:text-gray-900",
                  activeSection === section.id
                    ? "text-gradient"
                    : "text-gray-600"
                )}
              >
                {section.label}
                {activeSection === section.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient" />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-4 capitalize text-primary">{activeSection.replace(/-/g, ' ')}</h2>
          <div className="flex justify-between mb-4">
            <SearchBar variant="bordered" searchValue={search} onSearchChange={setSearch} />
            <div className="flex gap-2">
              <Button variant="gray">
                <Rows3 /> Columns
              </Button>
              <Button variant="gray">
                <Eye /> View
              </Button>
              <Button variant="gray">
                <IconSort /> Sort
              </Button>
              <Button variant="gray">
                <SlidersHorizontal /> Filters
              </Button>
              <Button variant="gray">
                <IconExport /> Export
              </Button>
            </div>
          </div>
        </div>

        {/* Dynamic Content */}
        {renderContent()}
      </div>

      {/* Data Info & Pagination */}
      {activeSection === 'admin-management' && !isLoading && meta && (
        <div className="flex items-center justify-between px-4">
          <AppPagination
            meta={meta}
            currentPage={meta.current_page}
            totalPages={meta.last_page}
            onClickPage={(page) =>
              navigate({
                search: { ...params, page },
              })
            }
            onClickPrev={(page) =>
              navigate({
                search: { ...params, page: page - 1 },
              })
            }
            onClickNext={(page) =>
              navigate({
                search: { ...params, page: page + 1 },
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

      {/* Read Dialog */}
      <Dialog
        open={form.type === "read"}
        onOpenChange={() => setForm(FORM_DATA)}
      >
        <DialogContent className="w-full lg:max-w-2xl max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-4 rounded-t-lg bg-custom-modal-header-bg">
            <DialogTitle>{form.title}</DialogTitle>
            <DialogDescription>{form.description}</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-4 min-h-0">
            {form.id ? (
              <CardAdmin form_data={{ type: "read", id: form.id }} />
            ) : (
              <p className="text-muted-foreground">Admin data not found.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Create/Update Sheet */}
      <FormAdmin
        open={form.type === "create" || form.type === "update"}
        onClose={() => setForm(FORM_DATA)}
        formData={
          form.type === "update"
            ? data?.find((user) => user.id === form.id)
            : undefined
        }
        onSuccess={() => {
          console.log("User saved successfully");
          setForm(FORM_DATA);
          refetch();
        }}
      />

      {/* Delete Alert */}
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
              Are you sure you want to delete this user? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel className="capitalize min-w-24">
              Cancel
            </AlertDialogCancel>
            <Button
              variant="destructive"
              className="capitalize min-w-24 flex items-center gap-2"
              loading={isPendingDelete}
              onClick={() =>
                deleteUser(
                  { id: form.id! },
                  {
                    onSuccess: () => {
                      setForm(FORM_DATA);
                      refetch();
                    },
                  }
                )
              }
            >
              <Trash2 /> Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}