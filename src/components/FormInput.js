import React, { useState } from "react";
import { TextField, MenuItem, RadioGroup,useTheme, FormControlLabel, Radio, Checkbox, FormControl, FormLabel, Select, Button } from "@mui/material";
import { useField } from "formik";
import { tokens } from "../theme";
import Autocomplete from "@mui/material/Autocomplete";
const FormInput = ({ label, name, type = "text", options = [], ...props }) => {
  const [field, meta, helpers] = useField(name);
  const [preview, setPreview] = useState(field.value || ""); // Show preview if image exists
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        helpers.setValue(base64String); // Store Base64 image in Formik state
        setPreview(base64String); // Update preview
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <FormControl fullWidth sx={{  mt:3}}>
      {["text", "number", "tel"].includes(type) && (
        <TextField {...field} {...props} type={type}  label={label} error={meta.touched && Boolean(meta.error)} helperText={meta.touched && meta.error} />
      )}

      {type === "select" && (
        <>
          <FormLabel>{label}</FormLabel>
          <Select {...field} error={meta.touched && Boolean(meta.error)}>
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {meta.touched && meta.error && <div style={{ color: "red", fontSize: "12px" }}>{meta.error}</div>}
        </>
      )}

        {type === "autocomplete" && (
        <Autocomplete
            freeSolo
            options={options}
         
            getOptionLabel={(option) => typeof option === "string" ? option : option.label} // Extract label
          
            onChange={(event, newValue) => {
                if (typeof newValue === "string") {
                    helpers.setValue(newValue);
                } else if (newValue && newValue.value) {
                    helpers.setValue(newValue.value);  // Extract `value` if it's an object
                     // Auto-fill another field if autoFillOption is enabled
        if (props?.autoFillOption && props?.property) {
          props.form.setFieldValue(props.property, newValue?.product_id || ""); 
        }
                } else {
                    helpers.setValue(""); // Reset if null
                }
                
            }}
            value={field.value}
            // onChange={(event, newValue) => helpers.setValue(newValue)}
            
            renderInput={(params) => (
            <TextField {...params} label={label} error={meta.touched && Boolean(meta.error)} helperText={meta.touched && meta.error} />
            )}
        />
        )}

      {type === "radio" && (
        <>
          <FormLabel>{label}</FormLabel>
          <RadioGroup row {...field}>
            {options.map((option) => (
              <FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} />
            ))}
          </RadioGroup>
        </>
      )}

      {type === "checkbox" && <FormControlLabel control={<Checkbox {...field} checked={field.value} />} label={label} />}

      {type === "image" && (
        <>
          <input accept="image/*" type="file" onChange={handleImageChange} />
          {preview && <img src={preview} alt="Preview" style={{ width: "100px", height: "100px", marginTop: "10px" }} />}
        </>
      )}
    </FormControl>
  );
};



  

// const FormInput = ({ label, name, type = "text", options = [], ...props }) => {
//   const [field, meta] = useField(name);

//   return (
//     <FormControl fullWidth sx={{ mb: 2 }}>
//       {["text", "number", "tel"].includes(type) && (
//         <TextField
//           {...field}
//           {...props}
//           type={type}
//           label={label}
//           error={meta.touched && Boolean(meta.error)}
//           helperText={meta.touched && meta.error}
//         />
//       )}

//       {type === "select" && (
//         <>
//           <FormLabel>{label}</FormLabel>
//           <Select {...field} error={meta.touched && Boolean(meta.error)}>
//             {options.map((option) => (
//               <MenuItem key={option.value} value={option.value}>
//                 {option.label}
//               </MenuItem>
//             ))}
//           </Select>
//           {meta.touched && meta.error && <div style={{ color: "red", fontSize: "12px" }}>{meta.error}</div>}
//         </>
//       )}

//       {type === "radio" && (
//         <>
//           <FormLabel>{label}</FormLabel>
//           <RadioGroup row {...field}>
//             {options.map((option) => (
//               <FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} />
//             ))}
//           </RadioGroup>
//         </>
//       )}

//       {type === "checkbox" && (
//         <FormControlLabel
//           control={<Checkbox {...field} checked={field.value} />}
//           label={label}
//         />
//       )}
//     </FormControl>
//   );
// };

export default FormInput;
