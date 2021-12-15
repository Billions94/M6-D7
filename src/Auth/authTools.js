import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;

export const tokenGenerator = async (author) => {
  const accessToken = await generateJWTToken({ _id: author._id });
  const refreshToken = await generateRefreshJWTToken({ _id: author._id });

  author.refreshToken = refreshToken;
  await author.save();

  return { accessToken, refreshToken };
};

const generateJWTToken = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, { expiresIn: "15m" }, (err, token) => {
      if (err) reject(err);
      else resolve(token);
    });
  });
};

const generateRefreshJWTToken = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, refreshSecret, { expiresIn: "1 week" }, (err, token) => {
      if (err) reject(err);
      else resolve(token);
    });
  });
};

export const verifyJWT = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) reject(err);
      else resolve(decodedToken);
    });
  });
};

export const verifyRefreshJWT = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, refreshSecret, (err, decodedToken) => {
      if (err) reject(err);
      else resolve(decodedToken);
    });
  });
};


export const refreshTokens = async actualRefreshToken => {
    try {
      // 1. Is the actual refresh token still valid?
  
      const decoded = await verifyRefreshJWT(actualRefreshToken)
  
      // 2. If the token is valid we are going to find the user in db
  
      const user = await UserModel.findById(decoded._id)
  
      if (!user) throw new Error("User not found")
  
      // 3. Once we have the user we can compare actualRefreshToken with the one stored in db
  
      if (actualRefreshToken === user.refreshToken) {
        // 4. If everything is fine we can generate the new pair of tokens
  
        const { accessToken, refreshToken } = await JWTAuthenticate(user)
        return { accessToken, refreshToken }
      } else {
      }
    } catch (error) {
      throw new Error("Token not valid!")
    }
  }
