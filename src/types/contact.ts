export interface EmailEntry {
  address: string;
  type: string;
  primary: boolean;
}

export interface PhoneEntry {
  number: string;
  type: string;
  primary: boolean;
}

export interface WebsiteEntry {
  url: string;
  type: string;
  primary: boolean;
}

export interface AddressEntry {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  type: string;
  primary: boolean;
}
