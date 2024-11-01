export const jwtConfig = {
	secret: process.env.SECRET,
	expiry: process.env.TOKEN_EXPIRY_HOUR,
	saltRound: 3,
};
