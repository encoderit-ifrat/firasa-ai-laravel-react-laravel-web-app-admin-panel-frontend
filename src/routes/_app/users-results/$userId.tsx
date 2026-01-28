import { createFileRoute } from "@tanstack/react-router";
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

export const Route = createFileRoute("/_app/users-results/$userId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { userId } = Route.useParams();
  const [form, setForm] = useState<TForm>(FORM_DATA);

  const userIdNumber = parseInt(userId, 10);

  // Fetch single user data using useGetUser
  const { data: userData, isLoading: isLoadingUser, refetch: refetchUser } = useGetUser({
    id: userIdNumber,
    options: {
      enabled: !isNaN(userIdNumber),
    },
  });

  // Fetch user reports using the dynamic userId
  const { data: userReportsResponse, isLoading: isLoadingReports } = useGetUserReports({
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

  // Extract reports from useGetUserReports
  const reports = userReportsResponse?.data || [];

  console.log("🚀 ~ RouteComponent ~ userData:", userData);
  console.log("🚀 ~ RouteComponent ~ reports:", reports);

  if (isLoadingUser || isLoadingReports) {
    return <Loading />;
  }

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

  // Transform API data to match component expectations
  // Note: useGetUser returns TAdminSchema, so some fields may not be available
  const user = {
    id: typeof userData.id === 'number' ? userData.id : Number(userData.id) || 0,
    name: userData.name,
    email: userData.email,
    plan: (userData as Record<string, unknown>).plan as string || "Free",
    testsTaken: (userData as Record<string, unknown>).analysis_taken_count as number || 0,
    lastTestDate: (userData as Record<string, unknown>).last_analysis_date as string || null,
    status: (userData as Record<string, unknown>).status as string || "Active",
    deviceUsed: (userData as Record<string, unknown>).last_device_used as string || "N/A",
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
    </>
  );
}
