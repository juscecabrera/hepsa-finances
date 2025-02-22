'use client'

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon } from "lucide-react";
import { DndContext, closestCenter, DragOverlay, DragStartEvent, DragMoveEvent, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import SortableItem from './SortableItem';

interface RowsProps {
    number: number;
    index: number;
    paid: boolean;
    setTableRows: React.Dispatch<React.SetStateAction<{ left: number[]; right: number[] }>>;
    tableRows: { left: number[]; right: number[] };
}

interface Payment {
    id: number;
    amount: number;
    isPaid: number;
    personId: number;
}

interface Person {
    name: string;
    payments: Payment[];
}

interface UserActionDetailsProps {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
    totalPaid: number;
    totalUnpaid: number;
    selectedPerson?: Person;
}

const UserActionDetails: React.FC<UserActionDetailsProps> = ({ 
    isModalOpen, 
    setIsModalOpen, 
    totalPaid, 
    totalUnpaid, 
    selectedPerson
 }) => {
    const [tableRows, setTableRows] = useState({
        left: [0, 2000, 4000],
        right: [5000, 1000, 2000]
    });
    
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [activeItem, setActiveItem] = useState<number | null>(null);


    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            setCursorPosition({ x: e.clientX, y: e.clientY });
        };
    
        window.addEventListener("mousemove", updateMousePosition);
        return () => window.removeEventListener("mousemove", updateMousePosition);
      }, []);


    const handleDragStart = (event: DragStartEvent) => {
        if (!event.active) return;
        
        setActiveItem(event.active.id as number);
    
        // Obtener la posición del cursor al iniciar el drag
        if ('clientX' in event.activatorEvent && 'clientY' in event.activatorEvent) {
            setCursorPosition({
                x: (event.activatorEvent as MouseEvent).clientX,
                y: (event.activatorEvent as MouseEvent).clientY
            });
        }
    };

    const handleDragMove = (event: DragMoveEvent) => {
        if ('clientX' in event.activatorEvent && 'clientY' in event.activatorEvent) {
            setCursorPosition({
                x: (event.activatorEvent as MouseEvent).clientX,
                y: (event.activatorEvent as MouseEvent).clientY
            });
        }
    };

    const handleDragEnd = (event: any, side: "left" | "right") => {
        setActiveItem(null); // Limpia el elemento activo después del drag
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        setTableRows(prev => {
            const items = [...prev[side]];
            const oldIndex = items.indexOf(Number(active.id));
            const newIndex = items.indexOf(Number(over.id));
            return {
                ...prev,
                [side]: arrayMove(items, oldIndex, newIndex)
            };
        });
    };

    const addPayment = (side: "left" | "right") => {
        setTableRows(prev => ({
            ...prev,
            [side]: [...prev[side], 0]
        }));
    };

    return (
        <div>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                
                <DialogContent className='sm:max-w-[800px] font-inter'>
                    <DialogHeader>
                        <DialogTitle>{selectedPerson?.name}</DialogTitle>
                        <DialogDescription>Detalles de pagos</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-8">
                        {(["left", "right"] as const).map((side) => (
                            <div key={side}>
                                <h3 className="mb-2 font-semibold">{side === "left" ? "Pagado" : "Por Pagar"}</h3>
                                {/* DND Context Anterior */}

                                <DndContext 
                                    collisionDetection={closestCenter} 
                                    onDragStart={handleDragStart} 
                                    onDragMove={handleDragMove} 
                                    onDragEnd={(event) => handleDragEnd(event, side)}
                                >
                                    <SortableContext items={tableRows[side]} strategy={verticalListSortingStrategy}>
                                        <div className="space-y-2">
                                            {tableRows[side].map((number, index) => (
                                                <SortableItem key={number} id={number} number={number} />
                                            ))}
                                        </div>
                                    </SortableContext>


                                    
                                    <DragOverlay>
                                        {activeItem !== null ? (
                                            <motion.div 
                                                // initial={{ scale: 1, opacity: 0.9 }}
                                                animate={{ 
                                                    scale: 1, 
                                                    opacity: 1, 
                                                    x: cursorPosition.x, 
                                                    y: cursorPosition.y 
                                                }}
                                                exit={{ scale: 1, opacity: 0 }}
                                                // transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                className="bg-blue-300 p-3 rounded-md shadow-lg fixed"
                                            >
                                                {activeItem === 0 ? "Vacio" : `S/ ${activeItem}`}
                                            </motion.div>
                                        ) : null}
                                    </DragOverlay>


                                    
                                </DndContext>

                                {/* Termina DND Context Anterior */}

                                <Button className="my-2" onClick={() => addPayment(side)}>Agregar pago</Button>
                                <h3 className="my-2 font-semibold">S/ {side === "left" ? totalPaid : totalUnpaid}</h3>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UserActionDetails;
