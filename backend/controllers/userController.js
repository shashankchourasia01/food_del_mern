// import userModel from "../models/userModel.js";
// import jwt from "jsonwebtoken"
// import bcrypt from 'bcrypt'
// import validator from 'validator'



// // Login user
// const loginUser = async (req, res) => {
//     const { email, password } = req.body;
    
//     try {
//         // Check if the user exists
//         const user = await userModel.findOne({ email });
        
//         if (!user) {
//             return res.json({ success: false, message: "User not found" });
//         }
        
//         // Compare the provided password with the stored hashed password
//         const isMatch = await bcrypt.compare(password, user.password);
        
//         if (!isMatch) {
//             return res.json({ success: false, message: "Invalid credentials" });
//         }
        
//         // Generate JWT token
//         const token = createToken(user._id);
        
//         // Return response with the token
//         res.json({ success: true, token });
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: "An error occurred during login" });
//     }
// };



// // const createToken = (id) => {
// //     return jwt.sign((id),process.env.JWT_SECRET)
// // }

// const createToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
// };


// //Register user
// const registerUser = async(req,res) => {
//     const {name,email,password} = req.body;
//     try {
//         //Checking is user already exist
//         const exits = await userModel.findOne({email});
//         if (exits) {
//             return res.json({success:false,message:"User Already Exist"})
//         }

//         //validating email format and strong password 
//         if (!validator.isEmail(email)) {
//             return res.json({success:false,message:"Please enter a valid email"})
//         }

//         if (password.length<8) {
//             return res.json({success:false,message:"Please enter a strong Password"})
//         }

//         //Hashing user password
//         const salt = await bcrypt.genSalt(10)

//         const hashedPassword = await bcrypt.hash(password,salt);

//         const newUser = new userModel({
//             name:name,
//             email:email,
//             password:hashedPassword
//         })

//         const user = await newUser.save()
//         const token = createToken(user._id)
//         res.json({success:true,token})

//     } catch (error) {
//         console.log(error);
//         res.json({success:false,message:"Error"})
        
//     }
// }

// export  { loginUser, registerUser };




import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Create a JWT Token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  
  
  // Validate input
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }
  
  try {
    // Check if the user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = createToken(user._id);
    

    // Return response with the token
    return res.status(200).json({ success: true, token });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ success: false, message: "An error occurred during login" });
  }
};

// Register User
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    // Check if the user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email" });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    // Generate JWT token
    const token = createToken(savedUser._id);

    return res.status(201).json({ success: true, token });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ success: false, message: "An error occurred during registration" });
  }
};

export { loginUser, registerUser };
