import { createFileRoute, useNavigate } from '@tanstack/react-router'
import type { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Eye,
  PenSquare,
  Trash2,
  Plus,
  Rows3,
  SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";
import type { TForm } from "../../../types/form";
import { FORM_DATA } from "../../../data/form";
import AppActionsDropdown from "../../../components/app-actions-dropdown";
import AppTable from "../../../components/app-table";
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
import { Badge } from "../../../components/ui/badge";
import { cn } from "../../../lib/utils";
import FormAdmin from './-components/form-admin';
import AppPagination from '../../../components/app-pagination';

export const Route = createFileRoute('/_app/settings/')({
  component: RouteComponent,
})

const DUMMY_DATA = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
    deviceUsed: "Desktop",
    plan: "Premium",
    testsTaken: 15,
    lastTestDate: "2024-03-15",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "user",
    deviceUsed: "Mobile",
    plan: "Basic",
    testsTaken: 8,
    lastTestDate: "2024-03-10",
    status: "Active",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    role: "manager",
    deviceUsed: "Tablet",
    plan: "Premium",
    testsTaken: 22,
    lastTestDate: "2024-03-18",
    status: "Inactive",
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    role: "admin",
    deviceUsed: "Desktop",
    plan: "Pro",
    testsTaken: 30,
    lastTestDate: "2024-03-20",
    status: "Active",
  },
  {
    id: 5,
    name: "David Brown",
    email: "david.brown@example.com",
    role: "user",
    deviceUsed: "Mobile",
    plan: "Basic",
    testsTaken: 5,
    lastTestDate: "2024-03-05",
    status: "Active",
  },
];

type ContentSection = 'articles' | 'testimonials' | 'reports' | 'static' | 'seo';

const ITEMS_PER_PAGE = 3;

function RouteComponent() {
  const [form, setForm] = useState<TForm>(FORM_DATA);
  const [activeSection, setActiveSection] = useState<ContentSection>('articles');
    const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const totalPages = Math.ceil(DUMMY_DATA.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = DUMMY_DATA.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const contentSections = [
    { id: 'articles' as ContentSection, label: 'Articles' },
    { id: 'testimonials' as ContentSection, label: 'Testimonials' },
    { id: 'reports' as ContentSection, label: 'Reports Pages' },
    { id: 'static' as ContentSection, label: 'Static Pages' },
    { id: 'seo' as ContentSection, label: 'SEO Metadata' },
  ];

  const columns: ColumnDef<any>[] = [
    {
      id: "select",
      accessorKey: "id",
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
          <span className="font-medium">ID</span>
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
          <span>{row.original.id}</span>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("name")}</div>
      ),
    },
    { header: "Email", accessorKey: "email" },
    { header: "Role", accessorKey: "role" },
    { header: "Date", accessorKey: "lastTestDate" },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge
            variant={status === "Active" ? "default" : "secondary"}
            className={cn(
              status === "Active"
                ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-100"
                : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100"
            )}
          >
             <span
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                status === "Active" ? "bg-green-600" : "bg-gray-600"
              )}
            />
            {status}
          </Badge>
        );
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
                icon: PenSquare,
                props: {
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
                  variant: "destructive",
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
      case 'articles':
        return <AppTable data={DUMMY_DATA} columns={columns} />;
      case 'testimonials':
        return <div className="p-8 text-center text-gray-500">Testimonials content goes here</div>;
      case 'reports':
        return <div className="p-8 text-center text-gray-500">Reports Pages content goes here</div>;
      case 'static':
        return <div className="p-8 text-center text-gray-500">Static Pages content goes here</div>;
      case 'seo':
        return <div className="p-8 text-center text-gray-500">SEO Metadata content goes here</div>;
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
                onClick={() => setActiveSection(section.id)}
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
          <h2 className="text-xl font-semibold mb-4 capitalize">{activeSection}</h2>
          <div className="flex justify-between mb-4">
            <SearchBar />
            <div className="flex gap-2">
              <Button variant="outline">
                <Rows3 /> Columns
              </Button>
              <Button variant="outline">
                <Eye /> View
              </Button>
              <Button variant="outline">
                <IconSort /> Sort
              </Button>
              <Button variant="outline">
                <SlidersHorizontal /> Filters
              </Button>
              <Button variant="outline">
                <IconExport /> Export
              </Button>
            </div>
          </div>
        </div>

        {/* Dynamic Content */}
      </div>
    
      {/* Data Info & Pagination */}
            <AppTable data={paginatedData} columns={columns} />
      <div className="flex items-end justify-between px-4">
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, DUMMY_DATA.length)} of {DUMMY_DATA.length} users
        </div>
        <AppPagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginationItemsToDisplay={5}
          onClickPage={(page) => setCurrentPage(page)}
          onClickPrev={(page) => setCurrentPage(Math.max(page - 1, 1))}
          onClickNext={(page) => setCurrentPage(Math.min(page + 1, totalPages))}
        />
      </div>

      {/* Read Dialog */}
      <Dialog
        open={form.type === "read"}
        onOpenChange={() => setForm(FORM_DATA)}
      >
        <DialogContent className="w-full max-w-lg">
          <DialogHeader>
            <DialogTitle>{form.title}</DialogTitle>
            <DialogDescription>{form.description}</DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-gray-100 rounded-md">
            <p>Viewing user data for ID: {form.id}</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create/Update Sheet */}
      <FormAdmin
        open={form.type === "create" || form.type === "update"}
        onClose={() => setForm(FORM_DATA)}
        formData={
          form.type === "update"
            ? DUMMY_DATA.find((user) => user.id === form.id)
            : undefined
        }
        onSuccess={() => {
          console.log("User saved successfully");
          setForm(FORM_DATA);
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
              Are you sure you want to delete this user? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel className="capitalize min-w-24">
              Cancel
            </AlertDialogCancel>
            <Button
              variant="destructive"
              className="capitalize min-w-24 flex items-center gap-2"
              onClick={() => {
                console.log("Deleting user:", form.id);
                setForm(FORM_DATA);
              }}
            >
              <Trash2 /> Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}