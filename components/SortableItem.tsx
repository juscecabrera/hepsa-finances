import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableItemProps {
  id: number;
  number: number;
  isOverlay?: boolean; //este es el cambio
}

const SortableItem: React.FC<SortableItemProps> = ({ id, number, isOverlay = false }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging && !isOverlay ? 0 : 1, // Oculta solo el original cuando se arrastra
    cursor: isOverlay ? "grabbing" : "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-gray-200 p-3 rounded-md shadow-md ${isOverlay ? "cursor-grabbing scale-105" : ""}`}
    >
      {number === 0 ? "Vacio" : `S/ ${number}`}
    </div>
  );
};

export default SortableItem;
