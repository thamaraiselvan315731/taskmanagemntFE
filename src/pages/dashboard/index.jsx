
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,InputLabel,FormControl,DialogContent,
  Paper,MenuItem,Select,
  useTheme,Dialog,
  CircularProgress,IconButton,DialogTitle,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { tokens } from "../../theme";
import { Doughnut, Bar } from "react-chartjs-2";
import Header from "../../components/Header";
import {getDashboardData,updateTaskStatus} from "../../Service/CustomerServices/transactionService"
import Widget from "./Widget";
const taskStatusOptions = [
  { value: "Pending", label: "Pending" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
];

const TaskListWidget = ({ title, tasks, colors ,handleEdits}) => (
  
  <Paper sx={{ p: 2, height: "100%", overflow: "auto" }}>
    <Typography variant="h6" fontWeight="600" gutterBottom>
      {title}
    </Typography>
    {tasks.length === 0 && (
      <Typography variant="body2" color="text.secondary">
        No tasks found.
      </Typography>
    )}
    {tasks.map((task) => (
      <Box
        key={task.id}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={1.5}
        mb={1}
        border={`1px solid ${colors.primary[400]}`}
        borderRadius={1.5}
      >
        <Box>
          <Typography fontWeight="600">{task.title}</Typography>
          <Typography variant="caption" color="text.secondary">
           Status:<span style={{
              
          
            borderRadius: 1,
            color: task.status === "Completed"
            ? colors.greenAccent[500]
            : task.status === "In Progress"
            ? colors.blueAccent[500]
            : colors.redAccent[500],
            fontSize: 12,}}>{task.status}</span> | Priority:<span style={{
              
          
              borderRadius: 1,
              color: task.priority === "Low"
              ? colors.greenAccent[500]
              : task.priority === "Medium"
              ? colors.blueAccent[500]
              : colors.redAccent[500],
              fontSize: 12,}}> {task.priority}</span> | Due: {new Date(task.dueDate).toLocaleDateString()}
          </Typography>
        </Box>
        {/* <Typography
          sx={{
            backgroundColor:
              task.status === "Completed"
                ? colors.greenAccent[500]
                : task.status === "In Progress"
                ? colors.blueAccent[500]
                : colors.redAccent[500],
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            color: "#fff",
            fontSize: 12,
          }}
        >
          {task.status}
        </Typography> */}
      <Button
  startIcon={<EditOutlinedIcon />}
  color="secondary"
  size="small"
  onClick={() => handleEdits(tasks, task.id)} // pass the correct task.id
>
  Edit
</Button>


      </Box>
    ))}
  </Paper>
);


const StatusChartWidget = ({ statusCounts, colors }) => {
  const labels = statusCounts.map((s) => s.status);
  const data = statusCounts.map((s) => s.count);

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: [
          colors.greenAccent[500],
          colors.blueAccent[500],
          colors.redAccent[500],
          colors.grey[500],
        ],
      },
    ],
  };

  return (
    <Paper sx={{ p: 2, height: "100%" }}>
      <Typography variant="h6" fontWeight="600" gutterBottom>
        Task Status Overview
      </Typography>
      <Box sx={{ height: 250 }}>
      <Doughnut data={chartData} />
      </Box>
    </Paper>
  );
};


const OrgStatsWidget = ({ stats, colors }) => {
  const labels = [...new Set(stats?.map((s) => s?.assignedWorker.name))];
  const statusMap = [...new Set(stats?.map((s) => s?.status))];
console.log("stats---->",stats)
  const datasets = statusMap?.map((status, idx) => ({
    label: status,
    data: labels.map(
      (name) =>
        stats?.find((s) => s?.assignedWorker?.name === name && s.status === status)?.count || 0
    ),
    backgroundColor:
      status === "Completed"
        ? colors.greenAccent[500]
        : status === "In Progress"
        ? colors.blueAccent[500]
        : colors.redAccent[500],
  }));

  const chartData = { labels, datasets };

  return (
    <Paper sx={{ p: 2, height: "100%" }}>
     
      {/* <Box sx={{ height: 250 }}> */}
      
       <Widget title={"Projects"}/>
      {/* </Box> */}
    </Paper>
  );
};


const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [taskId, setTaskId] = useState("");
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
const [selectedTask, setSelectedTask] = useState(null);

  const handleChange = (e) => setStatus(e.target.value);

  const handleSave = async () => {
    if (!status) return;
    setLoading(true);
    try {
      const payload = { taskId, status };

      await updateTaskStatus(payload);
     
    } catch (err) {
      console.error("Error saving status:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleEdits = (tasks, taskId) => {
    const taskToEdit = tasks.find((t) => t.id === taskId);
    setSelectedTask(taskToEdit); // set the task for dialog
    setOpenDialog(true);
  };

 

useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const parsed = JSON.parse(storedUser); // parse string to object
    setRole(parsed.role);
    setUserId(parsed.id);
  }
}, []);

const fetchTasks = async () => { 
  setLoading(true);
  getDashboardData(role, userId) // pass role/userId to backend
    .then((res) => {
      setData(res);
      setLoading(false);
    })
    .catch(() => setLoading(false));
 }

useEffect(() => {
  if (!role || !userId) return; // wait until both are available

  setLoading(true);
  getDashboardData(role, userId) // pass role/userId to backend
    .then((res) => {
      setData(res);
      setLoading(false);
    })
    .catch(() => setLoading(false));
}, [role, userId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box m={3}>
      <Header title="TASK DASHBOARD" subtitle={`Welcome ${role}`} />

      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gap={2.5}
        gridAutoRows="minmax(180px, auto)"
        mt={3}
      >
       
        {role === "Employee" && (
          <>
            <Box gridColumn="span 8">
            <TaskListWidget
  title="My Tasks"
  tasks={data.tasks}
  colors={colors}
  handleEdits={handleEdits} // pass the function directly
/>
             
            </Box>
            <Box gridColumn="span 4">
              {/* <StatusChartWidget statusCounts={data.statusCounts} colors={colors} /> */}
            </Box>
          </>
        )}

<StatusDialog
  open={openDialog}
  onClose={() => setOpenDialog(false)}
  task={selectedTask}
  refreshTasks={fetchTasks} 
/>
        

       
        {role === "Manager" && (
          <>
            <Box gridColumn="span 8">
              <TaskListWidget
                title="Team Tasks"
                tasks={data.tasks}
                colors={colors}
                handleEdits={handleEdits}
              />
            </Box>
            {/* <Box gridColumn="span 4">
              <StatusChartWidget statusCounts={data.statusCounts} colors={colors} />
            </Box> */}
          </>
        )}
 
      
        {role === "Admin" && (
          <Box gridColumn="span 12">
          
            <OrgStatsWidget stats={data.stats} colors={colors} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

const StatusDialog = ({ open, onClose, task, refreshTasks }) => {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setStatus(task?.status || "");
  }, [task]);

  const taskStatusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "In Progress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
  ];

  const handleChange = (e) => setStatus(e.target.value);

  const handleSave = async () => {
    if (!status) return;

    setLoading(true);
    try {
      await updateTaskStatus(task.id, status); // make sure this calls the API
      if (refreshTasks) refreshTasks(); // refresh tasks after change
      onClose();
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <span>Change Status</span>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" alignItems="center" gap={2} mt={1}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select value={status} onChange={handleChange} label="Status">
              {taskStatusOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={loading || !status}
          >
            {loading ? "Saving..." : "Change Status"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default Dashboard;
