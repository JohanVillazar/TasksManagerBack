import { DataTypes } from "sequelize";
import sequelize from "./db.js";
import bcrypt from "bcryptjs";


const User = sequelize.define("User", {
    id: {
        type: DataTypes.UUID, // UUID para mayor seguridad
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
    },
    phone:{
        type: DataTypes.STRING,
        allowNull: true,

    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    photo: {
        type: DataTypes.STRING, 
        allowNull: true,
      },

    resetToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resetTokenExpires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      
    role: { 
        type: DataTypes.ENUM("user", "admin"),  
        allowNull: false,
        defaultValue: "user" 
    }


}, {
    tableName: "User",
    hooks: {
        beforeCreate: async (user) => {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }
    }
     
},
{ timestamps: true,
  freezeTableName: true
 }

);





export default User; 


