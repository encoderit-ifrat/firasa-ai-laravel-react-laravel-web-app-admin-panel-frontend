import { Eye, Plus, Rows3, SlidersHorizontal } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import SearchBar from "../../../../components/ui/search-bar";
import IconSort from "../../../../components/svg-icon/icon-sort";
import IconExport from "../../../../components/svg-icon/icon-export";


export default function CardUsersResults() {
  return (
    <div className="px-4">
      <div className="flex justify-between mb-6 mt-6">
        <h1 className="text-3xl font-bold leading-12">Users & Results</h1>
        <Button variant="outline" className="">
          <Plus /> Add New User
        </Button>
      </div>
      <div className="flex justify-between">
        <SearchBar />
        <div className="flex gap-2">
          <Button variant="outline">
            <Rows3 />
            Columns
          </Button>
          <Button variant="outline">
            <Eye />
            View
          </Button>
          <Button variant="outline">
            <IconSort />
            Sort
          </Button>
          <Button variant="outline">
            <SlidersHorizontal />
            Filters
          </Button>
          <Button variant="outline">
            <IconExport />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
}
