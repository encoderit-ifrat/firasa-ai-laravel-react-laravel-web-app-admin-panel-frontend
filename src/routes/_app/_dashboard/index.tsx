import { createFileRoute } from "@tanstack/react-router";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import IconUser from "../../../components/svg-icon/icon-user";
import IconComplete from "../../../components/svg-icon/icon-complete";
import IconUpgrade from "../../../components/svg-icon/icon-upgrade";
import IconConversion from "../../../components/svg-icon/icon-conversion";
import { CircleChart } from "../../../components/ui/pie-chart";
import { LineChart } from "../../../components/ui/line-chart";
import { ChevronsUpDown } from "lucide-react";
import { MiniAreaChart } from "../../../components/app-mini-chart-area";
import { useGetDashboardOverview } from "./-api/queries/use-dashboard-overview";






export const Route = createFileRoute("/_app/_dashboard/")({
  component: RouteComponent,
});



function RouteComponent() {
  const { data: dashboardOverview } = useGetDashboardOverview({
    params: {
      range: "yearly",
    },
    options: {
      enabled: true,
    },
  });


  // Dashboard cards with real data from API
  const dashboardCards = [
    {
      id: 1,
      icon: IconUser,
      value: dashboardOverview?.total_users?.toLocaleString() ?? "0",
      label: "Total Users",
      trend: MiniAreaChart,
      trendType: "positive" as const,
    },
    {
      id: 2,
      icon: IconComplete,
      value: dashboardOverview?.completed_tests?.toLocaleString() ?? "0",
      label: "Completed Tests",
      trend: MiniAreaChart,
      trendType: "positive" as const,
    },
    {
      id: 3,
      icon: IconUpgrade,
      value: dashboardOverview?.upgraded_to_pro?.toLocaleString() ?? "0",
      label: "Upgrade to Pro",
      trend: MiniAreaChart,
      trendType: "positive" as const,
    },
    {
      id: 4,
      icon: IconConversion,
      value: `${dashboardOverview?.conversion_rate ?? 0}%`,
      label: "Conversion",
      trend: MiniAreaChart,
      trendType: (dashboardOverview?.conversion_rate ?? 0) >= 50 ? "positive" as const : "negative" as const,
    },
  ];

  return (
    <section className="px-4">
      <div className="flex justify-between items-center">
        <h1 className="max-h-28 text-3xl font-bold leading-12 text-primary">Dashboard</h1>
        <Button size="lg" variant="gray">
          Daily <ChevronsUpDown className="ml-auto size-4" />
        </Button>
      </div>
      <div className="mt-6 mb-10">
        <h6 className="text-xl font-semibold text-primary leading-[150%]">
          Dashboard Overview
        </h6>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dashboardCards.map((card) => {
          const IconComponent = card.icon;
          const TrendComponent = card.trend;

          return (
            <Card key={card.id} className="@container/card">
              <div className="p-4 flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-gray-100 p-2 flex items-center justify-center">
                    <IconComponent />
                  </div>

                  <div>
                    <h1 className="text-xl font-semibold leading-none">
                      {card.value}
                    </h1>
                    <h2 className="text-sm text-gray-500 leading-none mt-1">
                      {card.label}
                    </h2>
                  </div>
                </div>

                <div className="w-20 flex items-end">
                  <TrendComponent trend={card.trendType} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      <div className="divider border-1 mt-6"></div>
      <section className="mb-20">
        <h1 className="text-primary mt-14 mb-10 text-xl font-medium">Statistics</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CircleChart />
          <LineChart />
        </div>
      </section>
    </section>
  );
}
