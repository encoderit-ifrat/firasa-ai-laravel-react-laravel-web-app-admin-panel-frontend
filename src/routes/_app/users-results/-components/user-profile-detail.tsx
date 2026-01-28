import type { ColumnDef } from "@tanstack/react-table";
import { ArrowLeft, ArrowUpDown, ChevronRight, Eye } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import AppTable from "../../../../components/app-table";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { cn } from "../../../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import IconDelete from "../../../../components/svg-icon/icon-delete";
import IconUpdate from "../../../../components/svg-icon/icon-update";
import ViewReportModal from "./view-report-modal";
import { useState } from "react";

type UserData = {
  id: number;
  name: string;
  email: string;
  gender?: string;
  datetime?: string;
  deviceUsed: string;
  plan: string;
  testsTaken: number;
  lastTestDate: string | null;
  status: string;
  joinDate?: string;
  lastActive?: string;
  avatar?: string;
};

type ReportData = {
  id: string | number;
  reportTitle: string;
  dateTaken: string;
  deviceUsed: string;
  type: string;
  status: string;
};

interface UserProfileDetailProps {
  user: UserData;
  reports?: ReportData[];
  onEdit?: (userId: number) => void;
  onDelete?: (userId: number) => void;
}

export default function UserProfileDetail({
  user,
  reports,
  onEdit,
  onDelete,
}: UserProfileDetailProps) {
  const navigate = useNavigate();
  const [viewReportOpen, setViewReportOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);

  // Columns for reports table - using ReportData structure from API
  const reportColumns: ColumnDef<ReportData>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("id")}</div>,
    },
    {
      accessorKey: "reportTitle",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          Report Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("reportTitle")}</div>,
    },
    {
      accessorKey: "dateTaken",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          Date Taken
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = row.getValue("dateTaken") as string;
        return <div>{date || "N/A"}</div>;
      },
    },
    {
      accessorKey: "deviceUsed",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          Device Used
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("deviceUsed") || "N/A"}</div>,
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("type") || "N/A"}</div>,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const isCompleted = status?.toLowerCase() === "completed";
        return (
          <Badge
            variant="default"
            className={cn(
              isCompleted
                ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-100"
                : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100"
            )}
          >
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full mr-1.5",
                isCompleted ? "bg-green-600" : "bg-gray-600"
              )}
            />
            {status || "N/A"}
          </Badge>
        );
      },
    },
    {
      header: "Actions",
      accessorKey: "action",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="update"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              setSelectedReport(row.original);
              setViewReportOpen(true);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="update"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              // Handle edit action
            }}
          >
            <IconUpdate className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-4">
      {/* Breadcrumbs and Back Button */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: "/users-results" })}
          className="h-10 w-10 bg-white rounded-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex flex-col gap-1">
          <div className="flex items-center text-sm text-muted-foreground">
            Users <ChevronRight className="mx-1 h-3 w-3" /> View Details
          </div>
          <h2 className="text-primary text-2xl font-bold">Users Profile</h2>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="flex items-start justify-between gap-4 pb-6 border-b">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-lg">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-primary text-2xl font-semibold">{user.name}</h3>
              {user.plan === "Pro" && (
                <Badge className="bg-gradient text-black border-0">
                  Pro
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => onEdit?.(user.id)}
          >
            <IconUpdate className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => onDelete?.(user.id)}
          >
            <IconDelete className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Statistics Card */}
      <div className="bg-white rounded-lg border p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Tests Taken
            </p>
            <p className="text-primary text-2xl font-semibold">{user.testsTaken}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Join Date
            </p>
            <p className="text-primary text-2xl font-semibold">{user.joinDate || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Last Active
            </p>
            <p className="text-primary text-2xl font-semibold">{user.lastActive || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Status
            </p>
            <Badge
              variant="default"
              className={cn(
                user.status === "Active"
                  ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-100"
                  : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100"
              )}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full mr-1.5",
                  user.status === "Active"
                    ? "bg-green-600"
                    : "bg-gray-600"
                )}
              />
              {user.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Personality Test Results Table */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Personality Test Results</h3>
        <AppTable
          data={reports || []}
          columns={reportColumns}
        />
      </div>
      <ViewReportModal
        open={viewReportOpen}
        onOpenChange={setViewReportOpen}
        user={{ name: user.name, avatar: user.avatar }}
      />
    </div>
  );
}
