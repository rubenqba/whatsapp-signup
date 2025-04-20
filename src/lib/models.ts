import { z } from "zod";
import libphonenumber from 'google-libphonenumber';

const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
const PNF = libphonenumber.PhoneNumberFormat;

export const PhoneNumberSchema = z
  .string()
  .nonempty()
  .refine(
    number => {
      try {
        const phone = phoneUtil.parse(number);
        return phoneUtil.isValidNumber(phone);
      } catch {
        return false;
      }
    },
    { message: 'Invalid phone number' },
  )
  .transform(value => phoneUtil.format(phoneUtil.parse(value), PNF.E164));
export type PhoneNumber = z.infer<typeof PhoneNumberSchema>;

export const TwilioPhoneIDSchema = z
  .string()
  .regex(/^PN[0-9a-fA-F]{32}$/)
  .describe('Twilio Phone ID');

  export const TwilioPhoneAddressRequiredSchema = z
  .enum(['none', 'any', 'local', 'foreign'])
  .describe('Address Requirements');
export type TwilioPhoneAddressRequired = z.infer<typeof TwilioPhoneAddressRequiredSchema>;

export const TwilioPhoneRequirementsSchema = z.object({
  type: TwilioPhoneAddressRequiredSchema.describe('Address Requirements'),
  bundle: z.string().nullish().describe('Bundle ID'),
  address: z.string().nullish().describe('Address ID'),
});
export type TwilioPhoneRequirements = z.infer<typeof TwilioPhoneRequirementsSchema>;

export const TwilioPhoneOriginSchema = z.enum(['twilio', 'hosted']).describe('Phone Number Origin');
export type TwilioPhoneOrigin = z.infer<typeof TwilioPhoneOriginSchema>;

export const TwilioPhoneNumberSchema = z.object({
  id: TwilioPhoneIDSchema,
  account: z.string().describe('User Account ID'),
  number: PhoneNumberSchema.describe('Twilio Number'),
  origin: TwilioPhoneOriginSchema.describe('Phone Number Origin'),
  requirements: TwilioPhoneRequirementsSchema.describe('Phone Number Requirements'),
  status: z.string().describe('Twilio Number Status'),
  created: z.coerce.date().default(() => new Date()),
  updated: z.coerce.date().default(() => new Date()),
});
export type TwilioPhoneNumber = z.infer<typeof TwilioPhoneNumberSchema>;
