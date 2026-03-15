export interface Boat {
  id: string;
  title: string;
  description: string;
  boatType: 'YACHT' | 'SPEEDBOAT' | 'SAILBOAT';
  capacity: number;
  pricePerHour: number;
  pricePerSeat: number;
  marina: string;
  captainIncluded: boolean;
  photos: string[];
}
