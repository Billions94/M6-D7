import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const AuthorSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    role: { type: String, default: "User", enum: ["User", "Admin"] },
    refreshToken: { type: String },
    googleId: {
      type: String,
      required: function () {
        return !this.password;
      },
    },
  },
  {
    timestamps: true,
  }
);

AuthorSchema.pre("save", async function (next) {
  const newAuthor = this;

  const plainPw = newAuthor.password;

  console.log("=======================> plain password before hash", plainPw);
  if (newAuthor.isModified("password")) {
    const hash = await bcrypt.hash(plainPw, 10);
    newAuthor.password = hash;
    console.log("=======================> plain password after hash", hash);
  }
  next();
});

AuthorSchema.methods.toJSON = function () {
  const authorDoc = this;
  const authorObject = authorDoc.toObject();
  delete authorObject.password;
  delete authorObject.__v;
  delete userObject.refreshToken;

  return authorObject;
};

AuthorSchema.statics.verifyCredentials = async function (email, plainPw) {
  const author = await this.findOne({ email });

  if (author) {
    const isMatch = await bcrypt.compare(plainPw, author.password);
    if (isMatch) {
      console.log("matched!!!!");
      return author;
    } else {
      return null;
    }
  } else {
    return null;
  }
};

export default model("Author", AuthorSchema);
