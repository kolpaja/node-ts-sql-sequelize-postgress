import { JwtPayload } from 'jsonwebtoken';

export enum Roles {
	guest = 'GUEST',
	admin = 'ADMIN',
	user = 'USER',
}

export enum PaymentType {
	CASH = 'CASH',
	CREDIT = 'CREDIT',
	DEBIT = 'DEBIT',
	TRANSFER = 'TRANSFER',
}

export enum TransactionType {
	OUT = 'output',
	IN = 'input',
	TRANSFER = 'transfer',
}
export enum TransactionPeriod {
	MORNING = 'morning',
	NOON = 'noon',
	NIGHT = 'night',
}

export enum AccountType {
	CASH = 'CASH',
	DEBIT_CARD = 'DEBIT_CARD',
	PAYPAL = 'PAYPAL',
	OTHER_DEBIT = 'OTHER_DEBIT',
	CREDIT_CARD = 'CREDIT_CARD',
	OTHER_CREDIT = 'OTHER_CREDIT',
	STOCK = 'STOCK',
	FUND = 'FUND',
	MEMBERSHIP = 'MEMBERSHIP',
	SCHOOL_CARD = 'SCHOOL_CARD',
	TRANSPORT_CARD = 'TRANSPORT_CARD',
	SAVINGS_ACCOUNT = 'SAVINGS_ACCOUNT',
	CHECKING_ACCOUNT = 'CHECKING_ACCOUNT',
	CRYPTOCURRENCY = 'CRYPTOCURRENCY',
	GIFT_CARD = 'GIFT_CARD',
	LOYALTY_PROGRAM = 'LOYALTY_PROGRAM',
	TRAVEL_ACCOUNT = 'TRAVEL_ACCOUNT',
	EMPLOYEE_EXPENSES = 'EMPLOYEE_EXPENSES',
	HEALTH_SAVINGS_ACCOUNT = 'HEALTH_SAVINGS_ACCOUNT',
	OTHER = 'OTHER',
}

export interface JwtPayloadRes extends JwtPayload {
	email: string;
	email_verified: string;
	user_id: string;
	aud: string;
	role: Roles;
}
