import EventLauncher from "@/components/EventLauncher";
import InvestingCalendar from "@/components/InvestingCalendar";
import MyEvents from "@/components/MyEvents";

export default function CalendarPage() {
  return (
    <div className="flex flex-col gap-4">
      <InvestingCalendar height={760} />
      <MyEvents />
      <EventLauncher />
    </div>
  );
}
