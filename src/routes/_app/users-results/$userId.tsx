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

// Dummy data - in real app, this would come from an API
const DUMMY_DATA = [
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
    plan: "Basic",
    testsTaken: 8,
    lastTestDate: "2024-03-10",
    status: "Active",
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
    status: "Inactive",
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

export const Route = createFileRoute("/_app/users-results/$userId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { userId } = Route.useParams();
  const [form, setForm] = useState<TForm>(FORM_DATA);

  const userIdNumber = parseInt(userId, 10);
  const user = DUMMY_DATA.find((u) => u.id === userIdNumber);

  if (!user) {
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

  return (
    <>
      <UserProfileDetail
        user={user}
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
        formData={
          form.type === "update"
            ? DUMMY_DATA.find((u) => u.id === form.id)
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
    </>
  );
}
