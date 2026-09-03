import * as z from "zod";
const schema = z
  .object({
    name: z
      .string()
      .nonempty("Name is required")
      .min(3, "Must be at least 3 characters")
      .max(20, "Must be 20 characters or less"),
    username: z
      .string()
      .nonempty("Username is required")
      .min(3, "Must be at least 3 characters")
      .max(10, "Must be 10 characters or less"),
    email: z.string().email("Invalid Email").nonempty("email is required"),
    dateOfBirth: z
      .string()
      .min(1, "date is required")
      .refine((dataVal) => {
        const currentYear = new Date().getFullYear();
        const birthYear = new Date(dataVal).getFullYear();
        const ageUser = currentYear - birthYear;
        if (ageUser >= 18) {
          return true;
        } else {
          return false;
        }
      }, "Must be 18 years of age or older"),
    gender: z.string().nonempty("gender is required"),
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
        "Password must be at least 8 characters long and include an uppercase letter, lowercase letter, number, and special character",
      ),
    rePassword: z.string().nonempty("Repassword is required"),
  })
  .refine(
    (obj) => {
      if (obj.password === obj.rePassword) {
        return true;
      } else {
        return false;
      }
    },
    { path: ["rePassword"], message: " Passwords do not match" },
  );
export default schema;
