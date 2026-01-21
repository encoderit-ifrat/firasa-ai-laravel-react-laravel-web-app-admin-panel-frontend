export type TFormType =
  | "default"
  | "create"
  | "read"
  | "update"
  | "delete"
  | "create-performance"
  | "view-performance";
export type TForm = {
  type: TFormType;
  title: string;
  description: string;
  id?: string | number;
};
