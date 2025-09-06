import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,useTheme } from "@mui/material";
import { Formik, Form, Field } from "formik";

import { tokens } from "../theme";
import * as Yup from "yup";


const ModalForm = ({ open, handleClose, initialValues, onSubmit, validationSchema, title }) => {
    const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Dialog open={open}  onClose={(event, reason) => {
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
          handleClose();
        }
      }}
      disableEscapeKeyDown   disableScrollLock={true}>
      <DialogTitle>{title}</DialogTitle>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ errors, touched, isSubmitting  }) => (
          <Form>
            <DialogContent>
              <Field
                as={TextField}
                label="Product ID"
                name="product_id"
                fullWidth
                error={touched.product_id && !!errors.product_id}
                helperText={touched.product_id && errors.product_id}
                margin="dense"
              />
              <Field
                as={TextField}
                label="Quantity"
                name="quantity"
                fullWidth
                type="number"
                error={touched.quantity && !!errors.quantity}
                helperText={touched.quantity && errors.quantity}
                margin="dense"
              />
              <Field
                as={TextField}
                label="Price"
                name="price"
                fullWidth
                type="number"
                error={touched.price && !!errors.price}
                helperText={touched.price && errors.price}
                margin="dense"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} sx={{color:colors.grey[300]}} >Cancel</Button>
              <Button type="submit" color="secondary" variant="contained" disabled={isSubmitting}> {isSubmitting ? "Submitting..." : "Submit"}</Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default ModalForm;
