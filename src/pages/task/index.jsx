import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme, Button, Snackbar, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import Header from "../../components/Header";
import TaskForm from "../../components/TaskForm";
import { getTasks, createTask, updateTask, deleteTask,updateReasignTask } from "../../Service/CustomerServices/transactionService";

const Task = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState({});
  const [reassign, setReassign] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false); // Manage Dialog open/close state
const [permissions, setPermissions] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).permissions : []
);
  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Function to fetch all tasks
  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data.tasks); // Assuming the API returns { tasks: [...] }
    } catch (error) {
      setSnackbarMessage("Failed to fetch tasks");
      setOpenSnackbar(true);
    }
  };

const haandleReassign=(taskId)=>{
  const taskToEdit = tasks?.find((task) => task.id === taskId);
 
    setEditingTask(taskToEdit);
    setReassign(true);
    
    setOpenDialog(true);console.log("! sec later",editingTask)

}



  // Handle edit task
  const handleEdit = async(taskId) => {
    const taskToEdit = tasks?.find((task) => task.id === taskId);
 
    setEditingTask(taskToEdit);
    
    setOpenDialog(true);
  };

  // Handle delete task
  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      setSnackbarMessage("Task deleted successfully");
      setOpenSnackbar(true);
      fetchTasks(); // Refresh the task list after deletion
    } catch (error) {
      setSnackbarMessage("Failed to delete task");
      setOpenSnackbar(true);
    }
  };

  // Handle task form submission (create or update task)
  const handleFormSubmit = async (taskData) => {
    try {
      if (editingTask) {
        if(reassign){
        await updateReasignTask(editingTask.id, taskData);
        setReassign(false)
        }
        else{
          await updateTask(editingTask.id, taskData);
          setSnackbarMessage("Task updated successfully");
        }
       
      } else {
        await createTask(taskData);
        setSnackbarMessage("Task created successfully");
      }
      setOpenSnackbar(true);
      fetchTasks(); // Refresh task list
      setOpenDialog(false); // Close the dialog
      setEditingTask(null); // Reset editing task state
      setReassign(false)
    } catch (error) {
      setSnackbarMessage("Failed to save task");
      setOpenSnackbar(true);
    }
  };

  // Define the columns for the DataGrid (including actions for Edit and Delete)
  const columns = [
    { field: "id", headerName: "ID" },
    { field: "title", headerName: "Title" },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "dueDate", headerName: "Due Date", type: "date", headerAlign: "left", align: "left" },
    { field: "priority", headerName: "Priority" },
    { field: "status", headerName: "Status" },

    { field: "assignedWorker", headerName: "Assigned To", flex: 1,
      renderCell: (params) => (
        <Box display="flex" justifyContent="flex-end" gap="10px" textAlign={"end"}>
         
          <Button
            startIcon={<EditOutlinedIcon />}
            color="warning"
            size="small"
            onClick={() => haandleReassign(params.row.id)}
          >
           {params.row.assignedWorker ? params.row.assignedWorker.name : "Unassigned"} Reassign
          </Button>
        
        </Box>
      ),
     },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "left",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" justifyContent="flex-end" gap="10px" textAlign={"end"}>
          <Button
            startIcon={<EditOutlinedIcon />}
            color="secondary"
            size="small"
            onClick={() => handleEdit(params.row.id)}
          >
            Edit
          </Button>
          <Button
            startIcon={<DeleteOutlinedIcon />}
            color="error"
            size="small"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="TASKS" subtitle="Manage Your Tasks" />
      <Box display="flex" justifyContent="flex-end" alignItems="center">
        
        <Button
          variant="contained"
          color={"secondary"}
          sx={{ marginBottom: "20px" }}
          onClick={() => {
            setEditingTask(null); // Reset the editing task for creating new
            setOpenDialog(true);  // Open dialog for creating a new task
          }}
        >
          Create New
        </Button>
      </Box>

      {/* DataGrid to display tasks */}
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
        }}
      >
        <DataGrid rows={tasks} columns={columns} />
      </Box>

      {/* Snackbar for feedback messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />

      
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle><Box display="flex" justifyContent="space-between" alignItems="center">
    <span>{editingTask ? "Edit Task" : "Create New Task"}</span>
    <IconButton onClick={() => setOpenDialog(false)} size="small">
      <CloseIcon />
    </IconButton>
  </Box></DialogTitle>
        <DialogContent>
          <TaskForm task={JSON.parse(JSON.stringify(editingTask))} permissions={permissions}  onSubmit={handleFormSubmit} reassign={reassign}/>
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={() => setOpenDialog(false)} variant="contained"
          color="primary">
            Cancel
          </Button>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
          {editingTask? "Save": "Create"}
          </Button>
        </DialogActions> */}
      </Dialog>
    </Box>
  );
};

export default Task;
