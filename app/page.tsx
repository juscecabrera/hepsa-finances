import MoneyTable from "./pages/money-table";
import { DatePickerWithRange } from "@/components/datePicker";
import { inter } from "./pages/fonts";

export default function Home() {
  return (
    <div className={`flex justify-center items-center flex-col font-bold text-3xl w-screen h-screen ${inter.className} `}>
      {/* <DatePickerWithRange /> */}
      <MoneyTable />
    </div>
  );
}

