import type { ColumnDef } from "@tanstack/react-table";
import {  ArrowLeft, ArrowUpDown, ChevronRight, Eye } from "lucide-react";
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
import { Checkbox } from "../../../../components/ui/checkbox";
import type { TUserReportSchema } from "../-type/users-results";

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




interface UserProfileDetailProps {
  user: UserData;
  reports?: TUserReportSchema[];
  onEdit?: (userId: number) => void;
  onDelete?: (userId: number) => void;
}

export default function UserProfileDetail({
  user,
  reports = [], // Add default value
  onEdit,
  onDelete,
}: UserProfileDetailProps) {
  const navigate = useNavigate();
  const [viewReportOpen, setViewReportOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<TUserReportSchema | null>(null);


  // Columns for reports table - using TUserReportSchema structure from API
  const reportColumns: ColumnDef<TUserReportSchema>[] = [
    {
      id: "select",
      header: "SL",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
          <span className="font-medium">
            {row.index + 1}
          </span>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 80,
    },
    {
      id: "reportTitle",
      accessorFn: (row) => row.full_result?.insights?.title || row.free_result?.insights?.title || row.personality_type || "Personality Analysis",
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
      accessorKey: "created_at",
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
        const dateStr = row.getValue("created_at") as string;
        if (!dateStr) return <div>N/A</div>;
        const date = new Date(dateStr);
        return <div>{date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</div>;
      },
    },
    {
      accessorKey: "device_used",
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
      cell: ({ row }) => <div>{row.getValue("device_used") || "N/A"}</div>,
    },
    {
      id: "type",
      accessorFn: (row) => row.is_full_report ? "Full Report" : "Free Report",
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
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        const isFullReport = type === "Full Report";
        return (
          <Badge
            variant="default"
            className={cn(
              isFullReport
                ? "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-100"
                : "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100"
            )}
          >
            {type}
          </Badge>
        );
      },
    },
    {
      id: "status",
      accessorFn: (row) => (row.full_result || row.free_result) ? "Completed" : "Pending",
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
        const isCompleted = status === "Completed";
        return (
          <Badge
            variant="default"
            className={cn(
              isCompleted
                ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-100"
                : "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100"
            )}
          >
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full mr-1.5",
                isCompleted ? "bg-green-600" : "bg-yellow-600"
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
              {user?.name && typeof user.name === "string"
                ? user.name
                  .split(" ")
                  .filter(Boolean)
                  .map((n) => (n ? n.charAt(0) : ""))
                  .join("")
                  .toUpperCase()
                : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-muted-foreground text-2xl font-semibold">{user.name}</h3>
              {user.plan?.toLowerCase() === "pro" && (
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
            size="lg"
            variant="outline"
            onClick={() => onEdit?.(user.id)}
          >
            <IconUpdate />
            Edit
          </Button>
          <Button
            size="lg"
            variant="destructive"
            onClick={() => onDelete?.(user.id)}
          >
            <IconDelete />
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
                user.status?.toLowerCase() === "active"
                  ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-100"
                  : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100"
              )}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full mr-1.5",
                  user.status?.toLowerCase() === "active"
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
        report={selectedReport}
      />
    </div>
  );
}
