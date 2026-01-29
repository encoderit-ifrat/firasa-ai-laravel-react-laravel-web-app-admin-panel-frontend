import { Spinner } from "../ui/spinner";

export default function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center w-full min-h-32">
      <Spinner 
        key={"bars"} 
        variant="bars"
      />
    </div>
  );
}