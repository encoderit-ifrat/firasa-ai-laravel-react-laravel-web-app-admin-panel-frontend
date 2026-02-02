import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";


import {
  Bell,
  AlertCircle,
  LogIn,
  LogOut,
  CheckCircle2,
  UserCheck,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import { SearchSchema, type TSearchSchema } from "../../../types/search";
import { useDebounce } from "../../../hooks/search-hooks";
import { useGetAllNotifications, type NotificationData } from "../../../queries/use-get-all-notifications";
import { useMarkNotificationAsRead } from "../../../queries/mutations/use-mark-notification-as-read";
import { Badge } from "../../../components/ui/badge";
import { formatDateTime } from "../../../lib/date-utils";
import Loading from "../../../components/base/loading";
import SearchBar from "../../../components/ui/search-bar";
import AppTable from "../../../components/app-table";
import AppPagination from "../../../components/app-pagination";
import { useMarkAllNotificationsAsRead } from "../../../queries/mutations/use-mark-all-notifications-as-read";


export const Route = createFileRoute("/_app/notifications/")({
  component: RouteComponent,
  validateSearch: SearchSchema,
});

const getShortType = (type: string) => {
  return type.split("\\").pop() || type;
};

const getIconByType = (rawType: string) => {
  const type = getShortType(rawType);
  switch (type) {
    case "UserRegisteredNotification":
      return <UserCheck className="w-4 h-4 text-indigo-500" />;
    case "incident_created":
      return <AlertCircle className="w-4 h-4 text-gray-500" />;
    case "incident_updated":
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    case "incident_deleted":
      return <Trash2 className="w-4 h-4 text-red-500" />;
    case "check_in":
      return <LogIn className="w-4 h-4 text-green-500" />;
    case "check_out":
      return <LogOut className="w-4 h-4 text-orange-500" />;
    case "officer_approval":
      return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
    case "officer_assigned":
      return <UserCheck className="w-4 h-4 text-indigo-500" />;
    default:
      return <Bell className="w-4 h-4 text-gray-500" />;
  }
};

const getTypeLabel = (rawType: string): string => {
  const type = getShortType(rawType);
  const labels: { [key: string]: string } = {
    UserRegisteredNotification: "New User",
    incident_created: "Incident Created",
    incident_updated: "Incident Updated",
    incident_deleted: "Incident Deleted",
    check_in: "Check In",
    check_out: "Check Out",
    officer_approval: "Approval",
    officer_assigned: "Assignment",
  };
  return labels[type] || "Notification";
};

const getTypeColor = (
  rawType: string
): "default" | "secondary" | "destructive" | "outline" => {
  const type = getShortType(rawType);
  switch (type) {
    case "UserRegisteredNotification":
      return "outline";
    default:
      return "outline";
  }
};

function RouteComponent() {
  const params = Route.useSearch() as TSearchSchema;
  const [search, setSearch] = useState("");
  const navigate = Route.useNavigate();
  // track loading state per-notification id so only the clicked button shows loading
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  // Search state with debouncing
  const debouncedSearch = useDebounce(search, 500); // 500ms delay

  const { data: notificationResponse, isPending: isLoading } =
    useGetAllNotifications({
      params: { ...params, search: debouncedSearch },
      options: { enabled: true },
    });

  const markAsReadMutation = useMarkNotificationAsRead();
  console.log("markAsReadMutation", markAsReadMutation);

  const markAllAsReadMutation = useMarkAllNotificationsAsRead();
  console.log("markAllAsReadMutation", markAllAsReadMutation);

  const notifications: any[] = Array.isArray(notificationResponse?.data)
    ? notificationResponse.data
    : (notificationResponse?.data as any)?.data ?? [];

  const meta = notificationResponse?.meta || (notificationResponse?.data as any)?.meta;

  const handleMarkAsRead = (id: string) => {
    const notification = notifications.find((n) => n.id === id);
    if (notification && !notification.read_at && !notification.is_read && !loadingIds.has(id)) {
      // mark this notification id as loading
      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });

      markAsReadMutation.mutate(id, {
        onSuccess: () => {
          // remove loading state for this id when mutation succeeds
          setLoadingIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        },
        onError: () => {
          // remove loading state for this id when mutation fails
          setLoadingIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        },
      });
    }
  };

  const columns: ColumnDef<NotificationData>[] = [
    {
      id: "sl",
      header: "SL",
      cell: ({ row }) => (
        <div className="font-medium">
          {(params.page - 1) * params.per_page + (row.index + 1)}
        </div>
      ),
      size: 60,
    },
    {
      header: "Type",
      accessorKey: "type",
      cell: ({ row }) => {
        const type = row.original.type;
        return (
          <div className="flex items-center gap-2">
            {getIconByType(type)}
            <Badge variant={getTypeColor(type)}>
              {getTypeLabel(type)}
            </Badge>
          </div>
        );
      },
      size: 180,
    },
    {
      header: "Message",
      accessorKey: "message",
      cell: ({ row }) => {
        const message = row.original.data?.message || row.original.message;
        const title = row.original.data?.title || row.original.title;
        return (
          <div className="flex flex-col gap-1">
            {title && <p className="font-semibold text-xs text-primary/80 uppercase tracking-wider">{title}</p>}
            <p className="font-medium text-foreground">{message}</p>
          </div>
        );
      },
      size: 300,
    },
    {
      header: "Date",
      accessorKey: "created_at",
      cell: ({ row }) => {
        const formatted = formatDateTime(row.original.created_at);
        return formatted ? (
          <div className="text-sm text-foreground flex flex-col">
            <span>{formatted.dateStr}</span>
            <span className="text-xs text-muted-foreground">{formatted.timeStr}</span>
          </div>
        ) : null;
      },
      size: 180,
    },
    {
      header: "Status",
      accessorKey: "is_read",
      cell: ({ row }) => {
        const isRead = row.original.read_at || row.original.is_read;
        const variant: "default" | "secondary" | "destructive" | "outline" =
          isRead ? "secondary" : "destructive";
        return (
          <Badge
            variant={variant}
            className="text-xs"
          >
            {isRead ? "Read" : "Unread"}
          </Badge>
        );
      },
      size: 100,
    },
    {
      header: "Action",
      accessorKey: "action",
      cell: ({ row }) => {
        const id = row.original.id;
        const isLoadingForRow = loadingIds.has(id);
        const isRead = row.original.read_at || row.original.is_read;
        return (
          <button
            onClick={() => handleMarkAsRead(id)}
            disabled={!!isRead || isLoadingForRow}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${isRead
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-blue-100 text-blue-600 hover:bg-blue-200"
              }`}
          >
            {isLoadingForRow ? "Marking..." : "Mark as Read"}
          </button>
        );
      },
      size: 140,
    },
  ];

  if (isLoading && !notifications.length) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage all your notifications
          </p>
        </div>
        <div>

        </div>
      </div>

      {/* Search Bar */}
      <SearchBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search notifications..."
      />

      {/* Table */}
      <div className="rounded-lg overflow-hidden border">
        {notifications.length > 0 ? (
          <>
            <AppTable data={notifications as any} columns={columns} />
            {/* Pagination */}
            {meta && (
              <div className="p-4 border-t bg-white">
                <AppPagination
                  meta={meta}
                  currentPage={meta?.current_page || 1}
                  totalPages={meta?.last_page || 1}
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
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-white">
            <Bell className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              No notifications yet
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              You're all caught up!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RouteComponent;

