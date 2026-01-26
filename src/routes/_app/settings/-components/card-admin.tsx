import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import type { TForm } from "../../../../types/form";

import { Badge } from "../../../../components/ui/badge";

import Loading from "../../../../components/base/loading";
import { useGetUser } from "../-api/queries/use-get-user";

type TProps = { form_data: Pick<TForm, "type" | "id"> };

export default function CardAdmin({ form_data }: TProps) {
  const { data: response, isLoading: isLoadingAdmin } = useGetUser({
    id: form_data.id ?? "",
    options: {
      enabled: !!form_data.id && form_data.type === "read",
    },
  });

  const admin = response?.data; // Access the admin from response.data

  if (isLoadingAdmin) {
    return <Loading />;
  }

  return (
    <Card className="border-none p-0 bg-transparent shadow-none px-4">
      <CardHeader className="p-0">
        <CardTitle className="text-xl">
          Admin: {admin?.name || "N/A"}
        </CardTitle>
        <CardDescription className="text-sm">
          Email: {admin?.email}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 p-0 mt-6">
        <div>
          <h4 className="font-semibold mb-3 text-base border-b pb-1">
            Admin Information
          </h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="font-semibold min-w-[120px] text-muted-foreground">
                Full Name:
              </span>
              <span>{admin?.name}</span>
            </li>

            <li className="flex items-start gap-2">
              <span className="font-semibold min-w-[120px] text-muted-foreground">
                Email Address:
              </span>
              <span>{admin?.email}</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}