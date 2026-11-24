import EventLauncher from "@/components/EventLauncher";
import InvestingCalendar from "@/components/InvestingCalendar";
import MyEvents from "@/components/MyEvents";
import QuickLinks from "@/components/QuickLinks";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-4">
      <InvestingCalendar height={520} controls={false} />
      <div className="grid gap-4 2xl:grid-cols-2">
        <EventLauncher />
        <MyEvents limitDays={7} />
      </div>
      <QuickLinks />
    </div>
  );
}
