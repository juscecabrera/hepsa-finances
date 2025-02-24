import { MoneyTable } from "../pages/money-table";
import { inter } from "../pages/fonts";

export default function Insurc() {
  return (
    <div className={`flex justify-center items-center flex-col font-bold text-3xl ${inter.className} `}>
      <MoneyTable company={'Insurc'} />
    </div>
  );
}

