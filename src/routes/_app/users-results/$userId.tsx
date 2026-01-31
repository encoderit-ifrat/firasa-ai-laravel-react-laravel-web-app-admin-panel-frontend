import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import type { TForm } from "../../../types/form";
import { FORM_DATA } from "../../../data/form";
import UserProfileDetail from "./-components/user-profile-detail";
import FormUser from "./-components/form-user";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "../../../components/ui/alert-dialog";
import { Button } from "../../../components/ui/button";
import IconDelete from "../../../components/svg-icon/icon-delete";
import { useGetUser } from "../settings/-api/queries/use-get-user";
import { useGetUserReports } from "./-api/queries/use-get-user-reports";
import Loading from "../../../components/base/loading";
import { useDeleteUser } from "../settings/-api/mutations/use-delete-user";

export const Route = createFileRoute("/_app/users-results/$userId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { userId } = Route.useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<TForm>(FORM_DATA);

  const userIdNumber = parseInt(userId, 10);

  // Fetch single user data
  const {
    data: userData,
    isLoading: isLoadingUser,
    refetch: refetchUser
  } = useGetUser({
    id: userIdNumber,
    options: {
      enabled: !isNaN(userIdNumber),
    },
  });

  // Delete user mutation
  const { mutate: deleteUser, isPending: isPendingDelete } = useDeleteUser();

  // Fetch user reports
  const {
    data: reportsResponse,
    isLoading: isLoadingReports
  } = useGetUserReports({
    userId: userIdNumber,
    params: {
      page: 1,
      per_page: 10,
      search: "",
      order_by: "id",
      order: "desc",
    },
    options: {
      enabled: !isNaN(userIdNumber),
    },
  });

  // CRITICAL: Extract the reports array from the response
  // reportsResponse is { data: [...], meta: {...} }
  // We need to access reportsResponse.data to get the array
  const reports = reportsResponse?.data || [];

  // Show loading state
  if (isLoadingUser || isLoadingReports) {
    return <Loading />;
  }

  // Handle user not found
  if (!userData) {
    return (
      <div className="p-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
          <p className="text-muted-foreground">
            The user you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    if (form.id) {
      deleteUser(
        { id: form.id },
        {
          onSuccess: () => {
            setForm(FORM_DATA);
            navigate({ to: "/users-results" });
          },
        }
      );
    }
  };

  // Transform API data to match component expectations
  const rawUser = userData as Record<string, any>;
  const user = {
    id: typeof rawUser.id === 'number' ? rawUser.id : Number(rawUser.id) || 0,
    name: rawUser.name || "Unknown User",
    email: rawUser.email || "N/A",
    plan: rawUser.plan || "Free",
    testsTaken: Number(rawUser.analysis_taken_count) || 0,
    lastTestDate: rawUser.last_analysis_date || null,
    status: rawUser.status || "Active",
    deviceUsed: rawUser.last_device_used || "N/A",
    joinDate: rawUser.created_at
      ? new Date(rawUser.created_at).toLocaleDateString()
      : "N/A",
    lastActive: rawUser.updated_at
      ? new Date(rawUser.updated_at).toLocaleDateString()
      : "N/A",
    avatar: "/image/profilePhoto.png",
  };

  return (
    <>
      <UserProfileDetail
        user={user}
        reports={reports}
        onEdit={(id) =>
          setForm({
            type: "update",
            title: "Update User Result",
            description: "",
            id,
          })
        }
        onDelete={(id) =>
          setForm({
            type: "delete",
            title: "",
            description: "",
            id,
          })
        }
      />

      {/* Create/Update Sheet */}
      <FormUser
        open={form.type === "create" || form.type === "update"}
        onClose={() => setForm(FORM_DATA)}
        formData={form.type === "update" ? userData : undefined}
        onSuccess={() => {
          console.log("User saved successfully");
          setForm(FORM_DATA);
          refetchUser();
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
              onClick={handleDelete}
              loading={isPendingDelete}
            >
              <IconDelete /> Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}