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

export const VERTICAL_OPTIONS = new Map<string, string>([
  ['automotive', 'Automotive'],
  ['beauty-spa-and-salon', 'Beauty, Spa and Salon'],
  ['clothing-and-apparel', 'Clothing and Apparel'],
  ['education', 'Education'],
  ['entertainment', 'Entertainment'],
  ['event-planning-and-service', 'Event Planning and Service'],
  ['finance-and-banking', 'Finance and Banking'],
  ['food-and-grocery', 'Food and Grocery'],
  ['public-service', 'Public Service'],
  ['hotel-and-lodging', 'Hotel and Lodging'],
  ['medical-and-health', 'Medical and Health'],
  ['non-profit', 'Non-profit'],
  ['professional-services', 'Professional Services'],
  ['shopping-and-retail', 'Shopping and Retail'],
  ['travel-and-transportation', 'Travel and Transportation'],
  ['restaurant', 'Restaurant'],
  ['other', 'Other'],
]);

// Creamos el schema tipo enum
const verticalKeys = Array.from(VERTICAL_OPTIONS.keys());
export const BusinessTypeSchema = z.enum([verticalKeys[0], ...verticalKeys.slice(1)] as [string, ...string[]]);

export const TwilioWhatsappSenderProfileSchema = z.object({
  name: z.string().describe('Contact Name'),
  address: z.string().nullish().describe('Address to show in contact information'),
  emails: z.array(z.string()).nullish().describe('Contact Emails'),
  businessType: BusinessTypeSchema.describe('Business Type'),
  logo_url: z.string().url().nullish().describe('Logo URL'),
  description: z.string().nullish().describe('Business Description'),
  about: z.string().nullish().describe('Business tag line'),
  websites: z.array(z.string()).nullish().describe('Business Websites'),
});
export type TwilioWhatsappSenderProfile = z.infer<typeof TwilioWhatsappSenderProfileSchema>;
