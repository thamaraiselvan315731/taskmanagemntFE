import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {
  Grid,
  TextField,
  MenuItem,
  Button,
  useTheme,
} from "@mui/material";
import { tokens } from "../theme";
import {createTask} from "../Service/CustomerServices/transactionService";
const TaskForm = ({ task, permissions, onSubmit,reassign }) => {
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const theme = useTheme();
  const user = localStorage.getItem("user")
  const colors = tokens(theme.palette.mode);
console.log("user",user)
  useEffect(() => {
    axios.get("/api/employees").then((response) => {
      setEmployees(response.data);
    });
    axios.get("/api/project/my-projects").then((response) => {
      setProjects(response.data);
    });

    ///project/my-projects
  }, []);

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    dueDate: Yup.date().required("Due date is required"),
    priority: Yup.string().required("Priority is required"),
    assignedTo: permissions?.includes("assign_tasks")
      ? Yup.number().required("Assigned employee is required")
      : Yup.number().nullable(),
      project_id: permissions?.includes("assign_tasks")? Yup.number().required("Assigned Project is required")
      : Yup.number().nullable(),

      //project_id
    // status: permissions?.includes("update_task_status")
    //   ? Yup.string().required("Status is required")
    //   : Yup.string().nullable(),
  });

  const initialValues = {
    title: task?.title || "",
    description: task?.description || "",
    dueDate: task?.dueDate
    ? new Date(task.dueDate).toISOString().split("T")[0] 
    : "",
    priority: task?.priority?.toLowerCase() || "",
    assignedTo: task?.assignedTo || "",
    project_id: task?.project_id || "",
    status: task?.status || "",
  };

  const handleSubmit = async(values) => {
    onSubmit(values);

    // let result=await createTask(values);
    // console.log("result",result)

  };

  return (
    <div>
     
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isSubmitting,
        }) => (
          <Form>
            <Grid container spacing={3}>
              {/* Title Field */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Title"
                  disabled={reassign}
                  name="title"
                  variant="outlined"
                  size="small"
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.title && touched.title}
                  helperText={touched.title && errors.title}
                />
              </Grid>

              {/* Description Field */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  variant="outlined"
                  disabled={reassign}
                  size="small"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.description && touched.description}
                  helperText={touched.description && errors.description}
                />
              </Grid>

              {/* Due Date Field */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Due Date"
                  type="date"
                  name="dueDate"
                  disabled={reassign}
                  variant="outlined"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={values.dueDate}
                  onChange={handleChange}
                  inputProps={{
                    min: new Date().toISOString().split("T")[0],  
                  }}
                  onBlur={handleBlur}
                  error={!!errors.dueDate && touched.dueDate}
                  helperText={touched.dueDate && errors.dueDate}
                />
              </Grid>

              {/* Priority Field */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Priority"
                  name="priority"
                  disabled={reassign}
                  variant="outlined"
                  size="small"
                  value={values.priority}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.priority && touched.priority}
                  helperText={touched.priority && errors.priority}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </TextField>
              </Grid>

              {/* Assigned To Field */}
              {permissions?.includes("assign_tasks") && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label={reassign?"Reassign":"Assigned To"}
                    name="assignedTo"
                    variant="outlined"
                    size="small"
                    value={values.assignedTo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!errors.assignedTo && touched.assignedTo}
                    helperText={touched.assignedTo && errors.assignedTo}
                  >
                    <MenuItem value="">Select Employee</MenuItem>
                    {employees.map((employee) => (
                      <MenuItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              )}
               {/* {permissions?.includes("create_project") && ( */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Project "
                    disabled={reassign}
                    name="project_id"
                    variant="outlined"
                    size="small"
                    value={values.project_id}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!errors.project_id && touched.project_id}
                    helperText={touched.project_id && errors.project_id}
                  >
                    <MenuItem value="">Select Project</MenuItem>
                    {projects.map((project) => (
                      <MenuItem key={project.id} value={project.id}>
                        {project.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              {/* )} */}

              {/* Status Field */}
              {permissions?.includes("update_task_status") && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Status"
                    name="status"
                    variant="outlined"
                    disabled={reassign }
                    size="small"
                    value={values.status}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!errors.status && touched.status}
                    helperText={touched.status && errors.status}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                  </TextField>
                </Grid>
              )}

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color={"success"}
                  disabled={isSubmitting}
                >
                  {task ? "Update Task" : "Create Task"}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TaskForm;
