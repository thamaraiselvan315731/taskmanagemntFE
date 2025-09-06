import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

const AddEditDialog = ({ open, onClose, onSave, initialValues, title }) => {
  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      quantity: Yup.number().min(1, "Must be greater than 0").required("Required"),
      price: Yup.number().min(1, "Must be valid").required("Required"),
    }),
    onSubmit: onSave,
  });

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          {...formik.getFieldProps("name")}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <TextField
          label="Quantity"
          fullWidth
          margin="normal"
          type="number"
          {...formik.getFieldProps("quantity")}
          error={formik.touched.quantity && Boolean(formik.errors.quantity)}
          helperText={formik.touched.quantity && formik.errors.quantity}
        />
        <TextField
          label="Price"
          fullWidth
          margin="normal"
          type="number"
          {...formik.getFieldProps("price")}
          error={formik.touched.price && Boolean(formik.errors.price)}
          helperText={formik.touched.price && formik.errors.price}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={formik.handleSubmit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEditDialog;
