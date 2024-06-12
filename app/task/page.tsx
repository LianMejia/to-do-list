"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Input,
  Card,
  CardBody,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Selection,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  SortDescriptor,
  Tooltip,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  useDisclosure,
  Spacer,
  Divider,
} from "@nextui-org/react";
import { DeleteIcon } from "@/components/icons/DeleteIcon";
import PlusIcon from "@/components/icons/PlusIcon";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { ChevronDownIcon } from "@/components/icons/ChevronDownIcon";

interface Task {
  id: number;
  title: string;
  order: number;
  is_completed: boolean;
  status: string; // Agregar esta línea
}

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "title",
  "order",
  "is_completed",
  "actions",
];

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "TASK", uid: "title", sortable: true },
  { name: "ORDER", uid: "order", sortable: true },
  { name: "STATUS", uid: "is_completed", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const statusOptions = [
  { name: "Complete", uid: "complete" },
  { name: "In Progress", uid: "in_progress" },
];

export default function TaskPage() {
  const router = useRouter();
  const [modalTaskId, setModalTaskId] = useState<number | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleOpenModal = (taskId: number) => {
    setModalTaskId(taskId);
    onOpen();
  };

  const [viewFormNewTask, setViewFormNewTask] = useState<boolean>(false);
  const [filterValue, setFilterValue] = useState("");
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [newOrder, setNewOrder] = useState<number>(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [newStatus, setNewStatus] = useState<string>(statusOptions[0].uid);
  const [statusFilter, setStatusFilter] = useState<Set<string>>(
    new Set(["complete", "in_progress"])
  );
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "id",
    direction: "ascending",
  });
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      fetchTasks(token);
    }
  }, [router]);

  const fetchTasks = async (token: string | null) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const pages = Math.ceil(tasks.length / rowsPerPage);

  const toggleFormNewTask = () => {
    setViewFormNewTask((prevState) => !prevState);
  };

  useEffect(() => {
    console.log(`Current state: ${viewFormNewTask}`);
  }, [viewFormNewTask]);

  useEffect(() => {
    console.log("Tasks:", tasks);
  }, [tasks]);

  const handleAddTask = async () => {
    if (newTask.trim() !== "") {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/tasks",
          {
            title: newTask,
            order: newOrder, // Utiliza el valor de newOrder para la orden
            is_completed: newStatus === "complete",
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTasks([...tasks, response.data]);
        setNewTask("");
        setNewOrder(0);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error creating task:", error.response?.data);
        } else {
          console.error("Unexpected error:", error);
        }
      }
    }
  };

  const handleDeleteTask = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      await axios.delete(`http://127.0.0.1:8000/api/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTasks(token);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          console.error("Error deleting task: Task not found");
        } else {
          console.error("Error deleting task:", error.response?.data);
        }
      } else {
        console.error("Unexpected error:", error);
      }
    }
    onClose();
  };

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = tasks.filter((task) => {
    if (statusFilter.has("complete") && task.is_completed) return true;
    if (statusFilter.has("in_progress") && !task.is_completed) return true;
    return false;
  });

  const handleStatusFilterChange = (key: string) => {
    setStatusFilter((prev) => {
      const newStatusFilter = new Set(prev);
      if (newStatusFilter.has(key)) {
        newStatusFilter.delete(key);
      } else {
        newStatusFilter.add(key);
      }
      return newStatusFilter;
    });
  };

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: Task, b: Task) => {
      const first = a[sortDescriptor.column as keyof Task];
      const second = b[sortDescriptor.column as keyof Task];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = (task: Task, columnKey: React.Key): React.ReactNode => {
    const cellValue = task[columnKey as keyof Task];
    switch (columnKey) {
      case "title":
        return cellValue;
      case "is_completed":
        return (
          <Chip
            className="capitalize border-none gap-1 text-default-600"
            color={cellValue ? "success" : "warning"}
            size="sm"
            variant="dot"
          >
            {cellValue ? "Complete" : "In Progress"}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip color="danger" content="Delete task">
              <span
                className="text-lg text-danger cursor-pointer active:opacity-50"
                onClick={() => handleOpenModal(task.id)}
              >
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue !== undefined && cellValue !== null
          ? cellValue.toString()
          : "";
    }
  };

  const onRowsPerPageChange = (keys: Set<string>) => {
    const selectedKey = Array.from(keys)[0];
    setRowsPerPage(Number(selectedKey));
    setPage(1);
  };

  const onSearchChange = (value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  };

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const topContent = (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end">
        <Input
          isClearable
          classNames={{
            base: "w-full sm:max-w-[44%]",
            inputWrapper: "border-1",
          }}
          placeholder="Search by task..."
          size="sm"
          startContent={<SearchIcon className="text-default-300" />}
          value={filterValue}
          variant="bordered"
          onClear={() => setFilterValue("")}
          onValueChange={onSearchChange}
        />
        <div className="flex gap-3">
          <Dropdown>
            <DropdownTrigger>
              <Button
                endContent={<ChevronDownIcon className="text-small" />}
                size="sm"
                variant="flat"
              >
                Status
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              closeOnSelect={false}
              selectedKeys={statusFilter}
              selectionMode="multiple"
              onSelectionChange={(keys) =>
                setStatusFilter(new Set(keys as Set<string>))
              }
            >
              {statusOptions.map((option) => (
                <DropdownItem
                  key={option.uid}
                  isSelected={statusFilter.has(option.uid)}
                >
                  {option.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
              <Button
                endContent={<ChevronDownIcon className="text-small" />}
                size="sm"
                variant="flat"
              >
                Columns
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Table Columns"
              closeOnSelect={false}
              disallowEmptySelection
              selectedKeys={visibleColumns}
              selectionMode="multiple"
              onSelectionChange={setVisibleColumns}
            >
              {columns.map((column) => (
                <DropdownItem key={column.uid}>{column.name}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <Button
            color={viewFormNewTask ? "danger" : "primary"}
            endContent={<PlusIcon />}
            size="sm"
            onPress={toggleFormNewTask}
          >
            {viewFormNewTask ? "Cancel New Task" : "New Task"}
          </Button>
        </div>
      </div>
      {viewFormNewTask && (
        <Card shadow="sm" isBlurred>
          <CardBody>
            <div className="form-task m-4">
              <div className="row-form">
                <div className="mb-3">
                  <span className="text-xl">New Task</span>
                </div>
                <Input
                  isRequired
                  isClearable
                  size="sm"
                  variant="faded"
                  label="New task"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                />
                <div className="flex gap-3 my-4">
                  <Input
                    isRequired
                    size="sm"
                    variant="faded"
                    type="number"
                    label="Order"
                    value={newOrder.toString()}
                    onChange={(e) => setNewOrder(parseInt(e.target.value))}
                  />
                  <Select
                    isRequired
                    variant="bordered"
                    label="Select an status"
                    size="sm"
                    value={newStatus}
                    defaultSelectedKeys={["in_progress"]}
                    onChange={(e) => {
                      console.log(e.target.value);
                      setNewStatus(e.target.value);
                    }}
                  >
                    {statusOptions.map((status) => (
                      <SelectItem key={status.uid} value={status.uid}>
                        {capitalize(status.name)}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <Button
                  isDisabled={newTask.length < 4 || newOrder < 1}
                  size="sm"
                  color="primary"
                  fullWidth
                  onClick={handleAddTask}
                >
                  Add Task
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );

  return (
    <>
      <Table
        className="container mx-auto w-2/3"
        aria-label="Example table with client side sorting"
        bottomContent={
          <>
            <div className="px-2">
              <div className="flex items-center justify-between">
                <span className="text-default-400 text-small">
                  Total {tasks.length} users
                </span>
                <div className="flex items-center justify-end">
                  <div className="text-small text-default-400">
                    Rows per page:
                  </div>
                  <Spacer x={1} />
                  <Dropdown size="sm">
                    <DropdownTrigger className="hidden sm:flex">
                      <Button
                        endContent={<ChevronDownIcon className="text-small" />}
                        size="sm"
                        variant="bordered"
                      >
                        {rowsPerPage}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      disallowEmptySelection
                      aria-label="Table Columns"
                      closeOnSelect={true} // Ensure the menu closes on selection
                      selectedKeys={new Set([rowsPerPage.toString()])}
                      selectionMode="single"
                      onSelectionChange={(keys) =>
                        onRowsPerPageChange(keys as Set<string>)
                      }
                    >
                      {[5, 10, 20].map((num) => (
                        <DropdownItem key={num} value={num.toString()}>
                          {num}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
            </div>

            <Divider orientation="horizontal" />

            <div className="flex justify-between items-center px-2">
              <div className="text-small text-default-400">
                Page {page} of {pages}
              </div>
              <div className="flex items-center">
                <Button
                  size="sm"
                  variant="light"
                  color="default"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                >
                  Previous
                </Button>
                <Spacer x={1} />
                <Button
                  size="sm"
                  variant="light"
                  color="primary"
                  onClick={() => setPage((prev) => Math.min(prev + 1, pages))}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        }
        onSortChange={setSortDescriptor}
        sortDescriptor={sortDescriptor}
        topContent={topContent}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn key={column.uid} allowsSorting={column.sortable}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {headerColumns.map((column) => (
                <TableCell key={column.uid}>
                  {renderCell(item, column.uid)}
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-2xl">
                Delete Task
              </ModalHeader>
              <ModalFooter>
                <Button
                  color="primary"
                  size="sm"
                  variant="solid"
                  onPress={onClose}
                >
                  Close
                </Button>
                <Button
                  color="danger"
                  size="sm"
                  variant="light"
                  onPress={() => modalTaskId && handleDeleteTask(modalTaskId)}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
