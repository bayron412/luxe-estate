export interface Property {
  id: string;
  title: string;
  price: string; // Formatting standard to just display text
  location: string;
  beds: number;
  baths: number;
  area: string; // e.g. "4,200 m²"
  imageUrl: string;
  isRental: boolean;
  statusTag: string; // e.g. "Exclusive", "FOR SALE", "FOR RENT"
}

export interface FeaturedProperty extends Property {
  isFeatured: boolean;
}
