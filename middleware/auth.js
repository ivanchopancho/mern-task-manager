import jwt from "jsonwebtoken";


export const authMiddleware = (req, res , next) => {
    const authHeader = req.headers.authorization;

    //check if token was sent
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided"});
    }

    //extract just the token string
    const token = authHeader.split(" ")[1];

    try {
        //decode and verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //modify the received request so that req.userId =
        //the property .userId inside of the payload "decoded" returned by jwt.verify()

        req.user = { id: decoded.userId };

        next(); //continues to the route handler
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
export default auth