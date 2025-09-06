// import { Box, Typography, useTheme } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";
// import { tokens } from "../../theme";
// import { mockDataTeam } from "../../data/mockData";
// import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
// import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
// import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
// import Header from "../../components/Header";

// const Team = () => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   const columns = [
//     { field: "id", headerName: "ID" },
//     {
//       field: "name",
//       headerName: "Name",
//       flex: 1,
//       cellClassName: "name-column--cell",
//     },
//     {
//       field: "age",
//       headerName: "Age",
//       type: "number",
//       headerAlign: "left",
//       align: "left",
//     },
//     {
//       field: "phone",
//       headerName: "Phone Number",
//       flex: 1,
//     },
//     {
//       field: "email",
//       headerName: "Email",
//       flex: 1,
//     },
//     {
//       field: "accessLevel",
//       headerName: "Access Level",
//       flex: 1,
//       renderCell: ({ row: { access } }) => {
//         return (
//           <Box
//             width="60%"
//             m="0 auto"
//             p="5px"
//             display="flex"
//             justifyContent="center"
//             backgroundColor={
//               access === "admin"
//                 ? colors.greenAccent[600]
//                 : access === "manager"
//                 ? colors.greenAccent[700]
//                 : colors.greenAccent[700]
//             }
//             borderRadius="4px"
//           >
//             {access === "admin" && <AdminPanelSettingsOutlinedIcon />}
//             {access === "manager" && <SecurityOutlinedIcon />}
//             {access === "user" && <LockOpenOutlinedIcon />}
//             <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
//               {access}
//             </Typography>
//           </Box>
//         );
//       },
//     },
//   ];

//   return (
//     <Box m="20px">
//       <Header title="TEAM" subtitle="Managing the Team Members" />
//       <Box
//         m="40px 0 0 0"
//         height="75vh"
//         sx={{
//           "& .MuiDataGrid-root": {
//             border: "none",
//           },
//           "& .MuiDataGrid-cell": {
//             borderBottom: "none",
//           },
//           "& .name-column--cell": {
//             color: colors.greenAccent[300],
//           },
//           "& .MuiDataGrid-columnHeaders": {
//             backgroundColor: colors.blueAccent[700],
//             borderBottom: "none",
//           },
//           "& .MuiDataGrid-virtualScroller": {
//             backgroundColor: colors.primary[400],
//           },
//           "& .MuiDataGrid-footerContainer": {
//             borderTop: "none",
//             backgroundColor: colors.blueAccent[700],
//           },
//           "& .MuiCheckbox-root": {
//             color: `${colors.greenAccent[200]} !important`,
//           },
//         }}
//       >
//         <DataGrid checkboxSelection rows={mockDataTeam} columns={columns} />
//       </Box>
//     </Box>
//   );
// };

// export default Team;

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material/styles";
import Header from "../../components/Header";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

const validationSchemaEdit = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
 // password: Yup.string().min(6, "Min 6 characters").required("Password is required"),
  role_id: Yup.number().required("Role is required"),
});
const validationSchemaAdd = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Min 6 characters").required("Password is required"),
  role_id: Yup.number().required("Role is required"),
}); //validationSchemaEdit :validationSchemaAdd

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);
  const [roles, setRoles] = useState([]);
  const [managers, setManagers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    const res = await axios.get("/api/users");
    setRows(res.data);
  };

  const fetchRoles = async () => {
    const res = await axios.get("/api/roles");
    setRoles(res.data);
    const response = await axios.get("/api/managers");
      setManagers(response.data);
      console.log(response.data);
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this user?")) {
      await axios.delete(`/api/users/${id}`);
      fetchUsers();
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    values.role_id===3?values.manager_id=values.manager_id:values.manager_id=null;
    values.role_id===2?values.manager_id=1:values.manager_id=null;
    console.log("handleSubmit")
    if (editingUser) {
     let saaampleResult= await axios.put("/api/users/"+editingUser.id, values);
     toast.error(saaampleResult?.response?.data?.message);
    } else {
      let result= await axios.post("/api/users", values);
      console.log("result",result?.response?.data?.message);
      toast.error(result?.response?.data?.message);
    }
    resetForm();
    setOpen(false);
    setEditingUser(null);
    fetchUsers();
  };

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      valueGetter: (params) => params.row.role?.role_name || "",
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: ({ row }) => (
        <>
          <IconButton onClick={() => { setEditingUser(row); setOpen(true); }}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(row.id)} color="error">
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="TEAM" subtitle="Manage Users" />
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => { setEditingUser(null); setOpen(true); }}
        sx={{ mb: 2 }}
      >
        Add User
      </Button>

      <Box height="75vh">
        <DataGrid rows={rows} columns={columns} pageSize={10} />
      </Box>

     
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>{editingUser ? "Edit User" : "Add User"}</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{
              name: editingUser?.name || "",
              email: editingUser?.email || "",
              password: "",
              role_id: editingUser?.role_id || "",
              manager_id: editingUser?.manager_id || "",
            }}
            validationSchema={editingUser?validationSchemaEdit :validationSchemaAdd}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange }) => (
              <Form>
                <TextField
                  label="Name"
                  name="name"
                  fullWidth
                  margin="normal"
                  value={values.name}
                  onChange={handleChange}
                  error={touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                />
                <TextField
                  label="Email"
                  name="email"
                  fullWidth
                  margin="normal"
                  value={values.email}
                  onChange={handleChange}
                  error={touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                />
               {!editingUser && <TextField
                  label="Password"
                  name="password"
                  type="password"
                  fullWidth
                  margin="normal"
                  value={values.password}
                  onChange={handleChange}
                  error={touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                />}
                <TextField
                  select
                  label="Role"
                  name="role_id"
                  fullWidth
                  margin="normal"
                  value={values.role_id}
                  onChange={handleChange}
                  error={touched.role_id && !!errors.role_id}
                  helperText={touched.role_id && errors.role_id}
                >
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.role_name}
                    </MenuItem>
                  ))}
                </TextField>
               {values.role_id==3? <TextField
                  select
                  label="Manager Id"
                  name="manager_id"
                  fullWidth
                  margin="normal"
                  value={values.manager_id}
                  onChange={handleChange}
                  error={touched.manager_id && !!errors.manager_id}
                  helperText={touched.manager_id && errors.manager_id}
                >
                  {managers.map((manager) => (
                    <MenuItem key={manager.id} value={manager.id}>
                      {manager.name}
                    </MenuItem>
                  ))}
                </TextField>:null}
                <DialogActions>
                  <Button onClick={() => setOpen(false)}>Cancel</Button>
                  <Button type="submit" variant="contained">
                    Save
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Team;
