import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { apiService } from "../../Service/Dashboard/apiService";
import {createProject} from "../../Service/CustomerServices/transactionService"
export default function Widget({ title }) {
  const theme = useTheme();
  const [items, setItems] = useState([]);
  const [managers, setManagers] = useState([]);
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});

  // ✅ Project form state
  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    managerId: "",
  });

  // Fetch list on mount
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await apiService.get();
      setItems(data);

      // fetch managers (replace with your API route)
      const response = await axios.get("/api/managers");
      setManagers(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Save new project
  const handleSave = async () => {
    // Validation
    let newErrors = {};
    if (!form.name.trim()) newErrors.name = "Project name is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.startDate) newErrors.startDate = "Start date is required";
    if (!form.managerId) newErrors.managerId = "Manager is required";
  
    // If errors exist, stop
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    try {
      console.log("form data", form);
      await createProject(form);
  
      // Reset
      setForm({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        managerId: "",
      });
      setErrors({});
      setOpen(false);
      fetchItems();
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: theme.shadows[4],
        backgroundColor: theme.palette.background.paper,
        mb: 3,
      }}
    >
      <CardContent>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" color="primary">
            {title}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
          >
            Add New
          </Button>
        </Box>

        {/* List */}
        <List>
          {items.length > 0 ? (
            items.map((item, idx) => (
              <ListItem key={idx} divider>
                <ListItemText primary={item.name || `Item ${idx + 1}`} />
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No items found.
            </Typography>
          )}
        </List>
      </CardContent>

      {/* Add Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Add New Project</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Project Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            error={!!errors.description}
            helperText={errors.description}
          />
          <TextField
            label="Start Date"
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            fullWidth
            error={!!errors.startDate}
  helperText={errors.startDate}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Date"
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <Select
            name="managerId"
            value={form.managerId}
            onChange={handleChange}
            displayEmpty
            error={!!errors.managerId}
            fullWidth
          >
            <MenuItem value="">Select Employee</MenuItem>
            {managers.map((manager) => (
              <MenuItem key={manager.id} value={manager.id}>
                {manager.name}
              </MenuItem>
              
            ))}
          </Select>
          {errors.managerId && (
  <Typography variant="caption" color="error">
    {errors.managerId}
  </Typography>
)}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
