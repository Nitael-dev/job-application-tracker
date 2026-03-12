"use client";

import {
  Board,
  Column,
  JobApplicationProps,
} from "@shared/lib/models/models.types";
import {
  Award,
  Calendar,
  CheckCircle2,
  Mic,
  MoreVertical,
  Trash2,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { JobApplicationDialog } from "./job-dialog";
import { JobApplicationCard } from "./job-application-card";
import { useBoard } from "@shared/lib/hooks/useBoard";
import { useState } from "react";
import { closestCorners, DndContext, PointerSensor, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';

interface KanbanBoardProps {
  board: Board;
  userId: string;
}

interface ColProps {
  color: string;
  icon: React.ReactNode;
}

const COLUMN_CONFIG: Array<ColProps> = [
  {
    color: "bg-cyan-500",
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    color: "bg-purple-500",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  {
    color: "bg-green-500",
    icon: <Mic className="h-4 w-4" />,
  },
  {
    color: "bg-yellow-500",
    icon: <Award className="h-4 w-4" />,
  },
  {
    color: "bg-red-500",
    icon: <XCircle className="h-4 w-4   " />,
  },
];

const INITIAL_FORM_DATA = {
  company: "",
  position: "",
  location: "",
  notes: "",
  salary: "",
  jobUrl: "",
  tags: "",
  description: "",
};

function DroppableColumn({
  column,
  config,
  boardId,
  sortedColumns,
}: {
  column: Column;
  config: ColProps;
  boardId: string;
  sortedColumns: Column[];
}) {
  const [open, setOpen] = useState(false);
  const [jobId, setJobId] = useState<string | undefined>();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const [loading, setLoading] = useState(false);

  const {setNodeRef, isOver} = useDroppable({
    id: column._id,
    data: {
      type: "column",
      columnId: column._id
    }
  });

  const sortedJobs =
    column.jobApplications?.sort((a, b) => a.order - b.order) || [];

  function handleDialog(isOpen: boolean) {
    setLoading(false);
    setTimeout(() => {
      setJobId(undefined);
    }, 1000);
    setOpen(isOpen);
  }

  return (
    <Card className="min-w-[300px] flex-shrink-0 shadow-md p-0">
      <CardHeader
        className={`${config.color} text-white rounded-t-lg pb-3 pt-3`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {config.icon}
            <CardTitle className="text-white text-base font-semibold">
              {column.name}
            </CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-white hover:bg-white/20"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-destructive cursor-pointer">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Column
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent ref={setNodeRef} className={`space-y-2 pt-4 bg-gray-50/50 min-h-[400px] rounded-b-lg ${isOver ? 'ring-2 ringlbue-50' : ""}`}>
        <SortableContext items={sortedJobs.map((job) => job._id)} strategy={verticalListSortingStrategy}>
          {sortedJobs.map((job) => {
            return (
              <SortableJobCard
                key={job._id}
                handleJob={() => {
                  setJobId(job._id);
                  setOpen((old) => !old);

                  setFormData({
                    company: job.company,
                    description: job.description || "",
                    jobUrl: job.jobUrl || "",
                    location: job.location || "",
                    notes: job.notes || "",
                    position: job.position,
                    salary: job.salary || "",
                    tags: job.tags?.toString().replaceAll(",", ", ") || "",
                  });
                }}
                job={{
                  ...job,
                  columnId: job.columnId || column._id,
                }}
              columns={sortedColumns}
              />
            );
          })}
          </SortableContext>
        <JobApplicationDialog
          open={open}
          loading={loading}
          setLoading={setLoading}
          jobId={jobId}
          formData={formData}
          setFormData={setFormData}
          handleDialog={handleDialog}
          columnId={String(column._id)}
          boardId={String(boardId)}
        />
      </CardContent>
    </Card>
  );
}

function SortableJobCard({
  job,
  columns,
  handleJob,
}: {
  job: JobApplicationProps;
  columns: Column[];
  handleJob(): void;
}) {
  const {attributes, listeners, transform, transition, isDragging, setNodeRef} = useSortable({
    id: job._id,
    data: {
      type: "job",
      job
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div ref={setNodeRef} style={style}>
      <JobApplicationCard job={job} columns={columns} handleJob={handleJob} dragHandleProps={{...attributes, ...listeners}} />
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function KanbanBoard({ board, userId }: KanbanBoardProps) {
  const { columns } = useBoard(board);

  const sortedColumns = columns?.sort((a, b) => a.order - b.order) || [];
  
  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8
    }
  }))

  function handleDragStart() {

  }

  function handleDragEnd() {

  }
  
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className='space-y-4'>
        <div className='flex gap-4 overflow-x-auto pb-4'>
          {columns.map((col, index) => {
            const config = COLUMN_CONFIG[index] || {
              color: "bg-cyan-500",
              icon: <Calendar className="h-4 w-4" />,
            };

            return (
              <DroppableColumn
                key={col._id}
                boardId={board._id}
                column={col}
                config={config}
                sortedColumns={sortedColumns}
              />
            );
          })}
        </div>
      </div>
    </DndContext>
  );
}
