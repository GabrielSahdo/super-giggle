import { DataTypes, Model } from "sequelize";

export class User extends Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                primaryKey: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false
            },
            hashedPassword: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }, {
            sequelize,
            modelName: "User"
        });
    }
}
