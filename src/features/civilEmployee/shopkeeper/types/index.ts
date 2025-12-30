export interface Worker  {
  name: string;
  aadhar: string;
  type: string;
}

export interface Shopkeeper {
  shopName: string;
  shopAddress: string;
  unit: string;

  ownerName: string;
  ownerMobile: string;
  ownerAadhar: string;

  priceListApproved: boolean;
  priceListEffectiveFrom: string | null;

  workers: Worker[];

  validFrom: string | null; 
  validTill: string | null; 
}

export interface TempWorker {
  name: string;
  aadhar: string;
  type: string;
}