import React from "react";
import { Dialog, DialogTitle, DialogContent,Typography, DialogActions, Button, Grid,useTheme,IconButton } from "@mui/material";
import { Formik, Form,useFormikContext, useField  } from "formik";
import AutoCalculatePrice from "./AutoCalculateFields"
import CloseIcon from '@mui/icons-material/Close';
import { useEffect } from "react";
import { tokens } from "../theme";
import * as Yup from "yup";
import FormInput from "./FormInput";

const ReusableFormModal = ({ open, handleClose, title, formFields, initialValues, validationSchema, onSubmit }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
    <Dialog open={open} //onClose={handleClose}
    onClose={(event, reason) => {
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
          handleClose();
        }
      }}
      disableEscapeKeyDown fullWidth maxWidth="sm">
    <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
  <Typography variant="h6">{title}</Typography>
  <IconButton onClick={handleClose}>
    <CloseIcon />
  </IconButton>
</DialogTitle>
      <DialogContent>
        <Formik initialValues={initialValues} validationSchema={validationSchema}  onSubmit={(values, { setSubmitting }) => {
    onSubmit(values); // Ensure this is properly passed
    setSubmitting(false);
  }}>
          {({ isSubmitting ,setFieldValue,handleSubmit}) => (
            <Form>
              <Grid container spacing={2}>
                {formFields.map((field) => (
                  <Grid  item xs={field.fullWidth ? 12 : 6} key={field.name}>
                    <FormInput {...field} form={{ setFieldValue }} />
                  </Grid>
                ))}
              </Grid>
              <DialogActions>
                <Button onClick={handleClose} color="secondary">Cancel</Button>
                <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Submit"}
                </Button>
              </DialogActions>
              <AutoCalculatePrice
  costField="cost_price"
  calcTypeField="calc_type"
  calcValueField="calc_value"
  sellingPriceField="selling_price"
/>
            </Form>
          )}
        

        </Formik>
      </DialogContent>
    </Dialog>
  );
};




export default ReusableFormModal;
