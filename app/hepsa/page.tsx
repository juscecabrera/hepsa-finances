import { MoneyTable } from "../pages/money-table";
import { inter } from "../pages/fonts";

export default function Hepsa() {
  return (
    <div className={`flex justify-center items-center flex-col font-bold text-3xl ${inter.className} `}>
      <MoneyTable company={'Hepsa'} />
    </div>
  );
}

