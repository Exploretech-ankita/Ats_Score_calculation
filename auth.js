import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();



router.post("/register", async(req,res)=>{


    try{

        const {
            fullname,
            phone,
            email,
            password
        } = req.body;


        const existingUser = await User.findOne({
            email
        });


        if(existingUser)
        {
            return res.status(400).json({
                message:"Email already exists"
            });
        }



        const hashPassword = await bcrypt.hash(password,10);



        const newUser = new User({

            fullname,
            phone,
            email,
            password:hashPassword

        });



        await newUser.save();


        res.status(201).json({
            message:"Registration successful"
        });


    }
    catch(error){

        res.status(500).json({
            error:error.message
        });

    }


});

router.get("/profile/:email", async(req,res)=>{

    try{

        const user = await User.findOne({
            email:req.params.email
        }).select("-password");


        if(!user)
        {
            return res.status(404).json({
                message:"User not found"
            });
        }


        res.json(user);


    }
    catch(error)
    {
        res.status(500).json({
            error:error.message
        });
    }

});

router.post("/login", async(req,res)=>{

    try{

        const { phone, password } = req.body;

        console.log("Phone:", phone);
        console.log("Password entered:", password);


        const user = await User.findOne({
            phone: phone
        });


        console.log("Database user:", user);


        if(!user)
        {
            return res.status(404).json({
                message:"User not found"
            });
        }


        const isMatch = await bcrypt.compare(
            password,
            user.password
        );


        console.log("Password match:", isMatch);


        if(!isMatch)
        {
            return res.status(401).json({
                message:"Wrong password"
            });
        }


        res.json({
            email:user.email,
            fullname:user.fullname,
            phone:user.phone
        });


    }
    catch(error){

        res.status(500).json({
            error:error.message
        });

    }

});
router.put("/profile/:email", async (req, res) => {
    try {

        const email = req.params.email;

        const updateData = {
            fullname: req.body.name,
            phone: req.body.phone,
            email: req.body.email
        };


        // Update password only if user entered a new password
        if (req.body.password && req.body.password !== "********") {

            const hashedPassword = await bcrypt.hash(
                req.body.password,
                10
            );

            updateData.password = hashedPassword;
        }


        const updatedUser = await User.findOneAndUpdate(
            { email: email },
            updateData,
            { new: true }
        );


        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }


       const {password,...safeUser}=updatedUser.toObject();

res.json({
    message:"Profile updated successfully",
    user:safeUser
});

    } catch(error) {

        res.status(500).json({
            message: error.message
        });

    }
});
export default router;