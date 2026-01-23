import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ArrowDown,
  ChevronsUpDown,
  Eye,
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
import { Badge } from "../../../components/ui/badge";
import { cn } from "../../../lib/utils";
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
import IconDelete from "../../../components/svg-icon/icon-delete";
import AppPagination from "../../../components/app-pagination";
import IconUpdate from "../../../components/svg-icon/icon-update";

export const Route = createFileRoute("/_app/users-results/")({
  component: RouteComponent,
});

type UserData = {
  id: number;
  name: string;
  email: string;
  gender: string;
  datetime: string;
  deviceUsed: string;
  plan: string;
  testsTaken: number;
  lastTestDate: string;
  status: string;
  joinDate?: string;
  lastActive?: string;
  avatar?: string;
};

const DUMMY_DATA: UserData[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    gender: "male",
    datetime: "2024-03-15T10:30",
    deviceUsed: "Desktop",
    plan: "Premium",
    testsTaken: 15,
    lastTestDate: "2024-03-15",
    status: "Active",
    joinDate: "2024-01-15",
    lastActive: "2024-03-15",
    avatar: "/image/profilePhoto.png",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    gender: "female",
    datetime: "2024-03-10T14:20",
    deviceUsed: "Mobile",
    plan: "Unavailable",
    testsTaken: 8,
    lastTestDate: "2024-03-10",
    status: "Unavailable",
    joinDate: "2024-02-10",
    lastActive: "2024-03-10",
    avatar: "/image/profilePhoto.png",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    gender: "male",
    datetime: "2024-03-18T09:15",
    deviceUsed: "Tablet",
    plan: "Premium",
    testsTaken: 22,
    lastTestDate: "2024-03-18",
    status: "Suspended",
    joinDate: "2023-12-18",
    lastActive: "2024-02-18",
    avatar: "/image/profilePhoto.png",
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    gender: "female",
    datetime: "2024-03-20T16:45",
    deviceUsed: "Desktop",
    plan: "Pro",
    testsTaken: 30,
    lastTestDate: "2024-03-20",
    status: "Active",
    joinDate: "2023-11-20",
    lastActive: "2024-03-20",
    avatar: "/image/profilePhoto.png",
  },
  {
    id: 5,
    name: "David Brown",
    email: "david.brown@example.com",
    gender: "male",
    datetime: "2024-03-05T11:00",
    deviceUsed: "Mobile",
    plan: "Basic",
    testsTaken: 5,
    lastTestDate: "2024-03-05",
    status: "Active",
    joinDate: "2024-02-05",
    lastActive: "2024-03-05",
    avatar: "/image/profilePhoto.png",
  },
];

const ITEMS_PER_PAGE = 4;

function RouteComponent() {
  const [form, setForm] = useState<TForm>(FORM_DATA);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const totalPages = Math.ceil(DUMMY_DATA.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = DUMMY_DATA.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const statusVariantMap = {
    Active: "active",
    Suspended: "suspended",
    Unavailable: "unavailable",
  } as const;



  const columns: ColumnDef<UserData>[] = [
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
          <div className="flex items-center gap-1">
            <span className="font-medium">ID</span>
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
          Device Used
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      ),
      accessorKey: "deviceUsed",
    },
    {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
          Pro: "bg-gradient text-[#585051]",
        };

        return (
          <Badge
            variant="outline"
            className={cn(planColors[plan as keyof typeof planColors])}
          >
            {plan}
          </Badge>
        );
      },
    },
    {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1"
        >
          Tests Taken
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      ),
      accessorKey: "testsTaken",
    },
    {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1"
        >
          Last Test Date
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      ),
      accessorKey: "lastTestDate",
    },
    {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1"
        >
          Status
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      ),
      accessorKey: "status",
      cell: ({ row }) => {
        const status = row.getValue("status") as keyof typeof statusVariantMap;

        return (
          <Badge variant={statusVariantMap[status]}>
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                status === "Active" && "bg-[#34C759]",
                status === "Suspended" && "bg-[#FF9500]",
                status === "Unavailable" && "bg-[#FF3B30]"
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
                  variant: "update",
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
                icon: IconDelete,
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
              }
            ]}
          />
        );
      },
    },
  ];

  return (
    <div className="space-y-4 p-4">
      <div className="px-4">
        <div className="flex justify-between mb-6 mt-6">
          <h1 className="text-primary text-3xl font-bold leading-12">Users & Results</h1>
          <Button
            variant="customGradient"
            onClick={() =>
              setForm({
                type: "create",
                title: "Add New User",
                description: "",
              })
            }
          >
            <Plus /> Add New User
          </Button>
        </div>
        <div className="flex justify-between mb-4">
          <SearchBar
            searchPlaceholder="Search..."
            variant="default"
          />
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
            <Button variant="outline" >
              <IconExport /> Export
            </Button>
          </div>
        </div>
      </div>

      <AppTable data={paginatedData} columns={columns} />
      <div className="flex items-end justify-between px-4">
        {/* <div className="text-sm text-gray-600">
          Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, DUMMY_DATA.length)} of {DUMMY_DATA.length} users
        </div> */}
        <AppPagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginationItemsToDisplay={5}
          onClickPage={(page) => setCurrentPage(page)}
          onClickPrev={(page) => setCurrentPage(Math.max(page - 1, 1))}
          onClickNext={(page) => setCurrentPage(Math.min(page + 1, totalPages))}
        />
      </div>

      {/* Create/Update Sheet */}
      <FormUser
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
              <IconDelete /> Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}