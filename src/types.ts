export type RoleType =
  | 'Farmer'
  | 'Aggregator/Trader'
  | 'Transporter'
  | 'Buyer/Wholesaler'
  | 'Processor'
  | 'Other';

export type ProduceType =
  | 'Tomatoes'
  | 'Peppers (Rodo / Tatase / Bawa)'
  | 'Onions'
  | 'Leafy Vegetables'
  | 'Fruits'
  | 'Other';

export type ChallengeType =
  | 'Finding Reliable Buyers'
  | 'Transport Delays & Breakdowns'
  | 'Produce Spoilage / Post-Harvest Losses'
  | 'Late or Unclear Payments'
  | 'Other';

export interface EarlyAccessFormData {
  fullName: string;
  whatsappNumber: string;
  role: RoleType;
  cityOrState: string;
  mainProduce: ProduceType;
  biggestChallenge: ChallengeType;
  wouldLikeEarlyAccess: 'Yes' | 'Maybe' | 'No';
}

export interface SurveyFormData {
  roleDescription: string;
  produceTypes: string[];
  cityOrState: string;
  biggestChallenge: string;
  estimatedLoss: string;
  currentTools: string[];
  preferredPayment: string;
  launchInterest: string;
  mustHaveFeature: string;
  fullName: string;
  whatsappNumber: string;
  email: string;
}
