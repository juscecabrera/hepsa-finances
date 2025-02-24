import { MoneyTable } from "./pages/money-table";
import { inter } from "./pages/fonts";

export default function Home() {
  return (
    <div className={`flex justify-center items-center flex-col font-bold text-3xl ${inter.className} `}>
      <MoneyTable company={'Hepsa'} />
      <MoneyTable company={'Insurc'} />
      <MoneyTable company={'JERS'} />
      {/* Al tener mas de una MoneyTable, al dar click en el dropdown menu en un SortableItem de un trabajador, el modal de UserActionDetails se mueve ligeramente a la derecha, no se por que */}
    </div>
  );
}

