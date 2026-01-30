import { useState, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Bell, AlertCircle, LogIn, LogOut, CheckCircle2, Loader2, UserCheck, AlertTriangle, Trash2 } from "lucide-react";
import type { Channel } from "pusher-js";
import { useQueryClient } from "@tanstack/react-query";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { usePusherContext } from "../context/PusherContext";
import { useGetAllNotifications, type NotificationResponse } from "../queries/use-get-all-notifications";
import { useMarkNotificationAsRead } from "../queries/mutations/use-mark-notification-as-read";


const getIconByType = (type: string) => {
  switch (type) {
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

const getTypeLabel = (type: string): string => {
  const labels: { [key: string]: string } = {
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

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
};

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [newNotificationsCount, setNewNotificationsCount] = useState(0);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { pusher, isConnected } = usePusherContext();
  const { data: notificationResponse, isLoading, refetch } = useGetAllNotifications({
    params: { page: 1, per_page: 5, search: "", order_by: "created_at", order: "desc" },
    options: { enabled: true },
  });
  const markAsReadMutation = useMarkNotificationAsRead();
  const channelRef = useRef<Channel | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const notifications = notificationResponse?.data?.notifications?.data ?? [];
  const unreadCount = notificationResponse?.data?.unread_count ?? 0;

  // Initialize audio for notifications
  useEffect(() => {
    audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
  }, []);

  // Set up Pusher listener for new notifications
  useEffect(() => {
    if (!isConnected || !pusher) return;

    const userStr = localStorage.getItem("user");
    const currentUser = userStr ? JSON.parse(userStr) : null;

    if (!currentUser?.id) return;

    const channelName = `private-notification.user.${currentUser.id}`;

    // Subscribe to private notification channel
    const channel = pusher.subscribe(channelName);
    channelRef.current = channel;

    // Listen for new notifications
    const handleNewNotification = (data: any) => {
      console.log("🚀 ~ New notification received via Pusher:", data);

      // Play notification sound
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      }

      // Increment new notifications count (badge)
      setNewNotificationsCount((prev) => prev + 1);

      // Update the react-query cache immediately with the new notification
      queryClient.setQueriesData<NotificationResponse>({ queryKey: ["notifications"] }, (oldData) => {
        if (!oldData) return oldData;

        // Clone the data to avoid mutation
        const newData = JSON.parse(JSON.stringify(oldData)) as NotificationResponse;

        // Add new notification to the beginning of the list
        const newNotification = {
          id: data.id || Math.random().toString(36).substring(2, 11),
          type: data.type || "notification",
          data: data,
          read_at: null,
          created_at: new Date().toISOString()
        };

        newData.data.notifications.data.unshift(newNotification);

        // Trim to per_page if necessary
        const perPage = newData.data.notifications.meta?.per_page || 10;
        if (newData.data.notifications.data.length > perPage) {
          newData.data.notifications.data.pop();
        }

        newData.data.unread_count = (newData.data.unread_count || 0) + 1;
        newData.data.total = (newData.data.total || 0) + 1;

        console.log("🚀 ~ Updated Notification Cache:", newData);
        return newData;
      });
    };

    channel.bind("notification.user", handleNewNotification);

    return () => {
      channel.unbind("notification.user", handleNewNotification);
      pusher.unsubscribe(channelName);
      channelRef.current = null;
    };
  }, [isConnected, pusher, queryClient]);

  const handleRefresh = async () => {
    // Refetch notifications and reset count
    await refetch();
    setNewNotificationsCount(0);
  };

  const handleNotificationClick = (id: string) => {
    const notification = notifications.find((n) => n.id === id);
    // Only mark as read if it's not already read
    if (notification && !notification.read_at) {
      markAsReadMutation.mutate(id);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs rounded-full pulse-animation"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-[420px] p-0 rounded-lg" align="end" sideOffset={8}>
        <div className="flex flex-col h-full max-h-[500px] mb-12 overflow-y-auto bg-background">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-base">Notifications</h3>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {unreadCount} new
                </Badge>
              )}
              {newNotificationsCount > 0 && (
                <Badge variant="destructive" className="text-xs animate-pulse">
                  {newNotificationsCount} received
                </Badge>
              )}
            </div>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-1 hover:bg-accent rounded-md transition-colors"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span className="text-xs text-muted-foreground">↻</span>
              )}
            </button>
          </div>

          {/* Notifications List */}
          {notifications.length > 0 ? (
            <ScrollArea className="flex-1">
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id)}
                    className={`p-4 hover:bg-accent/50 cursor-pointer transition-colors border-l-4 ${notification.read_at
                      ? "border-l-transparent opacity-60 cursor-default hover:bg-transparent"
                      : "border-l-red-500"
                      }`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getIconByType(notification.data.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="font-medium text-sm leading-tight">
                              {notification.data.message}
                            </p>
                            {notification.data.data?.service?.company_name && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {notification.data.data.service.company_name}
                              </p>
                            )}
                          </div>
                          <Badge variant="outline" className="text-xs flex-shrink-0">
                            {getTypeLabel(notification.data.type)}
                          </Badge>
                        </div>

                        <p className="text-xs text-muted-foreground mt-2">
                          {formatTime(notification.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Bell className="w-12 h-12 text-muted-foreground/30 mb-2" />
              <p className="text-sm font-medium text-muted-foreground">
                {isLoading ? "Loading notifications..." : "No notifications yet"}
              </p>
            </div>
          )}

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-1 border-t bg-muted/30 fixed bottom-0 w-full bg-white">
              <Button
                variant="ghost"
                className="w-full text-xs justify-center"
                onClick={() => {
                  navigate({ to: "/", search: { page: 1, per_page: 10 } as any });
                  setIsOpen(false);
                }}
              >
                View all notifications
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

