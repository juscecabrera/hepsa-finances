import { MoneyTable } from "../pages/money-table";
import { inter } from "../pages/fonts";

export default function JERS() {
  return (
    <div className={`flex justify-center items-center w-full  flex-col font-bold text-3xl ${inter.className} `}>
      <MoneyTable company={'JERS'} />
    </div>
  );
}

